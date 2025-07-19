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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Play, Save, Download, BookOpen } from "lucide-react";
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

export default function ExploreSets() {
  const { user, isLoading } = useAuthRedirect();
  
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [filters, setFilters] = useState({
    section: 'all',
    questionType: 'all',
    difficulty: 'all',
    status: 'all',
    ptRange: { min: '', max: '' },
    search: ''
  });

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data - in production this would use real filters
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

  const toggleQuestionSelection = (questionId: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleStartDrill = () => {
    if (selectedQuestions.size > 0) {
      // Create practice set and navigate to question practice
      console.log('Starting drill with questions:', Array.from(selectedQuestions));
    }
  };

  const statusColors = {
    missed: 'bg-red-100 text-red-800',
    flagged: 'bg-yellow-100 text-yellow-800',
    unseen: 'bg-gray-100 text-gray-800',
    correct: 'bg-green-100 text-green-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation showBackButton={true} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">Explore Sets</h1>
              </div>
              <p className="text-gray-600">Manual search & drill builder - build exactly what you need</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {selectedQuestions.size} selected
              </Badge>
              {selectedQuestions.size > 0 && (
                <div className="flex space-x-2">
                  <Button onClick={handleStartDrill}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Drill
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Set
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filter System */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter System</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Section</Label>
                <Select value={filters.section} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, section: value }))
                }>
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
                <Select value={filters.questionType} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, questionType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="flaw">Flaw</SelectItem>
                    <SelectItem value="strengthen">Strengthen</SelectItem>
                    <SelectItem value="weaken">Weaken</SelectItem>
                    <SelectItem value="assumption">Assumption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Difficulty</Label>
                <Select value={filters.difficulty} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, difficulty: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="1">1 - Easiest</SelectItem>
                    <SelectItem value="2">2 - Easy</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Hard</SelectItem>
                    <SelectItem value="5">5 - Hardest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="unseen">Unseen</SelectItem>
                    <SelectItem value="correct">Correct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="PT Min"
                  value={filters.ptRange.min}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    ptRange: { ...prev.ptRange, min: e.target.value }
                  }))}
                  className="w-24"
                />
                <Input
                  placeholder="PT Max"
                  value={filters.ptRange.max}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    ptRange: { ...prev.ptRange, max: e.target.value }
                  }))}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question List */}
        <Card>
          <CardContent className="p-0">
            {questionsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Question ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-12"></TableHead>
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
                      <TableCell className="font-mono text-sm">
                        {question.question_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {question.question_type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full mr-1 ${
                                i < question.question_difficulty
                                  ? 'bg-orange-400'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[question.status || 'unseen']}>
                          {question.status || 'unseen'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {question.accuracy ? `${question.accuracy}%` : '—'}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {question.skills || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleQuestionSelection(question.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
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
  );
}