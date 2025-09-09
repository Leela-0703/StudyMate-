import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Microscope, 
  Palette, 
  Calculator,
  Atom,
  Globe,
  Users,
  Clock,
  Download,
  Eye,
  ArrowLeft,
  Star,
  Filter,
  Zap,
  Lightbulb,
  Target,
  Book
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface KnowledgeHubProps {
  onNavigate: (page: string) => void
}

interface ContentItem {
  id: string
  title: string
  description: string
  subject: string
  level: string
  type: "textbook" | "notes" | "paper" | "exercise" | "reference"
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  rating: number
  downloads: number
  source: string
  topics: string[]
}

export function KnowledgeHub({ onNavigate }: KnowledgeHubProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const levels = [
    { id: "classes-1-5", label: "Classes 1-5", icon: "🌱", color: "bg-green-100 text-green-700" },
    { id: "classes-6-10", label: "Classes 6-10", icon: "📚", color: "bg-blue-100 text-blue-700" },
    { id: "classes-11-12", label: "Classes 11-12", icon: "🎯", color: "bg-purple-100 text-purple-700" },
    { id: "undergraduate", label: "Undergraduate", icon: "🎓", color: "bg-orange-100 text-orange-700" },
    { id: "postgraduate", label: "Postgraduate", icon: "⚡", color: "bg-pink-100 text-pink-700" },
    { id: "phd-research", label: "PhD & Research", icon: "🔬", color: "bg-teal-100 text-teal-700" }
  ]

  const subjects = {
    "classes-1-5": ["Mathematics", "English", "Science", "Social Studies", "Hindi"],
    "classes-6-10": ["Mathematics", "Science", "Social Science", "English", "Hindi", "Computer Science"],
    "classes-11-12": ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "Economics", "Political Science", "History", "Geography"],
    "undergraduate": ["Engineering", "Medical", "Commerce", "Arts", "Science", "Computer Applications", "Management"],
    "postgraduate": ["MBA", "MSc", "MA", "MTech", "Medical PG", "Research Methods"],
    "phd-research": ["Research Papers", "Thesis Writing", "Publication Guidelines", "Grant Proposals"]
  }

  // Sample content data
  const knowledgeContent: ContentItem[] = [
    // Classes 1-5
    {
      id: "ncert-math-1",
      title: "NCERT Mathematics Class 1",
      description: "Basic counting, shapes, and simple addition/subtraction concepts",
      subject: "Mathematics",
      level: "classes-1-5",
      type: "textbook",
      difficulty: "beginner",
      duration: "30 mins",
      rating: 4.8,
      downloads: 1250,
      source: "NCERT",
      topics: ["Numbers", "Shapes", "Addition", "Subtraction"]
    },
    {
      id: "ncert-english-2",
      title: "NCERT English Class 2 - Marigold",
      description: "Stories, poems, and basic grammar for young learners",
      subject: "English",
      level: "classes-1-5",
      type: "textbook",
      difficulty: "beginner",
      duration: "45 mins",
      rating: 4.7,
      downloads: 980,
      source: "NCERT",
      topics: ["Stories", "Poems", "Grammar", "Vocabulary"]
    },
    
    // Classes 6-10
    {
      id: "ncert-science-8",
      title: "NCERT Science Class 8",
      description: "Physics, Chemistry, and Biology concepts for middle school",
      subject: "Science",
      level: "classes-6-10",
      type: "textbook",
      difficulty: "intermediate",
      duration: "2 hours",
      rating: 4.9,
      downloads: 2100,
      source: "NCERT",
      topics: ["Force & Pressure", "Light", "Coal & Petroleum", "Cell Structure"]
    },
    {
      id: "cbse-math-10",
      title: "CBSE Mathematics Class 10 Sample Papers",
      description: "Previous year questions and practice papers",
      subject: "Mathematics",
      level: "classes-6-10",
      type: "exercise",
      difficulty: "intermediate",
      duration: "3 hours",
      rating: 4.6,
      downloads: 3200,
      source: "CBSE",
      topics: ["Real Numbers", "Polynomials", "Trigonometry", "Statistics"]
    },

    // Classes 11-12
    {
      id: "ncert-physics-12",
      title: "NCERT Physics Class 12",
      description: "Advanced physics concepts including electromagnetism and modern physics",
      subject: "Physics",
      level: "classes-11-12",
      type: "textbook",
      difficulty: "advanced",
      duration: "4 hours",
      rating: 4.8,
      downloads: 1800,
      source: "NCERT",
      topics: ["Electric Charges", "Electromagnetic Induction", "Wave Optics", "Atoms"]
    },
    {
      id: "jee-chemistry-notes",
      title: "JEE Chemistry Complete Notes",
      description: "Comprehensive chemistry notes for JEE preparation",
      subject: "Chemistry",
      level: "classes-11-12",
      type: "notes",
      difficulty: "advanced",
      duration: "6 hours",
      rating: 4.9,
      downloads: 2500,
      source: "Expert Compilation",
      topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"]
    },

    // Undergraduate
    {
      id: "engineering-calculus",
      title: "Engineering Mathematics - Calculus",
      description: "Differential and integral calculus for engineering students",
      subject: "Engineering",
      level: "undergraduate",
      type: "reference",
      difficulty: "advanced",
      duration: "8 hours",
      rating: 4.7,
      downloads: 1600,
      source: "MIT OpenCourseWare",
      topics: ["Derivatives", "Integrals", "Differential Equations", "Series"]
    },
    {
      id: "data-structures",
      title: "Data Structures and Algorithms",
      description: "Complete guide to DSA with examples and practice problems",
      subject: "Computer Applications",
      level: "undergraduate",
      type: "notes",
      difficulty: "intermediate",
      duration: "10 hours",
      rating: 4.8,
      downloads: 3100,
      source: "Stanford CS",
      topics: ["Arrays", "Trees", "Graphs", "Sorting", "Dynamic Programming"]
    },

    // Research
    {
      id: "ml-research-survey",
      title: "Machine Learning in Education: A Survey",
      description: "Comprehensive survey of ML applications in educational technology",
      subject: "Research Papers",
      level: "phd-research",
      type: "paper",
      difficulty: "advanced",
      duration: "2 hours",
      rating: 4.6,
      downloads: 450,
      source: "arXiv",
      topics: ["Machine Learning", "Education Technology", "Personalized Learning"]
    }
  ]

  const filteredContent = knowledgeContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLevel = selectedLevel === "all" || item.level === selectedLevel
    const matchesSubject = selectedSubject === "all" || item.subject === selectedSubject
    const matchesType = selectedType === "all" || item.type === selectedType

    return matchesSearch && matchesLevel && matchesSubject && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "textbook": return <BookOpen className="h-4 w-4" />
      case "notes": return <Book className="h-4 w-4" />
      case "paper": return <Microscope className="h-4 w-4" />
      case "exercise": return <Target className="h-4 w-4" />
      case "reference": return <Lightbulb className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "textbook": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "notes": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "paper": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
      case "exercise": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
      case "reference": return "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700"
      case "intermediate": return "bg-yellow-100 text-yellow-700"
      case "advanced": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const currentLevelSubjects = selectedLevel === "all" ? 
    Object.values(subjects).flat() : 
    subjects[selectedLevel as keyof typeof subjects] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("dashboard")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="text-2xl">📚</div>
            <h1 className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Knowledge Hub
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-3xl">
            <span>📖</span>
            <h2>Explore Our Knowledge Library</h2>
            <span>✨</span>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access curriculum-aligned content, research papers, and study materials from Classes 1-10 to PhD level research
          </p>
        </div>

        {/* Level Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {levels.map((level) => (
            <Card 
              key={level.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                selectedLevel === level.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-border'
              }`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{level.icon}</div>
                <div className={`text-sm font-medium px-2 py-1 rounded-lg ${level.color}`}>
                  {level.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, subject, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {Array.from(new Set(currentLevelSubjects)).map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="textbook">Textbooks</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="paper">Research Papers</SelectItem>
                  <SelectItem value="exercise">Exercises</SelectItem>
                  <SelectItem value="reference">References</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">
              {filteredContent.length} {filteredContent.length === 1 ? 'Resource' : 'Resources'} Found
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedLevel("all")
                setSelectedSubject("all")
                setSelectedType("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className={getTypeColor(item.type)}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{item.downloads}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <strong>Source:</strong> {item.source}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {item.topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.topics.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or explore different categories
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedLevel("all")
                  setSelectedSubject("all")
                  setSelectedType("all")
                }}
              >
                Show All Resources
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}