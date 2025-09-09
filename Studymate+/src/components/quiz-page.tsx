import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { 
  ArrowLeft, 
  Brain, 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  RotateCcw,
  Target,
  Clock
} from "lucide-react"
import { toast } from "sonner@2.0.3"

interface QuizPageProps {
  onNavigate: (page: string) => void
}

interface Question {
  id: number
  type: "mcq" | "true-false" | "fill-blank"
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export function QuizPage({ onNavigate }: QuizPageProps) {
  const [mode, setMode] = useState<"create" | "quiz" | "results">("create")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState("5")
  const [questionType, setQuestionType] = useState("mixed")
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  const popularTopics = [
    "Mathematics", "Physics", "Chemistry", "Biology", "History", 
    "Geography", "English Literature", "Computer Science", "Economics"
  ]

  const mockQuestions: Question[] = [
    {
      id: 1,
      type: "mcq",
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      explanation: "Paris is the capital and largest city of France, known for landmarks like the Eiffel Tower."
    },
    {
      id: 2,
      type: "true-false",
      question: "The Earth is flat.",
      correctAnswer: "False",
      explanation: "The Earth is actually an oblate spheroid, slightly flattened at the poles due to rotation."
    },
    {
      id: 3,
      type: "fill-blank",
      question: "The chemical symbol for water is ____.",
      correctAnswer: "H2O",
      explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom, hence H2O."
    },
    {
      id: 4,
      type: "mcq",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
      explanation: "Mars appears red due to iron oxide (rust) on its surface."
    },
    {
      id: 5,
      type: "mcq",
      question: "What is 15 × 8?",
      options: ["120", "125", "130", "115"],
      correctAnswer: "120",
      explanation: "15 × 8 = 120. You can calculate this as (10 × 8) + (5 × 8) = 80 + 40 = 120."
    }
  ]

  const generateQuiz = async () => {
    if (!topic) {
      toast.error("Please enter a topic!")
      return
    }

    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setQuestions(mockQuestions)
      setMode("quiz")
      setIsGenerating(false)
      setTimeLeft(parseInt(questionCount) * 60) // 1 minute per question
      toast.success("Quiz generated successfully! 🎉")
    }, 2000)
  }

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      finishQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const finishQuiz = () => {
    setShowResults(true)
    setMode("results")
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) }
  }

  const restartQuiz = () => {
    setMode("create")
    setQuestions([])
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setTopic("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (mode === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onNavigate("dashboard")}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Quiz Generator 🧠
              </h1>
              <p className="text-muted-foreground">Create personalized quizzes on any topic</p>
            </div>
          </div>

          {/* Quiz Configuration */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Create Your Quiz</span>
              </CardTitle>
              <CardDescription>
                Choose your topic and customize the quiz settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Input */}
              <div className="space-y-2">
                <Label>Topic or Subject</Label>
                <Input
                  placeholder="Enter any topic (e.g., World History, Algebra, Biology...)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-lg"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Popular topics:</span>
                  {popularTopics.slice(0, 5).map((popularTopic) => (
                    <Button
                      key={popularTopic}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopic(popularTopic)}
                      className="h-7 text-xs"
                    >
                      {popularTopic}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Configuration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🔴 Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Questions</Label>
                  <Select value={questionCount} onValueChange={setQuestionCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Question Types</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                      <SelectItem value="mcq">Multiple Choice Only</SelectItem>
                      <SelectItem value="true-false">True/False Only</SelectItem>
                      <SelectItem value="fill-blank">Fill in the Blank Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center pt-4">
                <Button 
                  onClick={generateQuiz}
                  disabled={isGenerating || !topic}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-pulse" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (mode === "quiz") {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={restartQuiz}
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl">{topic} Quiz</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 px-3 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl leading-relaxed">
                  {question.question}
                </CardTitle>
                <Badge variant="outline" className="ml-4">
                  {question.type.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Options */}
              {question.type === "mcq" && (
                <RadioGroup 
                  value={answers[question.id] || ""} 
                  onValueChange={handleAnswer}
                >
                  <div className="space-y-3">
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {question.type === "true-false" && (
                <RadioGroup 
                  value={answers[question.id] || ""} 
                  onValueChange={handleAnswer}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="True" id="true" />
                      <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="False" id="false" />
                      <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
                    </div>
                  </div>
                </RadioGroup>
              )}

              {question.type === "fill-blank" && (
                <div className="space-y-2">
                  <Label>Your Answer</Label>
                  <Input
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="text-lg"
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[question.id]}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (mode === "results") {
    const score = calculateScore()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Results Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl">
              {score.percentage >= 80 ? "🏆" : score.percentage >= 60 ? "🎉" : "📚"}
            </div>
            <h1 className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              You scored {score.correct} out of {score.total} ({score.percentage}%)
            </p>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 border-0">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{score.correct}</p>
                <p className="text-green-600 dark:text-green-400">Correct Answers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 border-0">
              <CardContent className="p-6 text-center">
                <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{score.total - score.correct}</p>
                <p className="text-red-600 dark:text-red-400">Incorrect Answers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border-0">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{score.percentage}%</p>
                <p className="text-purple-600 dark:text-purple-400">Final Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = userAnswer === question.correctAnswer
                
                return (
                  <div key={question.id} className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          Q{index + 1}: {question.question}
                        </p>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Your answer:</span> 
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer || "No answer"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span> 
                              <span className="text-green-600">{question.correctAnswer}</span>
                            </p>
                          )}
                          <p className="text-muted-foreground italic">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-x-4">
            <Button 
              onClick={restartQuiz}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Another Quiz
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate("dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}