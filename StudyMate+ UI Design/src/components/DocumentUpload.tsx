import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Upload, 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle,
  Languages,
  File
} from 'lucide-react';

interface DocumentUploadProps {
  onNavigate: (page: string) => void;
}

export function DocumentUpload({ onNavigate }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [summaryType, setSummaryType] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessDocument = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          setResult(generateMockSummary(summaryType));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const generateMockSummary = (type: string) => {
    const summaries = {
      concise: "This document discusses the fundamentals of artificial intelligence and machine learning. Key points include supervised learning algorithms, neural networks, and their applications in modern technology.",
      medium: "This document provides a comprehensive overview of artificial intelligence and machine learning technologies. It covers the fundamental concepts of supervised and unsupervised learning, the architecture and functionality of neural networks, and their practical applications across various industries. The text also explores the potential future developments in AI and the ethical considerations surrounding its implementation in society.",
      detailed: "This document offers an extensive examination of artificial intelligence and machine learning, beginning with foundational concepts and progressing to advanced applications. The text thoroughly explains supervised learning methodologies, including regression and classification algorithms, while also covering unsupervised learning techniques such as clustering and dimensionality reduction. Neural networks are explored in detail, from basic perceptrons to complex deep learning architectures including convolutional and recurrent neural networks. The document also addresses practical implementations across healthcare, finance, transportation, and other sectors, while discussing important ethical considerations, bias mitigation strategies, and the societal impact of AI adoption. Future trends and emerging technologies in the field are also comprehensively covered."
    };
    return summaries[type as keyof typeof summaries] || summaries.medium;
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setIsProcessing(false);
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
            Document Upload & Summarize
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {!result ? (
          <>
            {/* Upload Section */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-turquoise)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dark-text)' }}>
                  <Upload size={24} />
                  Upload Your Document
                </CardTitle>
                <CardDescription style={{ color: 'var(--dark-text)', opacity: 0.8 }}>
                  Drag and drop your file or click to select. Supports PDF, DOC, DOCX, and TXT files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                    dragActive ? 'border-solid scale-105' : ''
                  }`}
                  style={{ 
                    borderColor: dragActive ? 'var(--pastel-pink)' : 'var(--pastel-lilac)',
                    backgroundColor: dragActive ? 'var(--pastel-beige)' : 'var(--light-text)'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <File size={32} style={{ color: 'var(--pastel-teal)' }} />
                        <div>
                          <p className="font-medium" style={{ color: 'var(--dark-text)' }}>
                            {file.name}
                          </p>
                          <p className="text-sm opacity-70" style={{ color: 'var(--dark-text)' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={resetForm}
                        style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload size={48} className="mx-auto" style={{ color: 'var(--pastel-teal)' }} />
                      <div>
                        <p className="text-lg font-medium mb-2" style={{ color: 'var(--dark-text)' }}>
                          Drop your file here
                        </p>
                        <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark-text)' }}>
                          or click to browse
                        </p>
                        <Button 
                          className="rounded-xl"
                          style={{ 
                            backgroundColor: 'var(--pastel-pink)', 
                            color: 'var(--dark-text)',
                            border: 'none'
                          }}
                          onClick={() => document.getElementById('file-input')?.click()}
                        >
                          Select File
                        </Button>
                        <input
                          id="file-input"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary Options */}
            {file && (
              <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--light-text)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--dark-text)' }}>Summary Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base mb-4 block" style={{ color: 'var(--dark-text)' }}>
                      Summary Type
                    </Label>
                    <RadioGroup value={summaryType} onValueChange={setSummaryType} className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="concise" id="concise" />
                        <Label htmlFor="concise" style={{ color: 'var(--dark-text)' }}>Concise</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" style={{ color: 'var(--dark-text)' }}>Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed" style={{ color: 'var(--dark-text)' }}>Detailed</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    onClick={handleProcessDocument}
                    disabled={isProcessing}
                    className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: 'var(--pastel-teal)', 
                      color: 'var(--dark-text)',
                      border: 'none'
                    }}
                  >
                    {isProcessing ? 'Processing Document...' : 'Generate Summary'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Processing Progress */}
            {isProcessing && (
              <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--light-text)' }}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText size={20} style={{ color: 'var(--pastel-teal)' }} />
                      <span style={{ color: 'var(--dark-text)' }}>Processing your document...</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="w-full"
                      style={{ backgroundColor: 'var(--pastel-beige)' }}
                    />
                    <p className="text-sm opacity-70 text-center" style={{ color: 'var(--dark-text)' }}>
                      {progress}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Result Section */
          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--light-text)' }}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={24} style={{ color: 'var(--pastel-teal)' }} />
                <CardTitle style={{ color: 'var(--dark-text)' }}>Summary Generated</CardTitle>
              </div>
              <CardDescription style={{ color: 'var(--dark-text)' }}>
                Your document has been successfully processed. Here's your {summaryType} summary:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="p-6 rounded-xl"
                style={{ backgroundColor: 'var(--pastel-beige)' }}
              >
                <p style={{ color: 'var(--dark-text)', lineHeight: '1.8' }}>
                  {result}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Select>
                  <SelectTrigger className="rounded-xl" style={{ borderColor: 'var(--pastel-lilac)' }}>
                    <SelectValue placeholder="Translate to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 sm:ml-auto">
                  <Button 
                    variant="outline"
                    className="rounded-xl"
                    style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
                  >
                    <Languages size={16} className="mr-2" />
                    Translate
                  </Button>
                  <Button 
                    className="rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--pastel-pink)', 
                      color: 'var(--dark-text)',
                      border: 'none'
                    }}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Button 
                variant="outline"
                onClick={resetForm}
                className="w-full rounded-xl"
                style={{ borderColor: 'var(--pastel-teal)', color: 'var(--dark-text)' }}
              >
                Process Another Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}