import { useState, useEffect, useCallback } from "react";
import { useRoute } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Flag, ChevronLeft, ChevronRight, Grid3X3, CheckCircle, ArrowLeft, AlertTriangle, Search, Type, Highlighter, Edit3, User } from "lucide-react";

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
  const [match] = useRoute("/test/:testNumber");
  
  const testNumber = match?.testNumber ? parseInt(match.testNumber) : 101;
  
  // Test state
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(35 * 60); // 35 minutes per section
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [viewMode, setViewMode] = useState('questions'); // 'directions', 'passage', 'questions'
  const [searchText, setSearchText] = useState('');
  const [sectionStarted, setSectionStarted] = useState(false);

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
    // Don't start timer until they click "Begin" on the section
    setTimeRemaining(testSections[0].time_limit * 60);
  };

  const startSection = () => {
    setSectionStarted(true);
    setIsTimerRunning(true);
    setViewMode('questions');
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

  // Test Overview Screen (before starting)
  if (!testStarted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#2D3748' }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Library</span>
                <span>/</span>
                <span>The Official LSAT PrepTest {testNumber}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Welcome, {user.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="grid grid-cols-2 max-w-4xl w-full mx-8">
            {/* Left Panel - Test Overview */}
            <div className="bg-white p-8 rounded-l-lg">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  The Official LSAT PrepTest {testNumber}
                </h1>
                
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Sections</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {testSections.map((section, index) => (
                      <div key={section.id} className="text-center">
                        <Button
                          size="sm"
                          variant={index === 0 ? "default" : "outline"}
                          className="w-full mb-2"
                          disabled={index !== 0}
                        >
                          Section {index + 1}
                        </Button>
                        <div className="text-xs text-gray-600">
                          <div>{index === 0 ? "advanced" : "not started"}</div>
                          <div>{index === 0 ? "4/27" : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="text-lg text-gray-600">🚀</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Section 1 */}
            <div className="bg-teal-600 text-white p-8 rounded-r-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Section 1</h2>
                
                <div className="mb-6">
                  <div className="text-sm mb-2">Questions</div>
                  <div className="text-2xl font-bold">27</div>
                </div>

                <Button
                  onClick={startTest}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-md mb-8"
                >
                  Begin
                </Button>

                <div className="text-sm text-teal-100">
                  <div className="mb-2 font-medium">Directions:</div>
                  <p className="text-xs leading-relaxed">
                    Each set of questions in this section is based on a single passage. 
                    The questions are to be answered on the basis of what is stated or 
                    implied in the passage. For some questions, more than one of the 
                    choices could conceivably answer the question. However, you are to 
                    choose the best answer; that is, choose the response that most 
                    accurately and completely answers the question.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

  // Section Instructions/Directions Screen
  if (testStarted && !sectionStarted) {
    const section = testSections[currentSection];
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#2D3748' }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Library</span>
                <span>/</span>
                <span>The Official LSAT PrepTest {testNumber}</span>
                <span>/</span>
                <span>Section {currentSection + 1}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  Pause Section
                </Button>
                <Button variant="outline" size="sm">
                  Complete Section
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Welcome, {user.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-2xl w-full mx-8">
            <div className="bg-gray-100 p-8 rounded-lg">
              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-300">
                <Button 
                  size="sm" 
                  variant={viewMode === 'questions' ? "default" : "outline"}
                  onClick={() => setViewMode('questions')}
                >
                  Questions
                </Button>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    placeholder="Find Text, Type Here"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Highlighter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm">
                  Time Remaining: {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Directions Content */}
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-xl font-bold mb-4">Section {currentSection + 1}</h2>
                <div className="text-sm text-gray-600 mb-2">
                  Total Section Time - {section.time_limit} minutes
                </div>
                <div className="text-sm text-gray-600 mb-6">
                  {section.total_questions} Questions
                </div>
                
                <div className="text-sm text-gray-700 leading-relaxed mb-8">
                  <strong>Directions:</strong> Each question in this section is based on the reasoning presented in a brief passage. In answering the questions, you should not make assumptions that are by commonsense standards implausible, superfluous, or incompatible with the passage. For some questions, more than one of the choices could conceivably answer the question. However, you are to choose the best answer; that is, choose the response that most accurately and completely answers the question.
                </div>

                <Button
                  onClick={startSection}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md"
                >
                  GO TO QUESTIONS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = getCurrentQuestion();
  const section = testSections[currentSection];
  const progress = ((currentQuestion + 1) / section.total_questions) * 100;

  // Main Test Interface
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2D3748' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Library</span>
              <span>/</span>
              <span>The Official LSAT PrepTest {testNumber}</span>
              <span>/</span>
              <span>Section {currentSection + 1}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                Pause Section
              </Button>
              <Button variant="outline" size="sm" onClick={endTest}>
                Complete Section
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Welcome, {user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-gray-100 p-6 rounded-lg">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-300">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setViewMode('directions')}
              >
                Directions
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'passage' ? "default" : "outline"}
                onClick={() => setViewMode('passage')}
              >
                Passage Only View
              </Button>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  placeholder="Find Text, Type Here"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Type className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Highlighter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm">
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg p-6 min-h-[500px]">
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* Left Side - Passage */}
                {currentQuestionData?.passage_text && (
                  <div>
                    <h3 className="font-bold mb-4">Passage A</h3>
                    <div className="text-sm leading-relaxed">
                      {currentQuestionData.passage_text}
                    </div>
                  </div>
                )}
                
                {/* Right Side - Question */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Flag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {currentQuestion + 1}. {currentQuestionData?.question_text}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(currentQuestionData?.answer_choices || {}).map(([letter, choice]) => (
                      <label
                        key={letter}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="answer"
                            value={letter}
                            checked={currentQuestionData?.selected_answer === letter}
                            onChange={() => selectAnswer(letter)}
                            className="mt-1"
                          />
                          <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                            {letter}
                          </span>
                        </div>
                        <div className="flex-1 text-sm">
                          {choice}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between mt-6">
              {/* Question Numbers */}
              <div className="flex items-center gap-1">
                {section.questions.map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={index === currentQuestion ? "default" : "outline"}
                    className="w-8 h-8 p-0 text-xs"
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToNextQuestion}
                  disabled={currentQuestion === section.questions.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}