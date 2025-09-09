import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { 
  BookOpen, 
  Brain, 
  Map, 
  Headphones, 
  Image, 
  GraduationCap, 
  Trophy, 
  Flame, 
  Target,
  Clock,
  Star,
  TrendingUp,
  Library
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface User {
  name: string
  email: string
  avatar?: string
}

interface DashboardProps {
  user: User
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [studyStreak] = useState(7)
  const [weeklyProgress] = useState(68)
  const [totalPoints] = useState(1420)

  const features = [
    {
      id: "knowledge-hub",
      title: "Knowledge Hub",
      description: "Access textbooks & study materials",
      icon: Library,
      color: "bg-[var(--pastel-lavender)]",
      textColor: "text-indigo-700 dark:text-indigo-300",
      borderColor: "border-indigo-200 dark:border-indigo-700",
      emoji: "📚"
    },
    {
      id: "summarize",
      title: "Smart Summarizer",
      description: "Upload docs & get AI summaries",
      icon: BookOpen,
      color: "bg-[var(--pastel-teal)]",
      textColor: "text-teal-700 dark:text-teal-300",
      borderColor: "border-teal-200 dark:border-teal-700",
      emoji: "📄"
    },
    {
      id: "quiz",
      title: "Quiz Generator",
      description: "Test your knowledge with AI quizzes",
      icon: Brain,
      color: "bg-[var(--pastel-pink)]",
      textColor: "text-pink-700 dark:text-pink-300",
      borderColor: "border-pink-200 dark:border-pink-700",
      emoji: "❓"
    },
    {
      id: "mindmap",
      title: "Mindmaps",
      description: "Visualize concepts & connections",
      icon: Map,
      color: "bg-[var(--pastel-lilac)]",
      textColor: "text-purple-700 dark:text-purple-300",
      borderColor: "border-purple-200 dark:border-purple-700",
      emoji: "🌐"
    },
    {
      id: "audio",
      title: "Audio Learning",
      description: "Convert notes to podcasts",
      icon: Headphones,
      color: "bg-[var(--pastel-turquoise)]",
      textColor: "text-blue-700 dark:text-blue-300",
      borderColor: "border-blue-200 dark:border-blue-700",
      emoji: "🎧"
    },
    {
      id: "image",
      title: "Image Tools",
      description: "Analyze & generate images",
      icon: Image,
      color: "bg-[var(--pastel-mint)]",
      textColor: "text-green-700 dark:text-green-300",
      borderColor: "border-green-200 dark:border-green-700",
      emoji: "🖼️"
    },
    {
      id: "exam",
      title: "Exam Hub",
      description: "Practice tests & question papers",
      icon: GraduationCap,
      color: "bg-[var(--pastel-peach)]",
      textColor: "text-orange-700 dark:text-orange-300",
      borderColor: "border-orange-200 dark:border-orange-700",
      emoji: "📋"
    }
  ]

  const recentActivity = [
    { title: "Physics Summary", time: "2 hours ago", type: "summary" },
    { title: "Math Quiz", time: "Yesterday", type: "quiz", score: "85%" },
    { title: "Chemistry Mindmap", time: "2 days ago", type: "mindmap" }
  ]

  const achievements = [
    { title: "Quiz Master", description: "Completed 10 quizzes", icon: Trophy, unlocked: true },
    { title: "Study Streak", description: "7 days in a row", icon: Flame, unlocked: true },
    { title: "Knowledge Seeker", description: "Generated 5 summaries", icon: Target, unlocked: false }
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">🎓</div>
            <h1 className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StudyMate+
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {user.avatar || user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-3xl">
            <span>{getGreeting()}, {user.name}!</span>
            <span className="animate-wave">👋</span>
          </div>
          <p className="text-lg text-muted-foreground">Ready to supercharge your learning today?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 border-0">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-orange-500 rounded-full">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{studyStreak}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">Day Study Streak</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 border-0">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{weeklyProgress}%</p>
                <p className="text-sm text-green-600 dark:text-green-400">Weekly Progress</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border-0">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalPoints}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total Points</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div>
          <h2 className="text-2xl mb-6 text-center">Choose Your Learning Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${feature.borderColor} bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm group`}
                onClick={() => onNavigate(feature.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 ${feature.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.textColor}`} />
                    </div>
                    <span className="text-2xl">{feature.emoji}</span>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.score && (
                    <Badge variant="secondary">{activity.score}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted/50'
                }`}>
                  <achievement.icon className={`h-5 w-5 ${
                    achievement.unlocked ? 'text-green-600' : 'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-medium ${!achievement.unlocked && 'text-muted-foreground'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      ✓
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Weekly Learning Progress</CardTitle>
            <CardDescription>Keep up the great work! You're {weeklyProgress}% towards your weekly goal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={weeklyProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0%</span>
              <span>Goal: 100%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}