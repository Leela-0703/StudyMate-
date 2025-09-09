import { useState, useEffect } from "react"
import { ThemeProvider } from "./components/theme-provider"
import { EnhancedLoginPage } from "./components/enhanced-login"
import { Dashboard } from "./components/dashboard"
import { SummarizePage } from "./components/summarize-page"
import { QuizPage } from "./components/quiz-page"
import { KnowledgeHub } from "./components/knowledge-hub"
import { MindMapGenerator } from "./components/mindmap-generator"
import { AudioLearning } from "./components/audio-learning"
import { ImageTools } from "./components/image-tools"
import { ExamHub } from "./components/exam-hub"
import { Toaster } from "./components/ui/sonner"

interface User {
  name: string
  email: string
  avatar?: string
  accessToken: string
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("studymate-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentPage("dashboard")
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("studymate-user", JSON.stringify(userData))
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("studymate-user")
    setCurrentPage("login")
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="studymate-ui-theme">
      <div className="min-h-screen">
        {currentPage === "login" && (
          <EnhancedLoginPage onLogin={handleLogin} />
        )}
        
        {currentPage === "dashboard" && user && (
          <Dashboard 
            user={user} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout} 
          />
        )}
        
        {currentPage === "summarize" && (
          <SummarizePage onNavigate={handleNavigate} />
        )}
        
        {currentPage === "quiz" && (
          <QuizPage onNavigate={handleNavigate} />
        )}
        
        {currentPage === "knowledge-hub" && (
          <KnowledgeHub onNavigate={handleNavigate} />
        )}
        
        {currentPage === "mindmap" && (
          <MindMapGenerator onNavigate={handleNavigate} />
        )}
        
        {currentPage === "audio" && (
          <AudioLearning onNavigate={handleNavigate} />
        )}
        
        {currentPage === "image" && (
          <ImageTools onNavigate={handleNavigate} />
        )}
        
        {currentPage === "exam" && (
          <ExamHub onNavigate={handleNavigate} />
        )}
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </ThemeProvider>
  )
}