import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MainNavigation } from "@/components/MainNavigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Plus,
  BookOpen
} from "lucide-react";

interface Question {
  id: number;
  question_id: string;
  prep_test_number: number;
  section_number: number;
  question_number_in_section: number;
  question_type?: string;
  question_difficulty: number;
  skills?: string;
  status?: string;
}

export default function ExploreQuestions() {
  const { user, isLoading } = useAuthRedirect();
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters for Browse Sets
  const [filters, setFilters] = useState({
    section: 'all',
    questionType: 'all',
    difficulty: 'all',
    status: 'all',
    ptRange: { min: '', max: '' },
    search: ''
  });

  // Mock data for questions - in production this would use real filters
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['/api/lsat/questions', filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: filters.section === 'lr' ? 'lr' : 'rc',
        filters: JSON.stringify(filters),
        search: filters.search,
        page: currentPage.toString()
      });
      
      const response = await fetch(`/api/lsat/questions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    }
  });

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const toggleQuestionSelection = (questionId: number) => {
    const newSelection = new Set(selectedQuestions);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestions(newSelection);
  };

  const createCustomSet = () => {
    console.log('Creating custom set with questions:', Array.from(selectedQuestions));
    // Implementation would save the set
  };

  return (
    <>
      <MainNavigation showBackButton />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Questions</h1>
            <p className="text-gray-600 text-lg">
              Free play mode - browse and filter LSAT questions by type, difficulty, and skills. Create custom question sets for targeted practice.
            </p>
          </div>

          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Question Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions by content, type, or skills..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                
                {/* Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Section</Label>
                    <Select value={filters.section} onValueChange={(value) => setFilters(prev => ({ ...prev, section: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="lr">Logical Reasoning</SelectItem>
                        <SelectItem value="rc">Reading Comprehension</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Question Type</Label>
                    <Select value={filters.questionType} onValueChange={(value) => setFilters(prev => ({ ...prev, questionType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="assumption">Assumption</SelectItem>
                        <SelectItem value="strengthen">Strengthen</SelectItem>
                        <SelectItem value="weaken">Weaken</SelectItem>
                        <SelectItem value="inference">Inference</SelectItem>
                        <SelectItem value="flaw">Flaw</SelectItem>
                        <SelectItem value="parallel">Parallel Reasoning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="1">1 - Easy</SelectItem>
                        <SelectItem value="2">2 - Medium Easy</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - Medium Hard</SelectItem>
                        <SelectItem value="5">5 - Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="unseen">Unseen</SelectItem>
                        <SelectItem value="correct">Correct</SelectItem>
                        <SelectItem value="missed">Missed</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Questions Counter */}
            {selectedQuestions.size > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {selectedQuestions.size} question{selectedQuestions.size !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedQuestions(new Set())}
                      >
                        Clear Selection
                      </Button>
                      <Button 
                        size="sm"
                        onClick={createCustomSet}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Set
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {questionsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Question ID</TableHead>
                        <TableHead>PT</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedQuestions.has(question.id)}
                              onCheckedChange={() => toggleQuestionSelection(question.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-sm">{question.question_id}</TableCell>
                          <TableCell>PT {question.prep_test_number}</TableCell>
                          <TableCell>S{question.section_number}Q{question.question_number_in_section}</TableCell>
                          <TableCell>
                            {question.question_type && (
                              <Badge variant="outline">{question.question_type}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              question.question_difficulty >= 4 ? "destructive" : 
                              question.question_difficulty >= 3 ? "default" : "secondary"
                            }>
                              {question.question_difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm">
                            {question.skills}
                          </TableCell>
                          <TableCell>
                            {question.status && (
                              <Badge variant={
                                question.status === 'correct' ? 'default' :
                                question.status === 'missed' ? 'destructive' :
                                question.status === 'flagged' ? 'secondary' : 'outline'
                              }>
                                {question.status}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}