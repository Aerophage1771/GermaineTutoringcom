import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Play, Save, Download, BookOpen, Clock, Flag, CheckCircle, Target, TestTube } from "lucide-react";
import { MainNavigation } from "@/components/MainNavigation";

interface Question {
  id: number;
  question_id: string;
  prep_test_number: number;
  section_number: number;
  question_number_in_section: number;
  question_type?: string;
  question_difficulty: number;
  skills?: string;
  status?: 'missed' | 'flagged' | 'unseen' | 'correct';
  accuracy?: number;
}

interface PrepTest {
  id: number;
  test_number: number;
  sections: number;
  total_questions: number;
  time_limit: number; // in minutes
  available: boolean;
}

export default function ExploreTests() {
  const { user, isLoading } = useAuthRedirect();
  
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('browse-sets');
  
  // Filters for Browse Sets
  const [filters, setFilters] = useState({
    section: 'all',
    questionType: 'all',
    difficulty: 'all',
    status: 'all',
    ptRange: { min: '', max: '' },
    search: ''
  });

  // Generate PT 101-158 data
  const prepTests: PrepTest[] = Array.from({ length: 58 }, (_, i) => ({
    id: i + 101,
    test_number: i + 101,
    sections: 4,
    total_questions: 100 + Math.floor(Math.random() * 5), // 100-104 questions
    time_limit: 175, // 2 hours 55 minutes
    available: true
  }));

  // Mock data for Browse Sets - in production this would use real filters
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['/api/lsat/questions', filters, currentPage, activeTab],
    queryFn: async () => {
      if (activeTab !== 'browse-sets') {
        return [];
      }
      
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
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const startSimulation = (testNumber: number) => {
    // Navigate to test simulation with LawHub-style interface
    window.location.href = `/simulate-test/${testNumber}`;
  };

  const createCustomSet = () => {
    if (selectedQuestions.size === 0) return;
    
    // Handle creating a custom practice set from selected questions
    console.log('Creating custom set with questions:', Array.from(selectedQuestions));
  };

  return (
    <>
      <MainNavigation showBackButton backPath="/dashboard" />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Tests</h1>
            <p className="text-gray-600">Browse question sets, simulate practice tests, and create custom study materials</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="browse-sets" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Sets
              </TabsTrigger>
              <TabsTrigger value="simulate-test" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Simulate Test
              </TabsTrigger>
            </TabsList>

            {/* Browse Sets Tab */}
            <TabsContent value="browse-sets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Search & Filter Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Search Questions</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by ID, type, skills..."
                          value={filters.search}
                          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
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
                  <CardTitle>Questions</CardTitle>
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
            </TabsContent>

            {/* Simulate Test Tab */}
            <TabsContent value="simulate-test" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Practice Tests (PT 101-158)
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Full-length LSAT practice tests with LawHub-style interface including timed sections, 
                    question flagging, and comprehensive review features.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {prepTests.map((test) => (
                      <Card key={test.id} className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg">PT {test.test_number}</h3>
                              <p className="text-sm text-gray-600">Practice Test {test.test_number}</p>
                            </div>
                            <Badge variant={test.available ? "default" : "secondary"}>
                              {test.available ? "Available" : "Coming Soon"}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-gray-500" />
                              <span>{test.total_questions} questions</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{Math.floor(test.time_limit / 60)}h {test.time_limit % 60}m</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              <span>{test.sections} sections</span>
                            </div>
                          </div>

                          <Button 
                            className="w-full"
                            onClick={() => startSimulation(test.test_number)}
                            disabled={!test.available}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Test
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Test Features */}
              <Card>
                <CardHeader>
                  <CardTitle>LawHub-Style Test Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">Timed Interface</h4>
                        <p className="text-sm text-gray-600">Full section timing with alerts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <Flag className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold">Question Flagging</h4>
                        <p className="text-sm text-gray-600">Mark questions for review</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <Target className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">Section Navigation</h4>
                        <p className="text-sm text-gray-600">Jump between questions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-orange-600" />
                      <div>
                        <h4 className="font-semibold">Review Mode</h4>
                        <p className="text-sm text-gray-600">Detailed answer explanations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}