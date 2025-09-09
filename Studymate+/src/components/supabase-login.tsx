import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { GraduationCap, BookOpen, Brain, Sparkles, Loader2 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { createClient } from "npm:@supabase/supabase-js"
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from "sonner@2.0.3"

interface SupabaseLoginPageProps {
  onLogin: (userData: { name: string; email: string; avatar?: string; accessToken: string }) => void
}

export function SupabaseLoginPage({ onLogin }: SupabaseLoginPageProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  )

  const avatarOptions = [
    "👨‍🎓", "👩‍🎓", "🧑‍💻", "👨‍🔬", "👩‍🔬", "🧑‍🎨", "👨‍📚", "👩‍📚"
  ]

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) {
        toast.error(`Login failed: ${error.message}`)
        return
      }

      if (session?.access_token && session?.user) {
        onLogin({
          name: session.user.user_metadata?.name || "Student",
          email: session.user.email || "",
          avatar: session.user.user_metadata?.avatar || "👨‍🎓",
          accessToken: session.access_token
        })
        toast.success("Welcome back to StudyMate+! 🎉")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match!")
      return
    }

    setIsLoading(true)

    try {
      // First create the user account via our backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0825aea1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
          avatar: selectedAvatar
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(`Signup failed: ${errorData.error}`)
        return
      }

      // Now sign in the user
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: signupData.email,
        password: signupData.password,
      })

      if (error) {
        toast.error(`Auto-login after signup failed: ${error.message}`)
        return
      }

      if (session?.access_token && session?.user) {
        onLogin({
          name: signupData.name,
          email: signupData.email,
          avatar: selectedAvatar,
          accessToken: session.access_token
        })
        toast.success("Welcome to StudyMate+! Your learning journey begins now! 🚀")
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[var(--pastel-pink)] rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-[var(--pastel-teal)] rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-[var(--pastel-lilac)] rounded-full opacity-25 animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 right-32 w-12 h-12 bg-[var(--pastel-turquoise)] rounded-full opacity-20 animate-bounce delay-500"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Hero Section */}
        <div className="hidden lg:flex flex-col items-center space-y-6 flex-1">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-6xl shadow-lg">
              🎓
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StudyMate+
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Your AI-powered study companion for every learning journey
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--pastel-teal)] bg-opacity-30">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span className="text-sm">Smart Summaries</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--pastel-pink)] bg-opacity-30">
                <Brain className="w-5 h-5 text-pink-600" />
                <span className="text-sm">AI Quizzes</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--pastel-lilac)] bg-opacity-30">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Exam Prep</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--pastel-turquoise)] bg-opacity-30">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Mindmaps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Signup Form */}
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                🎓
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to StudyMate+
            </CardTitle>
            <CardDescription>
              Join thousands of students learning smarter with AI
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg h-11 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Start Learning 🚀"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className="rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Choose Avatar</Label>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {avatarOptions.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          disabled={isLoading}
                          className={`w-10 h-10 text-xl rounded-full border-2 transition-all ${
                            selectedAvatar === avatar 
                              ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30' 
                              : 'border-gray-200 hover:border-purple-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="student@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg h-11 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account ✨"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}