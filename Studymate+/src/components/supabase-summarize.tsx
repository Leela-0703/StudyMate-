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
  Volume2,
  Loader2
} from "lucide-react"
import { toast } from "sonner@2.0.3"
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface User {
  accessToken: string
}

interface SupabaseSummarizePageProps {
  user: User
  onNavigate: (page: string) => void
}

export function SupabaseSummarizePage({ user, onNavigate }: SupabaseSummarizePageProps) {
  const [inputMethod, setInputMethod] = useState<"upload" | "text" | "topic">("text")
  const [textInput, setTextInput] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [summaryType, setSummaryType] = useState("medium")
  const [language, setLanguage] = useState("english")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [summary, setSummary] = useState("")
  const [progress, setProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<string>("")

  const topicLibrary = [
    { category: "Science", topics: ["Photosynthesis", "Newton's Laws", "Periodic Table", "DNA Structure", "Solar System", "Chemical Reactions"] },
    { category: "Math", topics: ["Algebra Basics", "Calculus Introduction", "Geometry", "Statistics", "Trigonometry", "Probability"] },
    { category: "History", topics: ["World War II", "Ancient Civilizations", "Industrial Revolution", "Renaissance", "Cold War"] },
    { category: "Literature", topics: ["Shakespeare", "Poetry Analysis", "Novel Structures", "Literary Devices", "Modern Literature"] },
    { category: "Computer Science", topics: ["Programming Basics", "Data Structures", "Algorithms", "Web Development", "Machine Learning"] }
  ]

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" },
    { value: "german", label: "Deutsch" },
    { value: "hindi", label: "हिंदी" },
    { value: "simple", label: "Simple English" }
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0825aea1/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const { fileName, signedUrl } = await response.json()
      setUploadedFile(fileName)
      
      // For demo purposes, we'll extract some mock text content
      setTextInput(`Content from uploaded file: ${fileName}. This is a mock extraction for demonstration. In a real implementation, this would contain the actual text extracted from your ${file.type} file.`)
      
      toast.success(`File "${fileName}" uploaded successfully! 📄`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload file: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const generateSummary = async () => {
    const content = textInput || selectedTopic
    if (!content) {
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

    try {
      // Simulate AI processing with more realistic mock content
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockSummary = generateMockSummary(content, summaryType, language)
      setSummary(mockSummary)
      
      // Save summary to backend
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0825aea1/summaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          topic: selectedTopic || `Custom content (${content.slice(0, 50)}...)`,
          content: content,
          summaryType,
          language,
          summary: mockSummary
        })
      })

      clearInterval(progressInterval)
      setProgress(100)
      toast.success("Summary generated and saved successfully! 🎉")
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Summary generation error:', error)
      toast.error("Failed to generate summary. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockSummary = (content: string, type: string, lang: string) => {
    const topicName = selectedTopic || "the provided content"
    
    const summaries = {
      concise: `📝 **Quick Summary of ${topicName}**\n\n• **Main Concept**: ${content.slice(0, 80)}...\n• **Key Insight**: This topic covers essential foundational principles\n• **Practical Application**: Can be applied in real-world scenarios\n• **Learning Takeaway**: Understanding this helps build comprehensive knowledge`,
      
      medium: `📚 **Detailed Summary of ${topicName}**\n\n**Overview**: ${content.slice(0, 120)}...\n\n**Key Points**:\n• **First Major Concept**: Fundamental principles that form the foundation\n• **Second Important Idea**: Supporting theories and practical applications\n• **Third Crucial Element**: Advanced concepts and their interconnections\n• **Implementation**: Real-world usage and examples\n\n**Learning Outcomes**: Students will understand core concepts, develop analytical skills, and apply knowledge practically.\n\n**Conclusion**: This comprehensive overview provides essential understanding for academic and professional growth.`,
      
      detailed: `📖 **Comprehensive Analysis of ${topicName}**\n\n**Introduction**: ${content.slice(0, 100)}... represents a fundamental area of study with wide-reaching implications.\n\n**Detailed Breakdown**:\n\n**1. Core Principles**\n• Primary concepts and their historical development\n• Theoretical frameworks and scientific foundations\n• Mathematical or logical underpinnings where applicable\n\n**2. Key Components**\n• Essential elements and their relationships\n• Supporting evidence and research findings\n• Contemporary understanding and recent developments\n\n**3. Practical Applications**\n• Real-world implementations and case studies\n• Industry applications and career relevance\n• Problem-solving methodologies\n\n**4. Advanced Concepts**\n• Complex interconnections with related fields\n• Current research trends and future directions\n• Challenges and ongoing debates in the field\n\n**Critical Analysis**: This topic demonstrates significant importance in academic and professional contexts, requiring deep understanding for effective application.\n\n**Conclusion**: Mastery of this subject provides essential knowledge for continued learning and professional development, forming a crucial foundation for advanced study.`
    }

    let baseSummary = summaries[type as keyof typeof summaries] || summaries.medium

    if (lang === "simple") {
      baseSummary = `📝 **Easy Summary of ${topicName}**\n\nThis topic is about: ${content.slice(0, 60)}...\n\n**Simple Points**:\n• Easy Point 1: Main idea explained simply\n• Easy Point 2: Important parts made clear\n• Easy Point 3: Why this matters to you\n• Easy Point 4: How you can use this\n\n**Why Learn This**: Understanding this topic will help you learn more things and do better in school or work!\n\n**Remember**: Take your time learning this. Every expert was once a beginner! 🌟`
    } else if (lang === "spanish") {
      baseSummary = `📚 **Resumen Detallado de ${topicName}**\n\n**Descripción General**: Este tema cubre conceptos fundamentales...\n\n**Puntos Clave**:\n• Concepto Principal: Ideas fundamentales\n• Segunda Idea Importante: Aplicaciones prácticas\n• Tercer Elemento Crucial: Conexiones avanzadas\n\n**Conclusión**: Este resumen proporciona una comprensión esencial para el crecimiento académico y profesional.`
    }

    return baseSummary
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
    toast.success("Summary copied to clipboard! 📋")
  }

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summary.replace(/[#*•]/g, ''))
      speechSynthesis.speak(utterance)
      toast.success("Playing summary audio! 🔊")
    } else {
      toast.error("Text-to-speech not supported in your browser")
    }
  }

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTopic || 'summary'}_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Summary downloaded! 💾")
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
            <p className="text-muted-foreground">Transform any content into clear, concise summaries with AI</p>
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
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    <span>Upload File</span>
                  </>
                )}
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
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg mb-2">Upload your files here</p>
                  <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOC, DOCX, TXT, and images</p>
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <Button asChild variant="outline" disabled={isUploading}>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isUploading ? "Uploading..." : "Browse Files"}
                    </label>
                  </Button>
                </div>
                {uploadedFile && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✅ File uploaded: {uploadedFile}
                    </p>
                  </div>
                )}
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
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground border-b">
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
                  Select from our curated topic library or type custom content above
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Options */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Summary Options</CardTitle>
            <CardDescription>Customize your summary to match your learning needs</CardDescription>
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
                      <span>Concise - Quick overview</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Medium - Balanced detail</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="detailed">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Detailed - Comprehensive</span>
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
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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
                  <span className="text-sm font-medium">AI is processing your content...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Our advanced AI is analyzing and creating your personalized summary
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
                  <Button variant="outline" size="sm" onClick={downloadSummary}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary">{summaryType} length</Badge>
                <Badge variant="secondary">{languages.find(l => l.value === language)?.label}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">Saved ✓</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-muted/50 p-6 rounded-lg whitespace-pre-wrap border-l-4 border-teal-500">
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