import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Upload, 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  Download, 
  Copy, 
  Sparkles,
  Clock,
  Languages,
  Volume2
} from "lucide-react"
import { toast } from "sonner@2.0.3"

interface SummarizePageProps {
  onNavigate: (page: string) => void
}

export function SummarizePage({ onNavigate }: SummarizePageProps) {
  const [inputMethod, setInputMethod] = useState<"upload" | "text" | "topic">("text")
  const [textInput, setTextInput] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [summaryType, setSummaryType] = useState("medium")
  const [language, setLanguage] = useState("english")
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState("")
  const [progress, setProgress] = useState(0)

  const topicLibrary = [
    { category: "Science", topics: ["Photosynthesis", "Newton's Laws", "Periodic Table", "DNA Structure"] },
    { category: "Math", topics: ["Algebra Basics", "Calculus Introduction", "Geometry", "Statistics"] },
    { category: "History", topics: ["World War II", "Ancient Civilizations", "Industrial Revolution"] },
    { category: "Literature", topics: ["Shakespeare", "Poetry Analysis", "Novel Structures"] }
  ]

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" },
    { value: "german", label: "Deutsch" },
    { value: "hindi", label: "हिंदी" },
    { value: "simple", label: "Simple English" }
  ]

  const generateSummary = async () => {
    if (!textInput && !selectedTopic) {
      toast.error("Please provide some content to summarize!")
      return
    }

    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate AI processing
    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      
      const content = textInput || `Information about ${selectedTopic}`
      const mockSummary = generateMockSummary(content, summaryType, language)
      setSummary(mockSummary)
      setIsGenerating(false)
      toast.success("Summary generated successfully! 🎉")
    }, 3000)
  }

  const generateMockSummary = (content: string, type: string, lang: string) => {
    const summaries = {
      concise: `📝 **Quick Summary**\n\n• Main concept: ${content.slice(0, 50)}...\n• Key takeaway: Essential understanding\n• Application: Practical usage`,
      medium: `📚 **Detailed Summary**\n\n**Overview**: ${content.slice(0, 100)}...\n\n**Key Points**:\n• Point 1: First major concept\n• Point 2: Second important idea\n• Point 3: Third crucial element\n\n**Conclusion**: Understanding these concepts helps build foundational knowledge.`,
      detailed: `📖 **Comprehensive Summary**\n\n**Introduction**: ${content.slice(0, 80)}...\n\n**Main Body**:\n1. **First Section**: Detailed explanation of primary concepts\n2. **Second Section**: In-depth analysis of supporting ideas\n3. **Third Section**: Comprehensive coverage of related topics\n\n**Key Insights**:\n• Deep understanding of core principles\n• Practical applications in real-world scenarios\n• Connections to broader subject areas\n\n**Conclusion**: This comprehensive overview provides a thorough understanding of the subject matter.`
    }

    let baseSummary = summaries[type as keyof typeof summaries] || summaries.medium

    if (lang === "simple") {
      baseSummary = `📝 **Easy Summary**\n\nThis is about: ${content.slice(0, 50)}...\n\nMain ideas:\n• Simple point 1\n• Simple point 2\n• Simple point 3\n\nWhy it matters: It helps you learn!`
    }

    return baseSummary
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
    toast.success("Summary copied to clipboard!")
  }

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summary.replace(/[#*•]/g, ''))
      speechSynthesis.speak(utterance)
      toast.success("Playing summary audio!")
    }
  }

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
            <h1 className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Smart Summarizer 📄
            </h1>
            <p className="text-muted-foreground">Transform any content into clear, concise summaries</p>
          </div>
        </div>

        {/* Input Method Selection */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Choose Input Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={inputMethod === "upload" ? "default" : "outline"}
                onClick={() => setInputMethod("upload")}
                className="h-20 flex-col space-y-2"
              >
                <Upload className="h-6 w-6" />
                <span>Upload File</span>
              </Button>
              <Button
                variant={inputMethod === "text" ? "default" : "outline"}
                onClick={() => setInputMethod("text")}
                className="h-20 flex-col space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>Type/Paste Text</span>
              </Button>
              <Button
                variant={inputMethod === "topic" ? "default" : "outline"}
                onClick={() => setInputMethod("topic")}
                className="h-20 flex-col space-y-2"
              >
                <Sparkles className="h-6 w-6" />
                <span>Choose Topic</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Input */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Input Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inputMethod === "upload" && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg mb-2">Drag & drop your files here</p>
                <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOC, DOCX, TXT, and images</p>
                <Button variant="outline">
                  Browse Files
                </Button>
              </div>
            )}

            {inputMethod === "text" && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your text here, or type any topic you want to learn about..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="text-sm text-muted-foreground">
                  {textInput.length} characters
                </div>
              </div>
            )}

            {inputMethod === "topic" && (
              <div className="space-y-4">
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a topic from our library" />
                  </SelectTrigger>
                  <SelectContent>
                    {topicLibrary.map((category) => (
                      <div key={category.category}>
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                          {category.category}
                        </div>
                        {category.topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Or type any custom topic in the text area above
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Options */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Summary Options</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary Length</label>
              <Select value={summaryType} onValueChange={setSummaryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Concise (Quick read)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Medium (Balanced)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="detailed">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Detailed (Comprehensive)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language & Style</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center space-x-2">
                        <Languages className="h-4 w-4" />
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={generateSummary}
            disabled={isGenerating || (!textInput && !selectedTopic)}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 rounded-full text-lg shadow-lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Smart Summary
              </>
            )}
          </Button>
        </div>

        {/* Progress */}
        {isGenerating && (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing your content...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Our AI is analyzing and creating your personalized summary
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Summary */}
        {summary && (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-teal-600" />
                  <span>Generated Summary</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={speakSummary}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary">{summaryType} length</Badge>
                <Badge variant="secondary">{language}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}