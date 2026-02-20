import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../storage';
import { db } from '../db';
import { blogComments } from '../../shared/schema';
import * as drizzleOrm from 'drizzle-orm';

// Mock drizzle-orm
vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm');
  return {
    ...actual,
    eq: vi.fn(),
    desc: vi.fn(),
  };
});

// Mock the db instance
vi.mock('../db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn(),
  },
}));

describe('DatabaseStorage - getCommentsByPostSlug', () => {
  const mockComments = [
    {
      id: 1,
      post_slug: 'test-post',
      author_name: 'User 1',
      comment: 'First comment',
      created_at: new Date('2023-01-01'),
    },
    {
      id: 2,
      post_slug: 'test-post',
      author_name: 'User 2',
      comment: 'Second comment',
      created_at: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default chainable behavior
    (db.select() as any).from.mockReturnThis();
    (db.select().from(blogComments) as any).where.mockReturnThis();
  });

  it('should fetch comments for a specific post slug and order them by creation date descending', async () => {
    // Arrange
    const slug = 'test-post';
    const mockData = [...mockComments].reverse();

    // Mock eq and desc to return unique marker objects
    const mockEqResult = { type: 'eq' };
    const mockDescResult = { type: 'desc' };
    vi.mocked(drizzleOrm.eq).mockReturnValue(mockEqResult as any);
    vi.mocked(drizzleOrm.desc).mockReturnValue(mockDescResult as any);

    // Setup the final call in the chain
    vi.mocked(db.orderBy).mockResolvedValue(mockData);

    // Act
    const result = await storage.getCommentsByPostSlug(slug);

    // Assert
    expect(db.select).toHaveBeenCalled();
    expect(db.from).toHaveBeenCalledWith(blogComments);

    // Verify filtering logic
    expect(drizzleOrm.eq).toHaveBeenCalledWith(blogComments.post_slug, slug);
    expect(db.where).toHaveBeenCalledWith(mockEqResult);

    // Verify ordering logic
    expect(drizzleOrm.desc).toHaveBeenCalledWith(blogComments.created_at);
    expect(db.orderBy).toHaveBeenCalledWith(mockDescResult);

    expect(result).toEqual(mockData);
  });

  it('should return an empty array if no comments exist for the slug', async () => {
    // Arrange
    const slug = 'non-existent-post';
    vi.mocked(db.orderBy).mockResolvedValue([]);

    // Act
    const result = await storage.getCommentsByPostSlug(slug);

    // Assert
    expect(result).toEqual([]);
    expect(db.where).toHaveBeenCalled();
    expect(db.orderBy).toHaveBeenCalled();
  });
});
