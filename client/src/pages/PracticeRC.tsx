import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Home, BookOpen, Eye, Users } from "lucide-react";

interface RCQuestion {
  id: number;
  prep_test_number: number;
  section_number: number;
  question_id: string;
  question_difficulty: number;
  passage_id: string;
  passage_number_in_section: number;
  passage_difficulty: number;
  passage_categories: string;
  question_categories: string;
  question_number_in_passage: number;
}

interface RCFilters {
  passageCategories: string[];
  questionCategories: string[];
  difficulty: number[];
  prepTests: number[];
}

interface SelectedQuestions {
  [questionId: string]: boolean;
}

const RC_PASSAGE_CATEGORIES = [
  "Art", "Comparative", "Debate", "Humanities", "Hypothesis", "Law", 
  "One-Position", "Problem Analysis", "Science", "Single-Topic"
];

const RC_QUESTION_CATEGORIES = [
  "Analogy", "Application", "Approach", "Author Attitude", "Function", "Inference", 
  "Main Idea", "Purpose of Paragraph", "Strengthen-Weaken", "Structure", "Tone"
];

export default function PracticeRC() {
  const [location, setLocation] = useLocation();
  
  // RC filters
  const [rcFilters, setRCFilters] = useState<RCFilters>({
    passageCategories: [],
    questionCategories: [],
    difficulty: [],
    prepTests: []
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 50;

  // Selected questions for custom set creation
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestions>({});
  
  // Fetch RC questions only
  const { data: rcQuestions = [], isLoading: rcQuestionsLoading } = useQuery<RCQuestion[]>({
    queryKey: ['/api/lsat/rc-questions', rcFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        filters: JSON.stringify(rcFilters)
      });
      
      console.log('Fetching RC questions with filters:', rcFilters);
      const response = await fetch(`/api/lsat/rc-questions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch RC questions');
      }
      const data = await response.json();
      console.log('RC questions fetched:', data.length, 'questions');
      return data;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(rcQuestions.length / questionsPerPage);
  const paginatedQuestions = rcQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Selection handling
  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const selectedCount = Object.values(selectedQuestions).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Practice Reading Comprehension
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedCount > 0 ? "default" : "outline"}
              disabled={selectedCount === 0}
              className="flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Create Set from Selections ({selectedCount})
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Browse and practice Reading Comprehension passages and questions
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* RC Filters Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Passage Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Passage Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {RC_PASSAGE_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`passage-${category}`}
                        checked={rcFilters.passageCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRCFilters(prev => ({
                              ...prev,
                              passageCategories: [...prev.passageCategories, category]
                            }));
                          } else {
                            setRCFilters(prev => ({
                              ...prev,
                              passageCategories: prev.passageCategories.filter(c => c !== category)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`passage-${category}`} className="text-xs">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Question Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {RC_QUESTION_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`question-${category}`}
                        checked={rcFilters.questionCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRCFilters(prev => ({
                              ...prev,
                              questionCategories: [...prev.questionCategories, category]
                            }));
                          } else {
                            setRCFilters(prev => ({
                              ...prev,
                              questionCategories: prev.questionCategories.filter(c => c !== category)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`question-${category}`} className="text-xs">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Difficulty</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((diff) => (
                    <div key={diff} className="flex items-center space-x-1">
                      <Checkbox
                        id={`difficulty-${diff}`}
                        checked={rcFilters.difficulty.includes(diff)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRCFilters(prev => ({
                              ...prev,
                              difficulty: [...prev.difficulty, diff]
                            }));
                          } else {
                            setRCFilters(prev => ({
                              ...prev,
                              difficulty: prev.difficulty.filter(d => d !== diff)
                            }));
                          }
                        }}
                      />
                      <Label className="text-xs">{diff}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RC Questions Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reading Comprehension Questions</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {rcQuestionsLoading ? "Loading..." : `${rcQuestions.length} total questions`}
                  </Badge>
                  {totalPages > 1 && (
                    <Badge variant="secondary">
                      Page {currentPage} of {totalPages}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {rcQuestionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading RC questions...</p>
                </div>
              ) : paginatedQuestions.length > 0 ? (
                <div className="space-y-4">
                  {paginatedQuestions.map((question) => (
                    <Card key={question.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedQuestions[question.question_id] || false}
                            onCheckedChange={() => toggleQuestionSelection(question.question_id)}
                          />
                          <Badge variant="secondary">
                            LSAT {question.prep_test_number}
                          </Badge>
                          <Badge variant="outline">
                            Section {question.section_number}
                          </Badge>
                          <Badge variant="outline">
                            Question {question.question_number_in_passage}
                          </Badge>
                          {question.question_difficulty && (
                            <Badge variant="outline">
                              Difficulty: {question.question_difficulty}
                            </Badge>
                          )}
                        </div>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Practice
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {question.passage_categories && (
                          <Badge variant="secondary">{question.passage_categories}</Badge>
                        )}
                        {question.question_categories && (
                          <Badge variant="outline">{question.question_categories}</Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 py-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {rcFilters.passageCategories.length > 0 || rcFilters.questionCategories.length > 0 || rcFilters.difficulty.length > 0
                    ? "No questions match your current filters" 
                    : "No Reading Comprehension questions available"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}