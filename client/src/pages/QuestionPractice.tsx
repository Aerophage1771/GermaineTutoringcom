import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Clock, ChevronLeft, ChevronRight, Home, BookOpen, Brain, Eye, RotateCcw, Check, X } from "lucide-react";

interface Question {
  id: number;
  prep_test_number: number;
  section_number: number;
  question_number_in_section: number;
  question_id: string;
  question_difficulty: number;
  question_text: string;
  answer_choices: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correct_answer: string;
  explanation: string;
  question_type?: string;
  skills?: string;
  passage_text?: string; // For RC questions
  passage_id?: string;
  question_number_in_passage?: number;
}

interface QuestionSet {
  id: string;
  name: string;
  questions: Question[];
  type: 'lr' | 'rc';
}

export default function QuestionPractice() {
  const { user, isLoading } = useAuthRedirect();
  const [location, setLocation] = useLocation();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const setId = urlParams.get('set');
  const questionIndex = parseInt(urlParams.get('q') || '0');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(questionIndex);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: string}>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fetch question set
  const { data: questionSet, isLoading: setLoading } = useQuery<QuestionSet>({
    queryKey: ['/api/practice/set', setId],
    queryFn: async () => {
      if (!setId) throw new Error('No set ID provided');
      const response = await fetch(`/api/practice/set/${setId}`);
      if (!response.ok) throw new Error('Failed to fetch question set');
      return response.json();
    },
    enabled: !!setId
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Update URL when question changes
  useEffect(() => {
    if (setId) {
      const newUrl = `/question-practice?set=${setId}&q=${currentQuestionIndex}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [currentQuestionIndex, setId]);

  if (setLoading || !questionSet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  const totalQuestions = questionSet.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setShowExplanation(true);
      setIsTimerRunning(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answeredQuestions[currentQuestionIndex + 1] || null);
      setShowExplanation(false);
      setIsTimerRunning(!answeredQuestions[currentQuestionIndex + 1]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answeredQuestions[currentQuestionIndex - 1] || null);
      setShowExplanation(!!answeredQuestions[currentQuestionIndex - 1]);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
  const hasAnswered = currentQuestionIndex in answeredQuestions;

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
            <div className="flex items-center space-x-2">
              {questionSet.type === 'lr' ? (
                <Brain className="h-5 w-5 text-emerald-600" />
              ) : (
                <BookOpen className="h-5 w-5 text-purple-600" />
              )}
              <span className="font-semibold text-gray-900">{questionSet.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-mono">{formatTime(timeSpent)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Question Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">
                  PT {currentQuestion.prep_test_number} S{currentQuestion.section_number} Q{currentQuestion.question_number_in_section}
                </Badge>
                <Badge variant="outline">
                  Difficulty: {currentQuestion.question_difficulty}/5
                </Badge>
                {currentQuestion.question_type && (
                  <Badge variant="secondary">
                    {currentQuestion.question_type}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Passage (for RC) */}
            {questionSet.type === 'rc' && currentQuestion.passage_text && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Passage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {currentQuestion.passage_text.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {questionSet.type === 'rc' && currentQuestion.question_number_in_passage && (
                    <span className="text-purple-600 mr-2">
                      Q{currentQuestion.question_number_in_passage}.
                    </span>
                  )}
                  Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none mb-6">
                  {currentQuestion.question_text.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Answer Choices */}
                <div className="space-y-3">
                  {Object.entries(currentQuestion.answer_choices).map(([letter, text]) => (
                    <div
                      key={letter}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAnswer === letter
                          ? showExplanation
                            ? letter === currentQuestion.correct_answer
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : showExplanation && letter === currentQuestion.correct_answer
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => !showExplanation && handleAnswerSelect(letter)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                          selectedAnswer === letter
                            ? showExplanation
                              ? letter === currentQuestion.correct_answer
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-red-500 bg-red-500 text-white'
                              : 'border-blue-500 bg-blue-500 text-white'
                            : showExplanation && letter === currentQuestion.correct_answer
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300'
                        }`}>
                          {letter}
                        </div>
                        <div className="flex-1 leading-relaxed">
                          {text}
                        </div>
                        {showExplanation && (
                          <div className="flex-shrink-0">
                            {letter === currentQuestion.correct_answer ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : selectedAnswer === letter ? (
                              <X className="h-5 w-5 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                {selectedAnswer && !showExplanation && (
                  <div className="mt-6">
                    <Button onClick={handleSubmitAnswer} className="w-full">
                      Submit Answer
                    </Button>
                  </div>
                )}

                {/* Explanation */}
                {showExplanation && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Eye className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Explanation</span>
                      {hasAnswered && (
                        <Badge variant={isAnswerCorrect ? "default" : "destructive"}>
                          {isAnswerCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="mb-2">
                        <strong>Correct Answer: {currentQuestion.correct_answer}</strong>
                      </p>
                      {currentQuestion.explanation.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}