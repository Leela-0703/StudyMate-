import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  FileText, 
  HelpCircle, 
  Network, 
  Image, 
  Volume2, 
  Download, 
  History,
  LogOut,
  Upload,
  Clock
} from 'lucide-react';

interface DashboardProps {
  user: string | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const features = [
    {
      id: 'upload',
      title: 'Document Upload & Summarize',
      description: 'Upload documents and get AI-powered summaries',
      icon: FileText,
      color: 'var(--pastel-teal)',
      page: 'upload'
    },
    {
      id: 'quiz',
      title: 'Quiz Generator',
      description: 'Create interactive quizzes from your content',
      icon: HelpCircle,
      color: 'var(--pastel-pink)',
      page: 'quiz'
    },
    {
      id: 'mindmap',
      title: 'Mindmaps & Diagrams',
      description: 'Visualize concepts with AI-generated mindmaps',
      icon: Network,
      color: 'var(--pastel-lilac)',
      page: 'mindmap'
    },
    {
      id: 'image-tts',
      title: 'Images & Audio',
      description: 'Generate images and text-to-speech content',
      icon: Image,
      color: 'var(--pastel-turquoise)',
      page: 'image-tts'
    }
  ];

  const recentActivity = [
    {
      type: 'summary',
      title: 'Biology Chapter 5 Summary',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'quiz',
      title: 'History Quiz - World War II',
      time: '1 day ago',
      status: 'completed'
    },
    {
      type: 'mindmap',
      title: 'Physics - Quantum Mechanics',
      time: '2 days ago',
      status: 'completed'
    },
    {
      type: 'image',
      title: 'Chemistry Molecular Structure',
      time: '3 days ago',
      status: 'completed'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'summary': return FileText;
      case 'quiz': return HelpCircle;
      case 'mindmap': return Network;
      case 'image': return Image;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
      {/* Header */}
      <header className="p-6 border-b" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>StudyMate+</h1>
            <Badge variant="secondary" style={{ backgroundColor: 'var(--pastel-pink)', color: 'var(--dark-text)' }}>
              Pro
            </Badge>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="rounded-xl"
            style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Banner */}
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-lilac)' }}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--dark-text)' }}>
                  Hello, {user?.split('@')[0] || 'Student'}! 👋
                </h2>
                <p className="text-lg opacity-80" style={{ color: 'var(--dark-text)' }}>
                  Ready to supercharge your learning? Choose a tool below to get started.
                </p>
              </div>
              <Upload size={48} style={{ color: 'var(--dark-text)' }} />
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{ backgroundColor: feature.color }}
                onClick={() => onNavigate(feature.page)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full" style={{ backgroundColor: 'var(--light-text)' }}>
                    <IconComponent size={32} style={{ color: 'var(--dark-text)' }} />
                  </div>
                  <CardTitle className="text-lg" style={{ color: 'var(--dark-text)' }}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription style={{ color: 'var(--dark-text)', opacity: 0.8 }}>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full rounded-xl transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: 'var(--light-text)', 
                      color: 'var(--dark-text)',
                      border: 'none'
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--light-text)' }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History size={24} style={{ color: 'var(--dark-text)' }} />
                  <CardTitle style={{ color: 'var(--dark-text)' }}>Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ backgroundColor: 'var(--pastel-beige)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--pastel-lilac)' }}>
                            <IconComponent size={16} style={{ color: 'var(--dark-text)' }} />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--dark-text)' }}>
                              {activity.title}
                            </p>
                            <div className="flex items-center gap-1 text-sm opacity-70" style={{ color: 'var(--dark-text)' }}>
                              <Clock size={12} />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="rounded-lg"
                          style={{ borderColor: 'var(--pastel-teal)', color: 'var(--dark-text)' }}
                        >
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--light-text)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--dark-text)' }}>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pastel-pink)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>24</div>
                <div className="text-sm" style={{ color: 'var(--dark-text)' }}>Documents Processed</div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pastel-teal)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>12</div>
                <div className="text-sm" style={{ color: 'var(--dark-text)' }}>Quizzes Created</div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pastel-turquoise)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>8</div>
                <div className="text-sm" style={{ color: 'var(--dark-text)' }}>Mindmaps Generated</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}