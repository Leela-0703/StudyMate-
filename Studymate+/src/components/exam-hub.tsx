import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { ThemeToggle } from "./theme-toggle"
import { toast } from "sonner@2.0.3"
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  Search, 
  Filter, 
  Download, 
  Play, 
  Home,
  Calendar,
  FileText,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3
} from "lucide-react"

interface ExamPaper {
  id: string
  title: string
  board: string
  class: string
  subject: string
  year: number
  duration: number
  maxMarks: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionCount: number
  category: 'Previous Papers' | 'Mock Tests' | 'Practice Sets'
  topics: string[]
  completed?: boolean
  score?: number
  attempts: number
}

interface MockExam {
  id: string
  title: string
  subject: string
  duration: number
  questions: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  participants: number
  rating: number
  isLive: boolean
  scheduledDate?: Date
}

const SAMPLE_EXAM_PAPERS: ExamPaper[] = [
  {
    id: '1',
    title: 'CBSE Class 12 Mathematics 2023',
    board: 'CBSE',
    class: '12',
    subject: 'Mathematics',
    year: 2023,
    duration: 180,
    maxMarks: 80,
    difficulty: 'Hard',
    questionCount: 38,
    category: 'Previous Papers',
    topics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Statistics'],
    attempts: 1247,
    score: 67
  },
  {
    id: '2',
    title: 'JEE Main Mock Test - Physics',
    board: 'NTA',
    class: '12',
    subject: 'Physics',
    year: 2024,
    duration: 120,
    maxMarks: 100,
    difficulty: 'Hard',
    questionCount: 30,
    category: 'Mock Tests',
    topics: ['Mechanics', 'Thermodynamics', 'Optics', 'Modern Physics'],
    attempts: 2341,
    completed: true,
    score: 78
  },
  {
    id: '3',
    title: 'ICSE Class 10 English Literature',
    board: 'ICSE',
    class: '10',
    subject: 'English',
    year: 2023,
    duration: 120,
    maxMarks: 80,
    difficulty: 'Medium',
    questionCount: 25,
    category: 'Previous Papers',
    topics: ['Poetry', 'Prose', 'Drama', 'Grammar'],
    attempts: 856
  },
  {
    id: '4',
    title: 'NEET Biology Practice Set',
    board: 'NTA',
    class: '12',
    subject: 'Biology',
    year: 2024,
    duration: 90,
    maxMarks: 180,
    difficulty: 'Hard',
    questionCount: 45,
    category: 'Practice Sets',
    topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
    attempts: 3142
  },
  {
    id: '5',
    title: 'CBSE Class 11 Chemistry',
    board: 'CBSE',
    class: '11',
    subject: 'Chemistry',
    year: 2023,
    duration: 180,
    maxMarks: 70,
    difficulty: 'Medium',
    questionCount: 33,
    category: 'Previous Papers',
    topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
    attempts: 967,
    completed: true,
    score: 58
  }
]

const MOCK_EXAMS: MockExam[] = [
  {
    id: 'live1',
    title: 'JEE Advanced Mock Test',
    subject: 'All Subjects',
    duration: 180,
    questions: 54,
    difficulty: 'Hard',
    participants: 15420,
    rating: 4.8,
    isLive: true,
    scheduledDate: new Date('2024-12-15T10:00:00')
  },
  {
    id: 'live2',
    title: 'NEET Mock Exam',
    subject: 'PCB',
    duration: 180,
    questions: 180,
    difficulty: 'Hard',
    participants: 28350,
    rating: 4.7,
    isLive: true,
    scheduledDate: new Date('2024-12-16T14:00:00')
  }
]

interface ExamHubProps {
  onNavigate: (page: string) => void
}

export function ExamHub({ onNavigate }: ExamHubProps) {
  const [examPapers, setExamPapers] = useState<ExamPaper[]>(SAMPLE_EXAM_PAPERS)
  const [filteredPapers, setFilteredPapers] = useState<ExamPaper[]>(SAMPLE_EXAM_PAPERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBoard, setSelectedBoard] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null)

  // Statistics
  const totalPapers = examPapers.length
  const completedPapers = examPapers.filter(p => p.completed).length
  const averageScore = examPapers.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / examPapers.filter(p => p.score).length || 0

  // Filter papers based on search and filters
  useEffect(() => {
    let filtered = examPapers

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Board filter
    if (selectedBoard !== 'all') {
      filtered = filtered.filter(paper => paper.board === selectedBoard)
    }

    // Class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter(paper => paper.class === selectedClass)
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(paper => paper.subject === selectedSubject)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(paper => paper.category === selectedCategory)
    }

    setFilteredPapers(filtered)
  }, [examPapers, searchQuery, selectedBoard, selectedClass, selectedSubject, selectedCategory])

  const startExam = (paper: ExamPaper) => {
    toast.success(`Starting ${paper.title}...`)
    // Here you would navigate to an exam interface
    // For now, we'll just show a toast
    setTimeout(() => {
      toast.info('Exam interface will be available soon!')
    }, 1000)
  }

  const downloadPaper = (paper: ExamPaper) => {
    toast.success(`Downloading ${paper.title}...`)
    // Simulate download
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Previous Papers': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Mock Tests': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Practice Sets': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="text-2xl">📚</div>
                <div>
                  <h1 className="text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Exam Hub
                  </h1>
                  <p className="text-sm text-muted-foreground">Practice tests & question papers</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalPapers}</p>
                  <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Total Papers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedPapers}</p>
                  <p className="text-sm text-green-600/70 dark:text-green-400/70">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(averageScore)}%</p>
                  <p className="text-sm text-purple-600/70 dark:text-purple-400/70">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{Math.round((completedPapers / totalPapers) * 100)}%</p>
                  <p className="text-sm text-orange-600/70 dark:text-orange-400/70">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="papers" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="papers" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Question Papers
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Live Exams
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Question Papers Tab */}
          <TabsContent value="papers" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search papers, subjects, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Boards</SelectItem>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="NTA">NTA</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Previous Papers">Previous Papers</SelectItem>
                        <SelectItem value="Mock Tests">Mock Tests</SelectItem>
                        <SelectItem value="Practice Sets">Practice Sets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Papers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPapers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{paper.board} • {paper.subject} • Class {paper.class}</p>
                      </div>
                      {paper.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(paper.category)}>
                        {paper.category}
                      </Badge>
                      <Badge className={getDifficultyColor(paper.difficulty)}>
                        {paper.difficulty}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{paper.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{paper.maxMarks} marks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{paper.questionCount} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{paper.attempts} attempts</span>
                      </div>
                    </div>

                    {paper.score && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Your Score</span>
                          <span className="font-medium">{paper.score}%</span>
                        </div>
                        <Progress value={paper.score} className="h-2" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {paper.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {paper.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{paper.topics.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => startExam(paper)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {paper.completed ? 'Retake' : 'Start'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPaper(paper)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{paper.title}</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-96">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Board</p>
                                  <p className="text-sm text-muted-foreground">{paper.board}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Subject</p>
                                  <p className="text-sm text-muted-foreground">{paper.subject}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Class</p>
                                  <p className="text-sm text-muted-foreground">{paper.class}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Year</p>
                                  <p className="text-sm text-muted-foreground">{paper.year}</p>
                                </div>
                              </div>
                              <Separator />
                              <div>
                                <p className="text-sm font-medium mb-2">Topics Covered</p>
                                <div className="flex flex-wrap gap-2">
                                  {paper.topics.map((topic, index) => (
                                    <Badge key={index} variant="secondary">
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPapers.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">No papers found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Live Exams Tab */}
          <TabsContent value="live" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {MOCK_EXAMS.map((exam) => (
                <Card key={exam.id} className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        LIVE
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{exam.subject}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.participants.toLocaleString()} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{exam.rating} rating</span>
                      </div>
                    </div>

                    {exam.scheduledDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Scheduled: {exam.scheduledDate.toLocaleDateString()} at {exam.scheduledDate.toLocaleTimeString()}</span>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => toast.success(`Joining ${exam.title}...`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Join Live Exam
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Mathematics</span>
                        <span className="text-sm">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Physics</span>
                        <span className="text-sm">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Chemistry</span>
                        <span className="text-sm">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">JEE Mock Test completed</p>
                        <p className="text-xs text-muted-foreground">Score: 78% • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Downloaded CBSE Mathematics paper</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Upcoming: NEET Mock Exam</p>
                        <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}