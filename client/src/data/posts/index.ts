import type { BlogPost } from "./types";
import { post as rcTips } from "./7-rc-tips-rules";
import { post as masteringLR } from "./mastering-logical-reasoning";
import { post as weakenStrategy } from "./weaken-question-strategy";
import { post as scoreTimeline } from "./score-improvement-timeline";

export type { BlogPost };

export const blogPosts: BlogPost[] = [
  rcTips,
  masteringLR,
  weakenStrategy,
  scoreTimeline,
];
