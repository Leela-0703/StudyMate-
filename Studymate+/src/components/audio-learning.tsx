import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Progress } from "./ui/progress"
import { ThemeToggle } from "./theme-toggle"
import { toast } from "sonner@2.0.3"
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Volume2, 
  VolumeX, 
  Home,
  Mic,
  FileText,
  Headphones,
  Settings,
  RotateCcw,
  FastForward,
  Rewind,
  BookOpen,
  Music,
  Podcast
} from "lucide-react"

interface AudioLearningProps {
  onNavigate: (page: string) => void
}

interface AudioNote {
  id: string
  title: string
  content: string
  duration: number
  voice: string
  speed: number
  created: string
}

const VOICES = [
  { id: 'alloy', name: 'Alloy (Neutral)', gender: 'neutral' },
  { id: 'echo', name: 'Echo (Male)', gender: 'male' },
  { id: 'fable', name: 'Fable (British Male)', gender: 'male' },
  { id: 'onyx', name: 'Onyx (Deep Male)', gender: 'male' },
  { id: 'nova', name: 'Nova (Female)', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer (Soft Female)', gender: 'female' }
]

const SPEED_OPTIONS = [
  { value: 0.25, label: '0.25x (Very Slow)' },
  { value: 0.5, label: '0.5x (Slow)' },
  { value: 0.75, label: '0.75x (Slower)' },
  { value: 1, label: '1x (Normal)' },
  { value: 1.25, label: '1.25x (Faster)' },
  { value: 1.5, label: '1.5x (Fast)' },
  { value: 2, label: '2x (Very Fast)' }
]

const PRESET_TOPICS = [
  {
    title: "Physics: Newton's Laws",
    content: "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This is also known as the law of inertia. Newton's Second Law explains that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is F equals M times A. Newton's Third Law states that for every action, there is an equal and opposite reaction."
  },
  {
    title: "Biology: Photosynthesis",
    content: "Photosynthesis is the process by which plants and other organisms use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. This process occurs in the chloroplasts of plant cells, specifically in structures called thylakoids. The overall equation for photosynthesis is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. The process consists of two main stages: the light-dependent reactions and the Calvin cycle."
  },
  {
    title: "History: World War II Timeline",
    content: "World War II began on September 1, 1939, when Germany invaded Poland. Key events include the Battle of Britain in 1940, the attack on Pearl Harbor on December 7, 1941, which brought the United States into the war. The Battle of Stalingrad from 1942 to 1943 marked a turning point on the Eastern Front. D-Day occurred on June 6, 1944, when Allied forces landed in Normandy. The war in Europe ended on May 8, 1945, with Germany's surrender, and the Pacific war ended on September 2, 1945, after the atomic bombings of Hiroshima and Nagasaki."
  }
]

export function AudioLearning({ onNavigate }: AudioLearningProps) {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("alloy")
  const [speed, setSpeed] = useState([1])
  const [volume, setVolume] = useState([80])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioNotes, setAudioNotes] = useState<AudioNote[]>([])
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [isMuted, setIsMuted] = useState(false)
  const [mode, setMode] = useState<'create' | 'library'>('create')

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved audio notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studymate-audio-notes')
    if (saved) {
      setAudioNotes(JSON.parse(saved))
    }
  }, [])

  // Save audio notes to localStorage
  const saveAudioNotes = (notes: AudioNote[]) => {
    localStorage.setItem('studymate-audio-notes', JSON.stringify(notes))
    setAudioNotes(notes)
  }

  // Audio time update
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', updateTime)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', updateTime)
    }
  }, [currentAudio])

  const generateAudio = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to convert to audio")
      return
    }

    setIsLoading(true)
    try {
      // Simulate audio generation (in real app, this would call TTS API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a mock audio note
      const newNote: AudioNote = {
        id: Date.now().toString(),
        title: title || `Audio Note ${audioNotes.length + 1}`,
        content,
        duration: Math.floor(content.length / 10), // Rough estimate
        voice: selectedVoice,
        speed: speed[0],
        created: new Date().toISOString()
      }

      saveAudioNotes([...audioNotes, newNote])
      toast.success("Audio generated successfully!")
      
      // Clear form
      setContent("")
      setTitle("")
    } catch (error) {
      toast.error("Failed to generate audio")
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = async (audioUrl?: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          toast.error("Failed to play audio")
        }
      }
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  const seekAudio = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const deleteAudioNote = (id: string) => {
    const updatedNotes = audioNotes.filter(note => note.id !== id)
    saveAudioNotes(updatedNotes)
    toast.success("Audio note deleted")
  }

  const loadPresetTopic = (topic: typeof PRESET_TOPICS[0]) => {
    setTitle(topic.title)
    setContent(topic.content)
    toast.success("Topic loaded!")
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const exportAudioLibrary = () => {
    const data = {
      audioNotes,
      exported: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'studymate-audio-library.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Audio library exported!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 dark:from-blue-950 dark:via-teal-950 dark:to-purple-950">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="text-2xl">🎧</div>
                <div>
                  <h1 className="text-xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Audio Learning
                  </h1>
                  <p className="text-sm text-muted-foreground">Convert text to engaging audio content</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={mode === 'create' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('create')}
                  className="rounded-md"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button
                  variant={mode === 'library' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('library')}
                  className="rounded-md"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Library
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {mode === 'create' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Input */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter audio title..."
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter text to convert to audio..."
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{content.length} characters</span>
                    <span>~{Math.ceil(content.length / 10)} seconds</span>
                  </div>
                </div>

                {/* Quick Topics */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Start Topics</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {PRESET_TOPICS.map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadPresetTopic(topic)}
                        className="justify-start text-left h-auto p-3"
                      >
                        <div>
                          <div className="font-medium text-xs">{topic.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {topic.content.substring(0, 50)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateAudio}
                  disabled={isLoading || !content.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Audio...
                    </>
                  ) : (
                    <>
                      <Music className="h-4 w-4 mr-2" />
                      Generate Audio
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Audio Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICES.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                voice.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                                voice.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {voice.gender}
                            </Badge>
                            {voice.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Speed: {speed[0]}x
                  </label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.25}
                    max={2}
                    step={0.25}
                    className="w-full"
                  />
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Volume: {volume[0]}%
                  </label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Audio Player */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audio Player</span>
                    <Badge variant="secondary">
                      {audioNotes.length} notes
                    </Badge>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={skipBackward}
                        disabled={!currentAudio}
                      >
                        <Rewind className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => playAudio()}
                        disabled={!currentAudio}
                        className="rounded-full w-12 h-12"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={skipForward}
                        disabled={!currentAudio}
                      >
                        <FastForward className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <Progress value={duration ? (currentTime / duration) * 100 : 0} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Select 
                        value={playbackSpeed[0].toString()} 
                        onValueChange={(value) => {
                          setPlaybackSpeed([parseFloat(value)])
                          if (audioRef.current) {
                            audioRef.current.playbackRate = parseFloat(value)
                          }
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SPEED_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Audio Library */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium">Audio Library</h2>
                <p className="text-muted-foreground">Your generated audio notes</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={exportAudioLibrary}
                  variant="outline"
                  disabled={audioNotes.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Library
                </Button>
              </div>
            </div>

            {audioNotes.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-lg font-medium mb-2">No Audio Notes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first audio note to get started
                  </p>
                  <Button onClick={() => setMode('create')}>
                    <Mic className="h-4 w-4 mr-2" />
                    Create Audio Note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {audioNotes.map((note) => (
                  <Card key={note.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {formatTime(note.duration)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {VOICES.find(v => v.id === note.voice)?.name.split(' ')[0] || note.voice}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteAudioNote(note.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.created).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        className="hidden"
        onLoadedMetadata={() => setCurrentAudio(audioRef.current)}
      />
    </div>
  )
}