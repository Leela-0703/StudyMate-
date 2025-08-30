import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Image, 
  Volume2, 
  Download, 
  Sparkles,
  Play,
  Pause,
  Square,
  Languages
} from 'lucide-react';

interface ImageTextToSpeechProps {
  onNavigate: (page: string) => void;
}

export function ImageTextToSpeech({ onNavigate }: ImageTextToSpeechProps) {
  const [imagePrompt, setImagePrompt] = useState('');
  const [ttsText, setTtsText] = useState('');
  const [ttsLanguage, setTtsLanguage] = useState('en');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' }
  ];

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);
    setImageProgress(0);

    // Simulate image generation progress
    const progressInterval = setInterval(() => {
      setImageProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGeneratingImage(false);
          // Use the Unsplash image we fetched
          setGeneratedImage("https://images.unsplash.com/photo-1677212004257-103cfa6b59d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwQUklMjBhc3Npc3RhbnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjUyNzczOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const generateAudio = async () => {
    if (!ttsText.trim()) return;

    setIsGeneratingAudio(true);
    
    // Simulate audio generation
    setTimeout(() => {
      setIsGeneratingAudio(false);
    }, 2000);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Simulate audio playback progress
      setAudioProgress(0);
      const playInterval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(playInterval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
      {/* Header */}
      <header className="p-6 border-b" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('dashboard')}
            className="rounded-xl"
            style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>
            Image Generation & Text-to-Speech
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--light-text)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dark-text)' }}>
              <Sparkles size={24} />
              AI-Powered Content Creation
            </CardTitle>
            <CardDescription style={{ color: 'var(--dark-text)', opacity: 0.8 }}>
              Generate images from text descriptions and convert text to natural-sounding speech.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="image" className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 rounded-xl"
                style={{ backgroundColor: 'var(--pastel-beige)' }}
              >
                <TabsTrigger 
                  value="image" 
                  className="rounded-xl data-[state=active]:bg-[var(--pastel-turquoise)] data-[state=active]:text-[var(--dark-text)]"
                >
                  <Image size={16} className="mr-2" />
                  Image Generation
                </TabsTrigger>
                <TabsTrigger 
                  value="tts" 
                  className="rounded-xl data-[state=active]:bg-[var(--pastel-turquoise)] data-[state=active]:text-[var(--dark-text)]"
                >
                  <Volume2 size={16} className="mr-2" />
                  Text-to-Speech
                </TabsTrigger>
              </TabsList>

              {/* Image Generation Tab */}
              <TabsContent value="image" className="space-y-6">
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--pastel-turquoise)' }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base mb-3 block" style={{ color: 'var(--dark-text)' }}>
                        Describe the image you want to generate
                      </Label>
                      <Textarea
                        placeholder="e.g., A futuristic classroom with students learning through holographic displays, digital art style..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="rounded-xl border-2 min-h-[100px]"
                        style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}
                      />
                    </div>

                    <Button 
                      onClick={generateImage}
                      disabled={!imagePrompt.trim() || isGeneratingImage}
                      className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105"
                      style={{ 
                        backgroundColor: 'var(--pastel-pink)', 
                        color: 'var(--dark-text)',
                        border: 'none'
                      }}
                    >
                      <Sparkles size={16} className="mr-2" />
                      {isGeneratingImage ? 'Generating Image...' : 'Generate Image'}
                    </Button>

                    {isGeneratingImage && (
                      <div className="space-y-2">
                        <Progress 
                          value={imageProgress} 
                          className="w-full"
                          style={{ backgroundColor: 'var(--pastel-beige)' }}
                        />
                        <p className="text-sm text-center" style={{ color: 'var(--dark-text)', opacity: 0.7 }}>
                          {imageProgress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {generatedImage && (
                  <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-beige)' }}>
                    <CardHeader>
                      <CardTitle style={{ color: 'var(--dark-text)' }}>Generated Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <ImageWithFallback
                          src={generatedImage}
                          alt="Generated AI image"
                          className="w-full h-64 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 rounded-xl"
                          style={{ 
                            backgroundColor: 'var(--pastel-teal)', 
                            color: 'var(--dark-text)',
                            border: 'none'
                          }}
                        >
                          <Download size={16} className="mr-2" />
                          Download PNG
                        </Button>
                        <Button 
                          className="flex-1 rounded-xl"
                          style={{ 
                            backgroundColor: 'var(--pastel-lilac)', 
                            color: 'var(--dark-text)',
                            border: 'none'
                          }}
                        >
                          <Download size={16} className="mr-2" />
                          Download JPG
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Text-to-Speech Tab */}
              <TabsContent value="tts" className="space-y-6">
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--pastel-turquoise)' }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base mb-3 block" style={{ color: 'var(--dark-text)' }}>
                        Enter text to convert to speech
                      </Label>
                      <Textarea
                        placeholder="Enter the text you want to convert to speech..."
                        value={ttsText}
                        onChange={(e) => setTtsText(e.target.value)}
                        className="rounded-xl border-2 min-h-[120px]"
                        style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}
                      />
                    </div>

                    <div>
                      <Label className="text-base mb-3 block" style={{ color: 'var(--dark-text)' }}>
                        Select Language
                      </Label>
                      <Select value={ttsLanguage} onValueChange={setTtsLanguage}>
                        <SelectTrigger 
                          className="rounded-xl" 
                          style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              <div className="flex items-center gap-2">
                                <Languages size={16} />
                                {lang.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={generateAudio}
                      disabled={!ttsText.trim() || isGeneratingAudio}
                      className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105"
                      style={{ 
                        backgroundColor: 'var(--pastel-pink)', 
                        color: 'var(--dark-text)',
                        border: 'none'
                      }}
                    >
                      <Volume2 size={16} className="mr-2" />
                      {isGeneratingAudio ? 'Generating Audio...' : 'Generate Audio'}
                    </Button>
                  </div>
                </div>

                {/* Audio Player */}
                {!isGeneratingAudio && ttsText && (
                  <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-beige)' }}>
                    <CardHeader>
                      <CardTitle style={{ color: 'var(--dark-text)' }}>Audio Player</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div 
                        className="p-6 rounded-xl text-center"
                        style={{ backgroundColor: 'var(--light-text)' }}
                      >
                        <Volume2 size={48} className="mx-auto mb-4" style={{ color: 'var(--pastel-teal)' }} />
                        <p className="text-sm mb-4" style={{ color: 'var(--dark-text)', opacity: 0.7 }}>
                          {languages.find(l => l.value === ttsLanguage)?.label} Audio
                        </p>
                        
                        <div className="space-y-4">
                          <Progress 
                            value={audioProgress} 
                            className="w-full"
                            style={{ backgroundColor: 'var(--pastel-beige)' }}
                          />
                          
                          <div className="flex justify-center gap-2">
                            <Button 
                              onClick={togglePlayback}
                              className="rounded-xl"
                              style={{ 
                                backgroundColor: 'var(--pastel-teal)', 
                                color: 'var(--dark-text)',
                                border: 'none'
                              }}
                            >
                              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </Button>
                            <Button 
                              onClick={stopPlayback}
                              variant="outline"
                              className="rounded-xl"
                              style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
                            >
                              <Square size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full rounded-xl"
                        style={{ 
                          backgroundColor: 'var(--pastel-lilac)', 
                          color: 'var(--dark-text)',
                          border: 'none'
                        }}
                      >
                        <Download size={16} className="mr-2" />
                        Download Audio (MP3)
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--pastel-pink)' }}>
            <CardContent className="p-6">
              <Image size={32} className="mx-auto mb-3" style={{ color: 'var(--dark-text)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>AI Image Generation</h3>
              <p className="text-sm opacity-80" style={{ color: 'var(--dark-text)' }}>
                Create stunning visuals from detailed text descriptions using advanced AI models
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--pastel-teal)' }}>
            <CardContent className="p-6">
              <Volume2 size={32} className="mx-auto mb-3" style={{ color: 'var(--dark-text)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>Multi-Language TTS</h3>
              <p className="text-sm opacity-80" style={{ color: 'var(--dark-text)' }}>
                Convert text to natural speech in multiple languages with high-quality voices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}