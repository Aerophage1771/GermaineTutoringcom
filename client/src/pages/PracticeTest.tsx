import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
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

interface TestSettings {
  sectionType: string;
  difficulty?: number;
  questionCount: number;
  timeLimit: number; // in minutes
}

interface QuestionAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect?: boolean;
}

export default function PracticeTest() {
  const [testSettings, setTestSettings] = useState<TestSettings>({
    sectionType: "",
    questionCount: 10,
    timeLimit: 35
  });
  
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Fetch questions based on test settings
  const { data: questions = [], isLoading: questionsLoading } = useQuery<LsatQuestion[]>({
    queryKey: ['/api/lsat/random', testSettings],
    enabled: testStarted && !!testSettings.sectionType,
  });

  const submitTestMutation = useMutation({
    mutationFn: (data: {
      activity_type: string;
      test_name: string;
      section_type: string;
      questions_attempted: number;
      questions_correct: number;
      time_spent: number;
      score_percentage: string;
    }) => apiRequest("POST", "/api/dashboard/practice-activities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/practice-activities"] });
    },
  });

  const startTest = () => {
    if (!testSettings.sectionType) return;
    setTestStarted(true);
    setTimeRemaining(testSettings.timeLimit * 60); // Convert to seconds
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleTestComplete = () => {
    setTestCompleted(true);
    
    // Calculate score and submit to database
    const questionsAttempted = Object.keys(answers).length;
    const questionsCorrect = 0; // Will be calculated when actual questions/answers are available
    const timeSpent = (testSettings.timeLimit * 60) - timeRemaining;
    const scorePercentage = questionsAttempted > 0 ? 
      ((questionsCorrect / questionsAttempted) * 100).toFixed(1) : "0.0";
    
    submitTestMutation.mutate({
      activity_type: "Practice Test",
      test_name: `${testSettings.sectionType} Practice`,
      section_type: testSettings.sectionType,
      questions_attempted: questionsAttempted,
      questions_correct: questionsCorrect,
      time_spent: Math.floor(timeSpent / 60), // Convert to minutes
      score_percentage: scorePercentage + "%"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Test</h1>
            <p className="text-gray-600">Configure your practice session and start improving your LSAT skills</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Settings</CardTitle>
              <CardDescription>
                Customize your practice test based on your study goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="section-type">Section Type</Label>
                <Select 
                  value={testSettings.sectionType} 
                  onValueChange={(value) => setTestSettings(prev => ({ ...prev, sectionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Logical Reasoning">Logical Reasoning</SelectItem>
                    <SelectItem value="Reading Comprehension">Reading Comprehension</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level (Optional)</Label>
                <Select 
                  value={testSettings.difficulty?.toString() || ""} 
                  onValueChange={(value) => setTestSettings(prev => ({ 
                    ...prev, 
                    difficulty: value ? parseInt(value) : undefined 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any difficulty</SelectItem>
                    <SelectItem value="1">Level 1 (Easiest)</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5 (Hardest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-count">Number of Questions</Label>
                <Select 
                  value={testSettings.questionCount.toString()} 
                  onValueChange={(value) => setTestSettings(prev => ({ ...prev, questionCount: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 questions</SelectItem>
                    <SelectItem value="10">10 questions</SelectItem>
                    <SelectItem value="15">15 questions</SelectItem>
                    <SelectItem value="20">20 questions</SelectItem>
                    <SelectItem value="25">25 questions (Full section)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                <Select 
                  value={testSettings.timeLimit.toString()} 
                  onValueChange={(value) => setTestSettings(prev => ({ ...prev, timeLimit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="35">35 minutes (Standard)</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={startTest} 
                disabled={!testSettings.sectionType}
                className="w-full"
                size="lg"
              >
                Start Practice Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const questionsAttempted = Object.keys(answers).length;
    const completionRate = questions.length > 0 ? (questionsAttempted / questions.length * 100).toFixed(1) : "0";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Test Completed!</CardTitle>
              <CardDescription>Great job on completing your practice session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{questionsAttempted}</div>
                  <div className="text-sm text-gray-600">Questions Attempted</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Section Type:</span>
                  <Badge variant="secondary">{testSettings.sectionType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Time Spent:</span>
                  <span>{Math.floor(((testSettings.timeLimit * 60) - timeRemaining) / 60)} minutes</span>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setTestStarted(false);
                  setTestCompleted(false);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                }}
                className="w-full"
              >
                Start New Practice Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{testSettings.sectionType}</Badge>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-orange-600">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {currentQuestion.question_number_in_section || currentQuestionIndex + 1}
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge variant="outline">
                    Difficulty {currentQuestion.question_difficulty}
                  </Badge>
                  {currentQuestion.lr_question_type && (
                    <Badge variant="outline">
                      {currentQuestion.lr_question_type}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <strong>Question ID:</strong> {currentQuestion.question_id}
                </p>
                <p className="text-gray-600 italic">
                  [Question text will be loaded here when available]
                </p>
                
                {/* Answer Options */}
                <RadioGroup
                  value={answers[currentQuestion.question_id] || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.question_id, value)}
                >
                  <div className="space-y-2">
                    {["A", "B", "C", "D", "E"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="flex-1 cursor-pointer">
                          ({option}) [Answer option will be loaded here]
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Question Details */}
                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>Prep Test:</strong> {currentQuestion.prep_test_number}</p>
                  <p><strong>Section:</strong> {currentQuestion.section_number}</p>
                  {currentQuestion.lr_skills && (
                    <p><strong>Skills:</strong> {currentQuestion.lr_skills}</p>
                  )}
                  {currentQuestion.rc_passage_categories && (
                    <p><strong>Passage Categories:</strong> {currentQuestion.rc_passage_categories}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleTestComplete}>
                Complete Test
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}