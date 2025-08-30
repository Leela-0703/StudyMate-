import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  HelpCircle, 
  Copy, 
  Download, 
  CheckCircle,
  XCircle,
  FileText,
  Sparkles
} from 'lucide-react';

interface QuizGeneratorProps {
  onNavigate: (page: string) => void;
}

interface Question {
  id: number;
  type: 'mcq' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  userAnswer?: string | number;
}

export function QuizGenerator({ onNavigate }: QuizGeneratorProps) {
  const [selectedDocument, setSelectedDocument] = useState('');
  const [quizType, setQuizType] = useState('mcq');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const documents = [
    'Biology Chapter 5 - Cell Division',
    'History - World War II Overview',
    'Physics - Quantum Mechanics Basics',
    'Chemistry - Organic Compounds'
  ];

  const generateQuiz = async () => {
    if (!selectedDocument) return;

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockQuestions = generateMockQuestions(quizType);
      setQuestions(mockQuestions);
      setCurrentQuestion(0);
      setShowResults(false);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockQuestions = (type: string): Question[] => {
    const mcqQuestions = [
      {
        id: 1,
        type: 'mcq' as const,
        question: 'What is the main function of mitochondria in a cell?',
        options: ['Protein synthesis', 'Energy production', 'DNA storage', 'Waste removal'],
        correctAnswer: 1
      },
      {
        id: 2,
        type: 'mcq' as const,
        question: 'Which phase of mitosis involves chromosome alignment?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctAnswer: 1
      },
      {
        id: 3,
        type: 'mcq' as const,
        question: 'What is the result of meiosis?',
        options: ['Two diploid cells', 'Four haploid cells', 'One diploid cell', 'Four diploid cells'],
        correctAnswer: 1
      }
    ];

    const trueFalseQuestions = [
      {
        id: 1,
        type: 'true-false' as const,
        question: 'Mitosis results in two genetically identical daughter cells.',
        correctAnswer: 'true'
      },
      {
        id: 2,
        type: 'true-false' as const,
        question: 'Meiosis occurs in somatic cells.',
        correctAnswer: 'false'
      },
      {
        id: 3,
        type: 'true-false' as const,
        question: 'Chromosomes condense during prophase.',
        correctAnswer: 'true'
      }
    ];

    const fillBlankQuestions = [
      {
        id: 1,
        type: 'fill-blank' as const,
        question: 'The process of cell division that produces gametes is called _______.',
        correctAnswer: 'meiosis'
      },
      {
        id: 2,
        type: 'fill-blank' as const,
        question: 'The _______ is the organelle responsible for energy production in cells.',
        correctAnswer: 'mitochondria'
      },
      {
        id: 3,
        type: 'fill-blank' as const,
        question: 'During _______, sister chromatids separate and move to opposite poles.',
        correctAnswer: 'anaphase'
      }
    ];

    switch (type) {
      case 'true-false':
        return trueFalseQuestions;
      case 'fill-blank':
        return fillBlankQuestions;
      default:
        return mcqQuestions;
    }
  };

  const handleAnswer = (answer: string | number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].userAnswer = answer;
    setQuestions(updatedQuestions);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correct = questions.filter(q => q.userAnswer === q.correctAnswer || 
      (typeof q.correctAnswer === 'string' && 
       typeof q.userAnswer === 'string' && 
       q.userAnswer.toLowerCase() === q.correctAnswer.toLowerCase())).length;
    return (correct / questions.length) * 100;
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setSelectedDocument('');
  };

  if (questions.length > 0 && !showResults) {
    const question = questions[currentQuestion];
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
        <header className="p-6 border-b" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setQuestions([])}
                className="rounded-xl"
                style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>Quiz in Progress</h1>
            </div>
            <Badge style={{ backgroundColor: 'var(--pastel-pink)', color: 'var(--dark-text)' }}>
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-pink)' }}>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: 'var(--dark-text)' }}>
                Question {currentQuestion + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg" style={{ color: 'var(--dark-text)' }}>
                {question.question}
              </p>

              {question.type === 'mcq' && question.options && (
                <RadioGroup
                  value={question.userAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {question.options.map((option, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all"
                      style={{ backgroundColor: 'var(--light-text)' }}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="cursor-pointer flex-1"
                        style={{ color: 'var(--dark-text)' }}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'true-false' && (
                <RadioGroup
                  value={question.userAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(value)}
                  className="flex gap-4"
                >
                  <div 
                    className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all flex-1"
                    style={{ backgroundColor: 'var(--light-text)' }}
                  >
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="cursor-pointer" style={{ color: 'var(--dark-text)' }}>
                      True
                    </Label>
                  </div>
                  <div 
                    className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all flex-1"
                    style={{ backgroundColor: 'var(--light-text)' }}
                  >
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="cursor-pointer" style={{ color: 'var(--dark-text)' }}>
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {question.type === 'fill-blank' && (
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={question.userAnswer?.toString() || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-4 rounded-xl border-2"
                  style={{ 
                    backgroundColor: 'var(--light-text)', 
                    borderColor: 'var(--pastel-lilac)',
                    color: 'var(--dark-text)'
                  }}
                />
              )}

              <Button 
                onClick={nextQuestion}
                disabled={question.userAnswer === undefined}
                className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--pastel-teal)', 
                  color: 'var(--dark-text)',
                  border: 'none'
                }}
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
        <header className="p-6 border-b" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('dashboard')}
              className="rounded-xl"
              style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>Quiz Results</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Card className="border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--pastel-lilac)' }}>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-6xl font-bold" style={{ color: 'var(--dark-text)' }}>
                  {score.toFixed(0)}%
                </div>
                <p className="text-xl" style={{ color: 'var(--dark-text)' }}>
                  You got {questions.filter(q => q.userAnswer === q.correctAnswer).length} out of {questions.length} correct!
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    className="rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--pastel-pink)', 
                      color: 'var(--dark-text)',
                      border: 'none'
                    }}
                  >
                    <Copy size={16} className="mr-2" />
                    Copy Results
                  </Button>
                  <Button 
                    className="rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--pastel-teal)', 
                      color: 'var(--dark-text)',
                      border: 'none'
                    }}
                  >
                    <Download size={16} className="mr-2" />
                    Download Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const isCorrect = question.userAnswer === question.correctAnswer ||
                (typeof question.correctAnswer === 'string' && 
                 typeof question.userAnswer === 'string' && 
                 question.userAnswer.toLowerCase() === question.correctAnswer.toLowerCase());
              
              return (
                <Card 
                  key={question.id}
                  className="border-0 shadow-lg"
                  style={{ backgroundColor: 'var(--light-text)' }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <CheckCircle size={24} style={{ color: 'var(--pastel-teal)' }} />
                      ) : (
                        <XCircle size={24} style={{ color: 'var(--pastel-pink)' }} />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2" style={{ color: 'var(--dark-text)' }}>
                          {question.question}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--dark-text)', opacity: 0.7 }}>
                          Your answer: {question.userAnswer?.toString() || 'No answer'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm" style={{ color: 'var(--pastel-teal)' }}>
                            Correct answer: {question.correctAnswer.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button 
            onClick={resetQuiz}
            className="w-full rounded-xl py-6"
            style={{ 
              backgroundColor: 'var(--pastel-turquoise)', 
              color: 'var(--dark-text)',
              border: 'none'
            }}
          >
            Create Another Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
      <header className="p-6 border-b" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('dashboard')}
            className="rounded-xl"
            style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>Quiz Generator</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-pink)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dark-text)' }}>
              <HelpCircle size={24} />
              Create Interactive Quiz
            </CardTitle>
            <CardDescription style={{ color: 'var(--dark-text)', opacity: 0.8 }}>
              Select a document and quiz type to generate personalized questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block" style={{ color: 'var(--dark-text)' }}>
                Select Document
              </Label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger className="rounded-xl" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
                  <SelectValue placeholder="Choose a document from your history" />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc, index) => (
                    <SelectItem key={index} value={doc}>
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        {doc}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base mb-4 block" style={{ color: 'var(--dark-text)' }}>
                Quiz Type
              </Label>
              <RadioGroup value={quizType} onValueChange={setQuizType} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all"
                  style={{ backgroundColor: 'var(--light-text)' }}
                >
                  <RadioGroupItem value="mcq" id="mcq" />
                  <Label htmlFor="mcq" className="cursor-pointer" style={{ color: 'var(--dark-text)' }}>
                    Multiple Choice
                  </Label>
                </div>
                <div 
                  className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all"
                  style={{ backgroundColor: 'var(--light-text)' }}
                >
                  <RadioGroupItem value="true-false" id="true-false" />
                  <Label htmlFor="true-false" className="cursor-pointer" style={{ color: 'var(--dark-text)' }}>
                    True/False
                  </Label>
                </div>
                <div 
                  className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all"
                  style={{ backgroundColor: 'var(--light-text)' }}
                >
                  <RadioGroupItem value="fill-blank" id="fill-blank" />
                  <Label htmlFor="fill-blank" className="cursor-pointer" style={{ color: 'var(--dark-text)' }}>
                    Fill in the Blank
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={generateQuiz}
              disabled={!selectedDocument || isGenerating}
              className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--pastel-teal)', 
                color: 'var(--dark-text)',
                border: 'none'
              }}
            >
              <Sparkles size={16} className="mr-2" />
              {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}