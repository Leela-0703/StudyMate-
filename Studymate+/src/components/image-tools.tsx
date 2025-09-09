import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { ThemeToggle } from "./theme-toggle"
import { toast } from "sonner@2.0.3"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Palette, 
  Wand2, 
  Home,
  Eye,
  Trash2,
  Copy,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Filter,
  Sparkles,
  Camera,
  FileImage,
  Layers,
  Type,
  Circle,
  Square,
  Triangle,
  Pencil,
  Eraser
} from "lucide-react"

interface ImageToolsProps {
  onNavigate: (page: string) => void
}

interface GeneratedImage {
  id: string
  prompt: string
  url: string
  style: string
  size: string
  created: string
}

interface AnalyzedImage {
  id: string
  name: string
  url: string
  analysis: {
    description: string
    objects: string[]
    colors: string[]
    text?: string
    confidence: number
  }
  created: string
}

const IMAGE_STYLES = [
  { id: 'realistic', name: 'Realistic', description: 'Photographic style' },
  { id: 'cartoon', name: 'Cartoon', description: 'Animated, colorful style' },
  { id: 'sketch', name: 'Sketch', description: 'Hand-drawn appearance' },
  { id: 'watercolor', name: 'Watercolor', description: 'Artistic painting style' },
  { id: 'digital-art', name: 'Digital Art', description: 'Modern digital illustration' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple design' }
]

const IMAGE_SIZES = [
  { id: '512x512', name: 'Square (512x512)', aspect: '1:1' },
  { id: '768x512', name: 'Landscape (768x512)', aspect: '3:2' },
  { id: '512x768', name: 'Portrait (512x768)', aspect: '2:3' },
  { id: '1024x512', name: 'Wide (1024x512)', aspect: '2:1' }
]

const PRESET_PROMPTS = [
  "A detailed diagram of the human heart with labeled parts",
  "Solar system with planets in correct order and relative sizes",
  "Mathematical graph showing quadratic function",
  "Cross-section of a plant cell with organelles labeled",
  "Timeline infographic of World War II major events",
  "Chemical structure of water molecule H2O",
  "Geometric shapes showing different types of triangles",
  "Food pyramid with healthy eating guidelines"
]

export function ImageTools({ onNavigate }: ImageToolsProps) {
  const [mode, setMode] = useState<'generate' | 'analyze' | 'edit' | 'gallery'>('generate')
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [selectedSize, setSelectedSize] = useState("512x512")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [analyzedImages, setAnalyzedImages] = useState<AnalyzedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load saved data from localStorage
  useEffect(() => {
    const savedGenerated = localStorage.getItem('studymate-generated-images')
    const savedAnalyzed = localStorage.getItem('studymate-analyzed-images')
    
    if (savedGenerated) {
      setGeneratedImages(JSON.parse(savedGenerated))
    }
    if (savedAnalyzed) {
      setAnalyzedImages(JSON.parse(savedAnalyzed))
    }
  }, [])

  // Save to localStorage
  const saveGeneratedImages = (images: GeneratedImage[]) => {
    localStorage.setItem('studymate-generated-images', JSON.stringify(images))
    setGeneratedImages(images)
  }

  const saveAnalyzedImages = (images: AnalyzedImage[]) => {
    localStorage.setItem('studymate-analyzed-images', JSON.stringify(images))
    setAnalyzedImages(images)
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image")
      return
    }

    setIsGenerating(true)
    try {
      // Simulate image generation (in real app, this would call an AI image API)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create mock generated image with placeholder
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        url: `https://picsum.photos/512/512?random=${Date.now()}`, // Placeholder
        style: selectedStyle,
        size: selectedSize,
        created: new Date().toISOString()
      }

      saveGeneratedImages([...generatedImages, newImage])
      toast.success("Image generated successfully!")
      setPrompt("")
    } catch (error) {
      toast.error("Failed to generate image")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setUploadedImage(imageUrl)
      analyzeImage(imageUrl, file.name)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async (imageUrl: string, fileName: string) => {
    setIsAnalyzing(true)
    try {
      // Simulate image analysis (in real app, this would call an AI vision API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create mock analysis
      const mockAnalysis = {
        description: "This image appears to contain educational content with various elements that could be useful for studying.",
        objects: ["text", "diagrams", "illustrations", "charts"],
        colors: ["blue", "white", "gray", "black"],
        text: "Detected text content in the image",
        confidence: 0.85
      }

      const newAnalyzedImage: AnalyzedImage = {
        id: Date.now().toString(),
        name: fileName,
        url: imageUrl,
        analysis: mockAnalysis,
        created: new Date().toISOString()
      }

      saveAnalyzedImages([...analyzedImages, newAnalyzedImage])
      toast.success("Image analyzed successfully!")
      setMode('analyze')
    } catch (error) {
      toast.error("Failed to analyze image")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Image downloaded!")
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const deleteImage = (id: string, type: 'generated' | 'analyzed') => {
    if (type === 'generated') {
      const updated = generatedImages.filter(img => img.id !== id)
      saveGeneratedImages(updated)
    } else {
      const updated = analyzedImages.filter(img => img.id !== id)
      saveAnalyzedImages(updated)
    }
    toast.success("Image deleted")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
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
                <div className="text-2xl">🖼️</div>
                <div>
                  <h1 className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Image Tools
                  </h1>
                  <p className="text-sm text-muted-foreground">Generate, analyze, and edit educational images</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={mode === 'generate' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('generate')}
                  className="rounded-md"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Button
                  variant={mode === 'analyze' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('analyze')}
                  className="rounded-md"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
                <Button
                  variant={mode === 'gallery' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode('gallery')}
                  className="rounded-md"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Gallery
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {mode === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generation Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Image Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[100px] resize-none"
                  />
                  <div className="text-xs text-muted-foreground">
                    {prompt.length}/500 characters
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Educational Prompts</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {PRESET_PROMPTS.map((presetPrompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setPrompt(presetPrompt)}
                        className="justify-start text-left h-auto p-3"
                      >
                        <div className="text-xs line-clamp-2">
                          {presetPrompt}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Style Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Style</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_STYLES.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            <div>
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_SIZES.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            <div>
                              <div className="font-medium">{size.name}</div>
                              <div className="text-xs text-muted-foreground">{size.aspect}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Generating...</p>
                    </div>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={generatedImages[generatedImages.length - 1].url}
                        alt="Generated image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center">
                        Latest Generation
                      </Badge>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {generatedImages[generatedImages.length - 1].prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Preview will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {mode === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <div className="max-w-xs mx-auto">
                        <ImageWithFallback
                          src={uploadedImage}
                          alt="Uploaded image"
                          className="w-full rounded-lg"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Different Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Upload Image to Analyze</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drop an image here or click to browse
                      </p>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {isAnalyzing && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                      <span className="text-sm font-medium">Analyzing image...</span>
                    </div>
                    <Progress value={65} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyzedImages.length > 0 ? (
                  <div className="space-y-4">
                    {analyzedImages.slice(-1).map((image) => (
                      <div key={image.id} className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {image.analysis.description}
                          </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Detected Objects</h4>
                          <div className="flex flex-wrap gap-1">
                            {image.analysis.objects.map((object, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {object}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Dominant Colors</h4>
                          <div className="flex flex-wrap gap-1">
                            {image.analysis.colors.map((color, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {image.analysis.text && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Extracted Text</h4>
                            <p className="text-sm text-muted-foreground font-mono bg-background rounded p-2">
                              {image.analysis.text}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(image.analysis.text!)}
                              className="mt-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Text
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            Confidence: {Math.round(image.analysis.confidence * 100)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(image.created).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload an image to see detailed analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {mode === 'gallery' && (
          <div className="space-y-6">
            <Tabs defaultValue="generated" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generated">Generated Images ({generatedImages.length})</TabsTrigger>
                <TabsTrigger value="analyzed">Analyzed Images ({analyzedImages.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generated" className="space-y-4">
                {generatedImages.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-lg font-medium mb-2">No Generated Images</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first AI-generated image to get started
                      </p>
                      <Button onClick={() => setMode('generate')}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Image
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="aspect-square bg-muted">
                          <ImageWithFallback
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {image.prompt}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {IMAGE_STYLES.find(s => s.id === image.style)?.name}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {image.size}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(image.created).toLocaleDateString()}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadImage(image.url, `generated-${image.id}.png`)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteImage(image.id, 'generated')}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analyzed" className="space-y-4">
                {analyzedImages.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-medium mb-2">No Analyzed Images</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload and analyze your first image to get started
                      </p>
                      <Button onClick={() => setMode('analyze')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Analyze Image
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyzedImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="aspect-square bg-muted">
                          <ImageWithFallback
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-sm mb-2 line-clamp-1">{image.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {image.analysis.description}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {image.analysis.objects.slice(0, 2).map((object, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {object}
                              </Badge>
                            ))}
                            {image.analysis.objects.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{image.analysis.objects.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(image.analysis.confidence * 100)}% confident
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadImage(image.url, image.name)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteImage(image.id, 'analyzed')}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}