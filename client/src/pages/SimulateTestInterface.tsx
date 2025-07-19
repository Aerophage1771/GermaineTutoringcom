import { useState, useEffect, useCallback } from "react";
import { useRoute } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Flag, ChevronLeft, ChevronRight, Grid3X3, CheckCircle, ArrowLeft, AlertTriangle } from "lucide-react";

interface TestQuestion {
  id: number;
  question_id: string;
  section_number: number;
  question_number: number;
  question_text: string;
  answer_choices: Record<string, string>;
  passage_text?: string;
  selected_answer?: string;
  is_flagged: boolean;
  time_spent: number;
}

interface TestSection {
  id: number;
  name: string;
  time_limit: number; // in minutes
  total_questions: number;
  questions: TestQuestion[];
}

export default function SimulateTestInterface() {
  const { user, isLoading } = useAuthRedirect();
  const [match] = useRoute("/simulate-test/:testNumber");
  
  const testNumber = match?.testNumber ? parseInt(match.testNumber) : 101;
  
  // Test state
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(35 * 60); // 35 minutes per section
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Mock test sections data - in production this would come from database
  const testSections: TestSection[] = [
    {
      id: 1,
      name: "Logical Reasoning",
      time_limit: 35,
      total_questions: 25,
      questions: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        question_id: `PT${testNumber}_S1_Q${i + 1}`,
        section_number: 1,
        question_number: i + 1,
        question_text: `Sample logical reasoning question ${i + 1} for PT ${testNumber}. This would contain the actual LSAT question stimulus and question text.`,
        answer_choices: {
          A: "Sample answer choice A",
          B: "Sample answer choice B", 
          C: "Sample answer choice C",
          D: "Sample answer choice D",
          E: "Sample answer choice E"
        },
        selected_answer: undefined,
        is_flagged: false,
        time_spent: 0
      }))
    },
    {
      id: 2,
      name: "Reading Comprehension", 
      time_limit: 35,
      total_questions: 27,
      questions: Array.from({ length: 27 }, (_, i) => ({
        id: i + 26,
        question_id: `PT${testNumber}_S2_Q${i + 1}`,
        section_number: 2,
        question_number: i + 1,
        question_text: `Sample reading comprehension question ${i + 1} for PT ${testNumber}.`,
        answer_choices: {
          A: "Sample answer choice A",
          B: "Sample answer choice B",
          C: "Sample answer choice C", 
          D: "Sample answer choice D",
          E: "Sample answer choice E"
        },
        passage_text: i < 7 ? "Sample passage 1 text would appear here..." : 
                     i < 14 ? "Sample passage 2 text would appear here..." :
                     i < 21 ? "Sample passage 3 text would appear here..." :
                     "Sample passage 4 text would appear here...",
        selected_answer: undefined,
        is_flagged: false,
        time_spent: 0
      }))
    },
    {
      id: 3,
      name: "Logical Reasoning",
      time_limit: 35,
      total_questions: 25, 
      questions: Array.from({ length: 25 }, (_, i) => ({
        id: i + 53,
        question_id: `PT${testNumber}_S3_Q${i + 1}`,
        section_number: 3,
        question_number: i + 1,
        question_text: `Sample logical reasoning question ${i + 1} for section 3 of PT ${testNumber}.`,
        answer_choices: {
          A: "Sample answer choice A",
          B: "Sample answer choice B",
          C: "Sample answer choice C",
          D: "Sample answer choice D", 
          E: "Sample answer choice E"
        },
        selected_answer: undefined,
        is_flagged: false,
        time_spent: 0
      }))
    },
    {
      id: 4,
      name: "Reading Comprehension",
      time_limit: 35, 
      total_questions: 27,
      questions: Array.from({ length: 27 }, (_, i) => ({
        id: i + 78,
        question_id: `PT${testNumber}_S4_Q${i + 1}`,
        section_number: 4,
        question_number: i + 1,
        question_text: `Sample reading comprehension question ${i + 1} for section 4 of PT ${testNumber}.`,
        answer_choices: {
          A: "Sample answer choice A",
          B: "Sample answer choice B",
          C: "Sample answer choice C",
          D: "Sample answer choice D",
          E: "Sample answer choice E"
        },
        passage_text: i < 7 ? "Sample passage 1 text for section 4..." :
                     i < 14 ? "Sample passage 2 text for section 4..." :
                     i < 21 ? "Sample passage 3 text for section 4..." :
                     "Sample passage 4 text for section 4...",
        selected_answer: undefined,
        is_flagged: false,
        time_spent: 0
      }))
    }
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setShowWarning(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return testSections[currentSection]?.questions[currentQuestion];
  };

  const selectAnswer = (answer: string) => {
    const question = getCurrentQuestion();
    if (question) {
      question.selected_answer = answer;
    }
  };

  const toggleFlag = () => {
    const question = getCurrentQuestion();
    if (question) {
      question.is_flagged = !question.is_flagged;
    }
  };

  const goToNextQuestion = () => {
    const section = testSections[currentSection];
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < testSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
      setTimeRemaining(testSections[currentSection + 1].time_limit * 60);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setCurrentQuestion(testSections[currentSection - 1].questions.length - 1);
      setTimeRemaining(testSections[currentSection - 1].time_limit * 60);
    }
  };

  const goToQuestion = (sectionIndex: number, questionIndex: number) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(questionIndex);
    setTimeRemaining(testSections[sectionIndex].time_limit * 60);
  };

  const startTest = () => {
    setTestStarted(true);
    setIsTimerRunning(true);
    setTimeRemaining(testSections[0].time_limit * 60);
  };

  const endTest = () => {
    setTestCompleted(true);
    setIsTimerRunning(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore Tests
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Practice Test {testNumber}</CardTitle>
              <p className="text-gray-600">
                You are about to begin a full-length LSAT practice test. This test contains 4 sections 
                with a total of approximately 100 questions.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testSections.map((section, index) => (
                  <Card key={section.id} className="border-2">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Section {index + 1}</h3>
                      <p className="text-sm text-gray-600 mb-2">{section.name}</p>
                      <div className="flex justify-between text-sm">
                        <span>{section.total_questions} questions</span>
                        <span>{section.time_limit} minutes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  Test Instructions
                </h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Each section is timed separately</li>
                  <li>• You can flag questions for review within each section</li>
                  <li>• Once you move to the next section, you cannot return to previous sections</li>
                  <li>• The test will automatically advance when time expires</li>
                  <li>• You can pause the test at any time</li>
                </ul>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startTest}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                >
                  Start Practice Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Test Completed!</CardTitle>
              <p className="text-gray-600">Practice Test {testNumber}</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <p>Your responses have been saved. You can now review your answers and explanations.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.history.back()}>
                  Return to Tests
                </Button>
                <Button variant="outline">
                  Review Answers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestionData = getCurrentQuestion();
  const section = testSections[currentSection];
  const progress = ((currentQuestion + 1) / section.total_questions) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">PT {testNumber} - Section {currentSection + 1}</h1>
            <Badge variant="outline">{section.name}</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {isTimerRunning ? 'Pause' : 'Resume'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={endTest}>
              End Test
            </Button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Question {currentQuestion + 1} of {section.total_questions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Question Navigation Sidebar */}
        <div className="col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Section {currentSection + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-1">
                {section.questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant={index === currentQuestion ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 text-xs relative ${
                      question.selected_answer ? 'bg-green-100 border-green-300' : ''
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                    {question.is_flagged && (
                      <Flag className="h-2 w-2 absolute -top-1 -right-1 text-orange-500 fill-current" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Question Area */}
        <div className="col-span-10 space-y-6">
          {/* Passage Text for RC Questions */}
          {currentQuestionData?.passage_text && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Passage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-sm leading-relaxed">
                  {currentQuestionData.passage_text}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Question */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFlag}
                  className={currentQuestionData?.is_flagged ? 'bg-orange-100 border-orange-300' : ''}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {currentQuestionData?.is_flagged ? 'Flagged' : 'Flag'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                {currentQuestionData?.question_text}
              </div>

              <Separator />

              <div className="space-y-3">
                {Object.entries(currentQuestionData?.answer_choices || {}).map(([letter, choice]) => (
                  <label
                    key={letter}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentQuestionData?.selected_answer === letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={letter}
                      checked={currentQuestionData?.selected_answer === letter}
                      onChange={() => selectAnswer(letter)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-semibold mr-2">({letter})</span>
                      {choice}
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentSection === 0 && currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentSection < testSections.length - 1 || currentQuestion < section.questions.length - 1 ? (
                <Button onClick={goToNextQuestion}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={endTest} className="bg-green-600 hover:bg-green-700">
                  Finish Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}