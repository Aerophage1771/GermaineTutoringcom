import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, Brain, BookOpen, Plus, Filter, Search } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Question {
  id: number;
  prep_test_number: number;
  section_number: number;
  question_number_in_section: number;
  question_id: string;
  question_difficulty: number;
  question_type?: string;
  skills?: string;
  passage_id?: string;
}

interface QuestionFilters {
  type: 'lr' | 'rc';
  questionTypes: string[];
  skills: string[];
  difficulty: number[];
  prepTests: number[];
  passageCategories: string[];
  questionCategories: string[];
}

export default function QuestionSetCreator() {
  const { user, isLoading } = useAuthRedirect();
  const [location, setLocation] = useLocation();
  
  const [setName, setSetName] = useState("");
  const [setType, setSetType] = useState<'lr' | 'rc'>('lr');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState<QuestionFilters>({
    type: 'lr',
    questionTypes: [],
    skills: [],
    difficulty: [],
    prepTests: [],
    passageCategories: [],
    questionCategories: []
  });

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fetch questions based on filters
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['/api/lsat/questions', filters, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: filters.type,
        filters: JSON.stringify(filters),
        search: searchTerm,
        page: currentPage.toString()
      });
      
      const response = await fetch(`/api/lsat/questions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    }
  });

  // Create question set mutation
  const createSetMutation = useMutation({
    mutationFn: async (data: { name: string; type: 'lr' | 'rc'; questionIds: number[] }) => {
      return apiRequest('/api/practice/sets', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      // Navigate to the new practice set
      setLocation(`/question-practice?set=${data.id}`);
    }
  });

  const handleCreateSet = () => {
    if (setName.trim() && selectedQuestions.size > 0) {
      createSetMutation.mutate({
        name: setName.trim(),
        type: setType,
        questionIds: Array.from(selectedQuestions)
      });
    }
  };

  const toggleQuestionSelection = (questionId: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const questionsPerPage = 25;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold text-gray-900">Create Practice Set</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline">
              {selectedQuestions.size} questions selected
            </Badge>
            <Button 
              onClick={handleCreateSet}
              disabled={!setName.trim() || selectedQuestions.size === 0 || createSetMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {createSetMutation.isPending ? 'Creating...' : 'Create Set'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Set Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Set Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="setName">Set Name</Label>
                  <Input
                    id="setName"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    placeholder="Enter set name..."
                  />
                </div>
                <div>
                  <Label htmlFor="setType">Question Type</Label>
                  <Select value={setType} onValueChange={(value: 'lr' | 'rc') => {
                    setSetType(value);
                    setFilters(prev => ({ ...prev, type: value }));
                    setSelectedQuestions(new Set());
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lr">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-emerald-600" />
                          Logical Reasoning
                        </div>
                      </SelectItem>
                      <SelectItem value="rc">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                          Reading Comprehension
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="search">Search Questions</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search question text..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {questionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedQuestions.has(question.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleQuestionSelection(question.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedQuestions.has(question.id)}
                          onChange={() => toggleQuestionSelection(question.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">
                              PT {question.prep_test_number} S{question.section_number} Q{question.question_number_in_section}
                            </Badge>
                            <Badge variant="outline">
                              Difficulty: {question.question_difficulty}/5
                            </Badge>
                            {question.question_type && (
                              <Badge variant="secondary">
                                {question.question_type}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Question ID: {question.question_id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}