import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Home, BookOpen, Eye, Users, ChevronDown, ChevronRight } from "lucide-react";

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

interface GroupedPassage {
  passage_id: string;
  prep_test_number: number;
  section_number: number;
  passage_number_in_section: number;
  passage_difficulty: number;
  passage_categories: string;
  questions: RCQuestion[];
}

interface SelectedPassages {
  [passageId: string]: boolean;
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
  const { user, isLoading } = useAuthRedirect();
  const [location, setLocation] = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [rcFilters]);

  // Selected questions and passages for custom set creation
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestions>({});
  const [selectedPassages, setSelectedPassages] = useState<SelectedPassages>({});
  const [expandedPassages, setExpandedPassages] = useState<{[passageId: string]: boolean}>({});
  
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

  // Group questions by passage
  const groupedPassages: GroupedPassage[] = rcQuestions.reduce((acc, question) => {
    const existingPassage = acc.find(p => p.passage_id === question.passage_id);
    
    if (existingPassage) {
      existingPassage.questions.push(question);
    } else {
      acc.push({
        passage_id: question.passage_id,
        prep_test_number: question.prep_test_number,
        section_number: question.section_number,
        passage_number_in_section: question.passage_number_in_section,
        passage_difficulty: question.passage_difficulty,
        passage_categories: question.passage_categories,
        questions: [question]
      });
    }
    return acc;
  }, [] as GroupedPassage[]);

  // Calculate pagination based on passages
  const passagesPerPage = 10;
  const totalPages = Math.ceil(groupedPassages.length / passagesPerPage);
  const paginatedPassages = groupedPassages.slice(
    (currentPage - 1) * passagesPerPage,
    currentPage * passagesPerPage
  );

  // Selection handling
  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const togglePassageSelection = (passageId: string, questions: RCQuestion[]) => {
    const isPassageSelected = selectedPassages[passageId];
    
    setSelectedPassages(prev => ({
      ...prev,
      [passageId]: !isPassageSelected
    }));

    // Auto-select/deselect all questions in the passage
    const updatedQuestions = { ...selectedQuestions };
    questions.forEach(question => {
      updatedQuestions[question.question_id] = !isPassageSelected;
    });
    setSelectedQuestions(updatedQuestions);
  };

  const togglePassageExpansion = (passageId: string) => {
    setExpandedPassages(prev => ({
      ...prev,
      [passageId]: !prev[passageId]
    }));
  };

  const isPassageSelected = (passageId: string, questions: RCQuestion[]) => {
    return questions.every(q => selectedQuestions[q.question_id]);
  };

  const isPassagePartiallySelected = (questions: RCQuestion[]) => {
    const selectedInPassage = questions.filter(q => selectedQuestions[q.question_id]);
    return selectedInPassage.length > 0 && selectedInPassage.length < questions.length;
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
                    {rcQuestionsLoading ? "Loading..." : `${groupedPassages.length} passages • ${rcQuestions.length} total questions`}
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
              ) : paginatedPassages.length > 0 ? (
                <div className="space-y-4">
                  {paginatedPassages.map((passage) => {
                    const isSelected = isPassageSelected(passage.passage_id, passage.questions);
                    const isPartiallySelected = isPassagePartiallySelected(passage.questions);
                    const isExpanded = expandedPassages[passage.passage_id];
                    
                    return (
                      <Card key={passage.passage_id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <div className="p-4">
                          {/* Passage Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={isSelected}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = isPartiallySelected && !isSelected;
                                  }
                                }}
                                onCheckedChange={() => togglePassageSelection(passage.passage_id, passage.questions)}
                              />
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-lg">
                                  LSAT {passage.prep_test_number} - Passage {passage.passage_number_in_section}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">
                                Section {passage.section_number}
                              </Badge>
                              <Badge variant="outline">
                                {passage.questions.length} questions
                              </Badge>
                              {passage.passage_difficulty && (
                                <Badge variant="outline">
                                  Difficulty: {passage.passage_difficulty}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePassageExpansion(passage.passage_id)}
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {/* Passage Categories */}
                          <div className="flex items-center space-x-2 mb-3">
                            {passage.passage_categories && (
                              <Badge variant="secondary">{passage.passage_categories}</Badge>
                            )}
                          </div>
                          
                          {/* Expandable Questions */}
                          <Collapsible open={isExpanded} onOpenChange={() => togglePassageExpansion(passage.passage_id)}>
                            <CollapsibleContent className="space-y-2">
                              <div className="border-t pt-3 mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Questions in this passage:</h4>
                                <div className="space-y-2">
                                  {passage.questions.map((question) => (
                                    <div key={question.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={selectedQuestions[question.question_id] || false}
                                          onCheckedChange={() => toggleQuestionSelection(question.question_id)}
                                        />
                                        <span className="text-sm">
                                          Question {question.question_number_in_passage}
                                        </span>
                                        {question.question_difficulty && (
                                          <Badge variant="outline" className="text-xs">
                                            Difficulty: {question.question_difficulty}
                                          </Badge>
                                        )}
                                        {question.question_categories && (
                                          <Badge variant="outline" className="text-xs">
                                            {question.question_categories}
                                          </Badge>
                                        )}
                                      </div>
                                      <Button size="sm" variant="ghost">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Practice
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </Card>
                    );
                  })}
                  
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
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
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
                    ? "No passages match your current filters" 
                    : "No Reading Comprehension passages available"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}