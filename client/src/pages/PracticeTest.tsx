import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowLeft, Home, Brain, Settings, BookOpen, Zap, Filter, Eye, Users } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface LsatQuestion {
  id: number;
  prep_test_number: number;
  section_number: number;
  section_type: string;
  question_number_in_section: number;
  question_id: string;
  question_difficulty: number;
  lr_question_type?: string;
  lr_skills?: string;
  rc_passage_categories?: string;
  rc_question_categories?: string;
}

type PracticeMode = "lr" | "rc";
type LRDisplayMode = "browse" | "smart-drill";

interface SmartLRSettings {
  questionCount: number;
  targetingCriteria: string;
}

interface BrowseFilters {
  questionTypes: string[];
  skills: string[];
  difficulty: number[];
  prepTests: number[];
}

const LR_QUESTION_TYPES = [
  "Agree", "Argument Part", "Disagree", "Evaluate", "Fill in the blank", "Flaw", 
  "Inference", "Main conclusion or main point", "Method of Reasoning", "Miscellaneous", 
  "Most Strongly Supported", "Must be False", "Must be True", "Necessary assumption", 
  "Omitted", "Paradox - Explain", "Parallel", "Parallel Flaw", "Principle", 
  "Principle - Application", "Principle - Rule", "Strengthen", "Sufficient assumption", "Weaken"
];

const LR_SKILLS = [
  "Analogy", "Causal Reasoning", "Conditional Reasoning", "Eliminating Options", 
  "Except", "Fact v. Belief v. Knowledge", "Fallacy", "Link Assumption", "Math", 
  "Net Effect", "Part v. Whole", "Quantifier", "Rule-Application", "Sampling", "Value Judgment"
];

const RC_PASSAGE_CATEGORIES = [
  "Art", "Comparative", "Debate", "Humanities", "Hypothesis", "Law", 
  "One-Position", "Problem Analysis", "Science", "Single-Topic"
];

const RC_QUESTION_CATEGORIES = [
  "Analogy", "Application", "Approach", "Author Attitude", "Function", "Inference", 
  "Main Idea", "Purpose of Paragraph", "Strengthen-Weaken", "Structure", "Tone"
];

export default function PracticeTest() {
  const [location, setLocation] = useLocation();
  
  // Get mode from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialMode = (urlParams.get('mode') as PracticeMode) || 'lr';
  
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(initialMode);
  const [lrDisplayMode, setLRDisplayMode] = useState<LRDisplayMode>("browse");
  
  // Smart LR Driller state
  const [smartLRSettings, setSmartLRSettings] = useState<SmartLRSettings>({
    questionCount: 10,
    targetingCriteria: ""
  });
  
  // Browse filters
  const [browseFilters, setBrowseFilters] = useState<BrowseFilters>({
    questionTypes: [],
    skills: [],
    difficulty: [],
    prepTests: []
  });
  
  // Fetch questions for browsing
  const { data: questions = [], isLoading: questionsLoading } = useQuery<LsatQuestion[]>({
    queryKey: ['/api/lsat/browse', practiceMode, browseFilters],
    enabled: lrDisplayMode === "browse" || practiceMode === "rc",
  });

  // Update mode when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const newMode = (urlParams.get('mode') as PracticeMode) || 'lr';
    setPracticeMode(newMode);
  }, [location]);

  // Header component
  const renderHeader = () => (
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
            Practice {practiceMode === 'lr' ? 'Logical Reasoning' : 'Reading Comprehension'}
          </h1>
        </div>
        
        {practiceMode === 'lr' && (
          <div className="flex items-center space-x-2">
            <Button
              variant={lrDisplayMode === "browse" ? "default" : "outline"}
              onClick={() => setLRDisplayMode("browse")}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Browse Questions
            </Button>
            <Button
              variant={lrDisplayMode === "smart-drill" ? "default" : "outline"}
              onClick={() => setLRDisplayMode("smart-drill")}
              className="flex items-center"
            >
              <Brain className="h-4 w-4 mr-2" />
              Smart Drill
            </Button>
          </div>
        )}
      </div>
      <p className="text-gray-600">
        {practiceMode === 'lr' && lrDisplayMode === "browse" && "Browse and practice individual Logical Reasoning questions"}
        {practiceMode === 'lr' && lrDisplayMode === "smart-drill" && "Create targeted drills based on your performance data"}
        {practiceMode === 'rc' && "Browse and practice Reading Comprehension passages and questions"}
      </p>
    </div>
  );

  // Smart LR Drill interface
  const renderSmartLRDrill = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI-Powered Question Selection</span>
          </CardTitle>
          <CardDescription>
            Our algorithm will select the most effective questions for your improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-count">Number of Questions</Label>
            <Select
              value={smartLRSettings.questionCount.toString()}
              onValueChange={(value) => setSmartLRSettings(prev => ({ ...prev, questionCount: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
                <SelectItem value="25">25 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targeting-criteria">Targeting Criteria</Label>
            <Select
              value={smartLRSettings.targetingCriteria}
              onValueChange={(value) => setSmartLRSettings(prev => ({ ...prev, targetingCriteria: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose targeting approach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incorrect-last">Incorrect when last taken</SelectItem>
                <SelectItem value="weakest-types">Weakest Question Types</SelectItem>
                <SelectItem value="weakest-skills">Weakest Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!smartLRSettings.targetingCriteria}
          >
            <Zap className="h-4 w-4 mr-2" />
            Create Drill
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Browse interface (for both LR and RC)
  const renderBrowseInterface = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {practiceMode === 'lr' && (
              <>
                {/* LR Question Types */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Question Types</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {LR_QUESTION_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={browseFilters.questionTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBrowseFilters(prev => ({
                                ...prev,
                                questionTypes: [...prev.questionTypes, type]
                              }));
                            } else {
                              setBrowseFilters(prev => ({
                                ...prev,
                                questionTypes: prev.questionTypes.filter(t => t !== type)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* LR Skills */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {LR_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={browseFilters.skills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBrowseFilters(prev => ({
                                ...prev,
                                skills: [...prev.skills, skill]
                              }));
                            } else {
                              setBrowseFilters(prev => ({
                                ...prev,
                                skills: prev.skills.filter(s => s !== skill)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={skill} className="text-sm cursor-pointer">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {practiceMode === 'rc' && (
              <>
                {/* RC Passage Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Passage Categories</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {RC_PASSAGE_CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} />
                        <Label htmlFor={category} className="text-sm cursor-pointer">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* RC Question Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Question Categories</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {RC_QUESTION_CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} />
                        <Label htmlFor={category} className="text-sm cursor-pointer">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Common Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Difficulty</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((diff) => (
                  <Checkbox
                    key={diff}
                    checked={browseFilters.difficulty.includes(diff)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setBrowseFilters(prev => ({
                          ...prev,
                          difficulty: [...prev.difficulty, diff]
                        }));
                      } else {
                        setBrowseFilters(prev => ({
                          ...prev,
                          difficulty: prev.difficulty.filter(d => d !== diff)
                        }));
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Panel */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {practiceMode === 'lr' ? 'Logical Reasoning Questions' : 'Reading Comprehension Questions'}
              </CardTitle>
              <Badge variant="outline">
                {questionsLoading ? "Loading..." : `${questions.length} questions`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {questionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading questions...</p>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                {questions.slice(0, 20).map((question) => (
                  <Card key={question.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          PT {question.prep_test_number}
                        </Badge>
                        <Badge variant="outline">
                          Section {question.section_number}
                        </Badge>
                        <Badge variant="outline">
                          Q{question.question_number_in_section}
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
                      {practiceMode === 'lr' && question.lr_question_type && (
                        <Badge variant="secondary">{question.lr_question_type}</Badge>
                      )}
                      {practiceMode === 'lr' && question.lr_skills && (
                        <Badge variant="outline">{question.lr_skills}</Badge>
                      )}
                      {practiceMode === 'rc' && question.rc_passage_categories && (
                        <Badge variant="secondary">{question.rc_passage_categories}</Badge>
                      )}
                      {practiceMode === 'rc' && question.rc_question_categories && (
                        <Badge variant="outline">{question.rc_question_categories}</Badge>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Question ID: {question.question_id}
                      </p>
                    </div>
                  </Card>
                ))}
                
                {questions.length > 20 && (
                  <div className="text-center py-4">
                    <Button variant="outline">
                      Load More Questions
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {browseFilters.questionTypes.length > 0 || browseFilters.skills.length > 0 || browseFilters.difficulty.length > 0 
                  ? "No questions match your current filters" 
                  : `No ${practiceMode === 'lr' ? 'Logical Reasoning' : 'Reading Comprehension'} questions available`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {renderHeader()}
        
        {practiceMode === 'lr' && lrDisplayMode === "smart-drill" 
          ? renderSmartLRDrill() 
          : renderBrowseInterface()}
      </div>
    </div>
  );
}