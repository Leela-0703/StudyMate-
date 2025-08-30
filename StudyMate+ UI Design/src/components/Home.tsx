import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GraduationCap, Sparkles, BookOpen } from 'lucide-react';

interface HomeProps {
  onLogin: (email: string) => void;
  onNavigate: (page: string) => void;
}

export function Home({ onLogin, onNavigate }: HomeProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `linear-gradient(135deg, var(--pastel-lilac) 0%, var(--pastel-teal) 100%)`
      }}
    >
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={32} style={{ color: 'var(--dark-text)' }} />
              <h1 className="text-4xl lg:text-5xl font-bold" style={{ color: 'var(--dark-text)' }}>
                StudyMate+
              </h1>
            </div>
            <p className="text-xl lg:text-2xl" style={{ color: 'var(--dark-text)' }}>
              Your AI-Powered Learning Companion
            </p>
            <p className="text-lg opacity-80" style={{ color: 'var(--dark-text)' }}>
              Transform your study materials into summaries, quizzes, mindmaps, and more with the power of AI
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pastel-pink)' }}>
              <BookOpen size={24} className="mx-auto mb-2" style={{ color: 'var(--dark-text)' }} />
              <p className="font-medium" style={{ color: 'var(--dark-text)' }}>Smart Summaries</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pastel-turquoise)' }}>
              <Sparkles size={24} className="mx-auto mb-2" style={{ color: 'var(--dark-text)' }} />
              <p className="font-medium" style={{ color: 'var(--dark-text)' }}>AI Quizzes</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pastel-teal)' }}>
              <GraduationCap size={24} className="mx-auto mb-2" style={{ color: 'var(--dark-text)' }} />
              <p className="font-medium" style={{ color: 'var(--dark-text)' }}>Visual Learning</p>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="mt-8">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1719498828499-48b0086e5c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwQUklMjBhc3Npc3RhbnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjUyNzczOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Students studying with AI assistant"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-xl border-0" style={{ backgroundColor: 'var(--light-text)' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl" style={{ color: 'var(--dark-text)' }}>Welcome Back</CardTitle>
              <CardDescription style={{ color: 'var(--dark-text)' }}>
                Sign in to continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: 'var(--dark-text)' }}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-2"
                    style={{ backgroundColor: 'var(--pastel-beige)', borderColor: 'var(--pastel-lilac)' }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: 'var(--dark-text)' }}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-2"
                    style={{ backgroundColor: 'var(--pastel-beige)', borderColor: 'var(--pastel-lilac)' }}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ 
                    backgroundColor: 'var(--pastel-pink)', 
                    color: 'var(--dark-text)',
                    border: 'none'
                  }}
                >
                  Get Started
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm" style={{ color: 'var(--dark-text)' }}>
                  Don't have an account?{' '}
                  <button 
                    className="font-medium hover:underline"
                    style={{ color: 'var(--pastel-pink)' }}
                    onClick={() => onLogin('demo@studymate.com')}
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}