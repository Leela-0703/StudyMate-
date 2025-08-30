import { useState } from 'react';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { DocumentUpload } from './components/DocumentUpload';
import { QuizGenerator } from './components/QuizGenerator';
import { MindmapCreator } from './components/MindmapCreator';
import { ImageTextToSpeech } from './components/ImageTextToSpeech';

type Page = 'home' | 'dashboard' | 'upload' | 'quiz' | 'mindmap' | 'image-tts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<string | null>(null);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const login = (email: string) => {
    setUser(email);
    navigate('dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onLogin={login} onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={navigate} onLogout={logout} />;
      case 'upload':
        return <DocumentUpload onNavigate={navigate} />;
      case 'quiz':
        return <QuizGenerator onNavigate={navigate} />;
      case 'mindmap':
        return <MindmapCreator onNavigate={navigate} />;
      case 'image-tts':
        return <ImageTextToSpeech onNavigate={navigate} />;
      default:
        return <Home onLogin={login} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
      {renderPage()}
    </div>
  );
}