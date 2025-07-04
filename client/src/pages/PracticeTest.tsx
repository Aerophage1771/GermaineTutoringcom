import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowLeft, ArrowRight, CheckCircle, Home, Brain, Settings, BookOpen, Zap, Filter } from "lucide-react";
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

type PracticeMode = "selection" | "smart-lr" | "custom-lr" | "reading-comp";

interface SmartLRSettings {
  questionCount: number;
  targetingCriteria: string;
}

interface CustomLRFilters {
  questionTypes: string[];
  skills: string[];
  difficulty: number[];
  taken: string;
  hasNote: boolean;
}

interface RCSettings {
  sourceType: string;
  prepTestRange?: { start: number; end: number };
  passageCategories: string[];
  questionCategories: string[];
  timed: boolean;
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
  const [, setLocation] = useLocation();
  const [currentMode, setCurrentMode] = useState<PracticeMode>("selection");
  
  // Smart LR Driller state
  const [smartLRSettings, setSmartLRSettings] = useState<SmartLRSettings>({
    questionCount: 10,
    targetingCriteria: ""
  });
  
  // Custom LR Drill Builder state
  const [customLRFilters, setCustomLRFilters] = useState<CustomLRFilters>({
    questionTypes: [],
    skills: [],
    difficulty: [],
    taken: "all",
    hasNote: false
  });
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // Reading Comp Generator state
  const [rcSettings, setRCSettings] = useState<RCSettings>({
    sourceType: "single-unused",
    passageCategories: [],
    questionCategories: [],
    timed: true
  });

  // Mode Selection Screen
  const renderModeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Practice Mode</h1>
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <p className="text-gray-600">Select the practice mode that best fits your study goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Smart LR Driller */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentMode("smart-lr")}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Smart LR Driller</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                Create a targeted Logical Reasoning drill in seconds. Our algorithm selects questions 
                based on your performance to attack your weaknesses.
              </CardDescription>
              <Badge variant="secondary" className="mb-2">Best for:</Badge>
              <p className="text-sm text-gray-600">
                Quick, daily LR practice and shoring up weak areas without manual setup.
              </p>
            </CardContent>
          </Card>

          {/* Custom LR Drill Builder */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentMode("custom-lr")}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Custom LR Drill Builder</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                Take full control of the Logical Reasoning question bank. Build a unique drill by 
                filtering by question type, skill, difficulty, and more.
              </CardDescription>
              <Badge variant="secondary" className="mb-2">Best for:</Badge>
              <p className="text-sm text-gray-600">
                Deep-dives into specific LR concepts, creating targeted problem sets, and advanced study.
              </p>
            </CardContent>
          </Card>

          {/* Reading Comp Section Generator */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentMode("reading-comp")}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Reading Comp Section Generator</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                Simulate the full Reading Comprehension section. Generate passages from specific 
                PrepTests or create themed sections based on passage and question type.
              </CardDescription>
              <Badge variant="secondary" className="mb-2">Best for:</Badge>
              <p className="text-sm text-gray-600">
                Practicing RC pacing, improving reading endurance, and mastering passage analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Smart LR Driller Mode
  const renderSmartLRDriller = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentMode("selection")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create a Smart LR Drill</h1>
          </div>
          <p className="text-gray-600">Generate a targeted Logical Reasoning practice set in seconds</p>
        </div>

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
                  <SelectItem value="never-attempted">Never Attempted Questions</SelectItem>
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
    </div>
  );

  // Custom LR Drill Builder Mode  
  const renderCustomLRBuilder = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentMode("selection")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Custom LR Drill Builder</h1>
          </div>
          <p className="text-gray-600">Build a perfectly tailored Logical Reasoning drill with advanced filtering</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Attribute Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* LR Question Types */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Logical Reasoning Types</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {LR_QUESTION_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={customLRFilters.questionTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCustomLRFilters(prev => ({
                                ...prev,
                                questionTypes: [...prev.questionTypes, type]
                              }));
                            } else {
                              setCustomLRFilters(prev => ({
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
                  <Label className="text-sm font-medium">Logical Reasoning Skills</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {LR_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={customLRFilters.skills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCustomLRFilters(prev => ({
                                ...prev,
                                skills: [...prev.skills, skill]
                              }));
                            } else {
                              setCustomLRFilters(prev => ({
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

                {/* Other Filters */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Other Filters</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Difficulty</Label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((diff) => (
                          <Checkbox
                            key={diff}
                            checked={customLRFilters.difficulty.includes(diff)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCustomLRFilters(prev => ({
                                  ...prev,
                                  difficulty: [...prev.difficulty, diff]
                                }));
                              } else {
                                setCustomLRFilters(prev => ({
                                  ...prev,
                                  difficulty: prev.difficulty.filter(d => d !== diff)
                                }));
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question Results</CardTitle>
                  <Badge variant="outline">
                    {selectedQuestions.length} questions selected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    Apply filters to see matching questions
                  </div>
                  
                  {selectedQuestions.length > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                      <span className="font-medium">
                        Drill ({selectedQuestions.length} questions selected)
                      </span>
                      <div className="space-x-2">
                        <Button>Start Drill</Button>
                        <Button variant="outline" onClick={() => setSelectedQuestions([])}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Reading Comp Section Generator Mode
  const renderRCGenerator = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentMode("selection")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Generate a Reading Comp Section</h1>
          </div>
          <p className="text-gray-600">Create a full-length Reading Comprehension section for practice</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Section Configuration</span>
            </CardTitle>
            <CardDescription>
              Choose your source material and customization options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Source Material</Label>
              <RadioGroup
                value={rcSettings.sourceType}
                onValueChange={(value) => setRCSettings(prev => ({ ...prev, sourceType: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single-unused" id="single-unused" />
                  <Label htmlFor="single-unused">Single Unused PrepTest Section</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preptest-range" id="preptest-range" />
                  <Label htmlFor="preptest-range">Mix from PrepTest Range</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom-themed" id="custom-themed" />
                  <Label htmlFor="custom-themed">Custom Themed Section</Label>
                </div>
              </RadioGroup>
            </div>

            {rcSettings.sourceType === "custom-themed" && (
              <>
                <Separator />
                
                {/* Passage Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Passage Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {RC_PASSAGE_CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={rcSettings.passageCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRCSettings(prev => ({
                                ...prev,
                                passageCategories: [...prev.passageCategories, category]
                              }));
                            } else {
                              setRCSettings(prev => ({
                                ...prev,
                                passageCategories: prev.passageCategories.filter(c => c !== category)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm cursor-pointer">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Question Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Question Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {RC_QUESTION_CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={rcSettings.questionCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRCSettings(prev => ({
                                ...prev,
                                questionCategories: [...prev.questionCategories, category]
                              }));
                            } else {
                              setRCSettings(prev => ({
                                ...prev,
                                questionCategories: prev.questionCategories.filter(c => c !== category)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm cursor-pointer">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Timing Mode */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Timing Mode</Label>
              <div className="flex items-center justify-between">
                <Label htmlFor="timed-mode">Timed (35:00)</Label>
                <Switch
                  id="timed-mode"
                  checked={rcSettings.timed}
                  onCheckedChange={(checked) => setRCSettings(prev => ({ ...prev, timed: checked }))}
                />
              </div>
            </div>

            <Button className="w-full" size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Generate Section
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render current mode
  switch (currentMode) {
    case "smart-lr":
      return renderSmartLRDriller();
    case "custom-lr":
      return renderCustomLRBuilder();
    case "reading-comp":
      return renderRCGenerator();
    default:
      return renderModeSelection();
  }
}