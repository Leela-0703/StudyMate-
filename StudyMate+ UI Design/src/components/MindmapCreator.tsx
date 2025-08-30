import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Network, 
  Download, 
  Sparkles,
  FileText,
  Plus,
  Minus
} from 'lucide-react';

interface MindmapCreatorProps {
  onNavigate: (page: string) => void;
}

interface MindmapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number;
  color: string;
  children: string[];
}

export function MindmapCreator({ onNavigate }: MindmapCreatorProps) {
  const [topic, setTopic] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [mindmap, setMindmap] = useState<MindmapNode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const documents = [
    'Biology Chapter 5 - Cell Division',
    'History - World War II Overview',
    'Physics - Quantum Mechanics Basics',
    'Chemistry - Organic Compounds'
  ];

  const nodeColors = [
    'var(--pastel-pink)',
    'var(--pastel-lilac)',
    'var(--pastel-teal)',
    'var(--pastel-turquoise)',
    'var(--pastel-beige)'
  ];

  const generateMindmap = async () => {
    if (!topic && !selectedDocument) return;

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockMindmap = generateMockMindmap(topic || selectedDocument);
      setMindmap(mockMindmap);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockMindmap = (mainTopic: string): MindmapNode[] => {
    const nodes: MindmapNode[] = [];
    
    // Central node
    nodes.push({
      id: 'central',
      label: mainTopic.includes('Cell Division') ? 'Cell Division' : 'AI & Machine Learning',
      x: 400,
      y: 300,
      level: 0,
      color: nodeColors[0],
      children: ['branch1', 'branch2', 'branch3', 'branch4']
    });

    if (mainTopic.includes('Cell Division')) {
      // Biology mindmap
      const branches = [
        { id: 'branch1', label: 'Mitosis', x: 250, y: 150, children: ['mitosis1', 'mitosis2'] },
        { id: 'branch2', label: 'Meiosis', x: 550, y: 150, children: ['meiosis1', 'meiosis2'] },
        { id: 'branch3', label: 'Cell Cycle', x: 250, y: 450, children: ['cycle1', 'cycle2'] },
        { id: 'branch4', label: 'Checkpoints', x: 550, y: 450, children: ['check1', 'check2'] }
      ];

      const subNodes = [
        { id: 'mitosis1', label: 'Prophase', x: 150, y: 100 },
        { id: 'mitosis2', label: 'Metaphase', x: 200, y: 80 },
        { id: 'meiosis1', label: 'Crossing Over', x: 650, y: 100 },
        { id: 'meiosis2', label: 'Reduction Division', x: 600, y: 80 },
        { id: 'cycle1', label: 'G1 Phase', x: 150, y: 500 },
        { id: 'cycle2', label: 'S Phase', x: 200, y: 520 },
        { id: 'check1', label: 'G1/S Checkpoint', x: 650, y: 500 },
        { id: 'check2', label: 'G2/M Checkpoint', x: 600, y: 520 }
      ];

      branches.forEach((branch, index) => {
        nodes.push({
          ...branch,
          level: 1,
          color: nodeColors[index + 1],
          children: branch.children
        });
      });

      subNodes.forEach((node, index) => {
        nodes.push({
          ...node,
          level: 2,
          color: nodeColors[(index % 3) + 2],
          children: []
        });
      });
    } else {
      // AI & ML mindmap
      const branches = [
        { id: 'branch1', label: 'Machine Learning', x: 250, y: 150, children: ['ml1', 'ml2'] },
        { id: 'branch2', label: 'Deep Learning', x: 550, y: 150, children: ['dl1', 'dl2'] },
        { id: 'branch3', label: 'Applications', x: 250, y: 450, children: ['app1', 'app2'] },
        { id: 'branch4', label: 'Ethics', x: 550, y: 450, children: ['eth1', 'eth2'] }
      ];

      const subNodes = [
        { id: 'ml1', label: 'Supervised', x: 150, y: 100 },
        { id: 'ml2', label: 'Unsupervised', x: 200, y: 80 },
        { id: 'dl1', label: 'Neural Networks', x: 650, y: 100 },
        { id: 'dl2', label: 'CNNs', x: 600, y: 80 },
        { id: 'app1', label: 'Healthcare', x: 150, y: 500 },
        { id: 'app2', label: 'Finance', x: 200, y: 520 },
        { id: 'eth1', label: 'Bias', x: 650, y: 500 },
        { id: 'eth2', label: 'Privacy', x: 600, y: 520 }
      ];

      branches.forEach((branch, index) => {
        nodes.push({
          ...branch,
          level: 1,
          color: nodeColors[index + 1],
          children: branch.children
        });
      });

      subNodes.forEach((node, index) => {
        nodes.push({
          ...node,
          level: 2,
          color: nodeColors[(index % 3) + 2],
          children: []
        });
      });
    }

    return nodes;
  };

  const resetMindmap = () => {
    setMindmap([]);
    setTopic('');
    setSelectedDocument('');
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    mindmap.forEach(node => {
      node.children.forEach(childId => {
        const childNode = mindmap.find(n => n.id === childId);
        if (childNode) {
          connections.push(
            <line
              key={`${node.id}-${childId}`}
              x1={node.x}
              y1={node.y}
              x2={childNode.x}
              y2={childNode.y}
              stroke="var(--pastel-lilac)"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        }
      });
    });

    return connections;
  };

  if (mindmap.length > 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
        <header className="p-6 border-b" style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-lilac)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={resetMindmap}
                className="rounded-xl"
                style={{ borderColor: 'var(--pastel-lilac)', color: 'var(--dark-text)' }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Create New
              </Button>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>Mindmap Viewer</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                className="rounded-xl"
                style={{ 
                  backgroundColor: 'var(--pastel-pink)', 
                  color: 'var(--dark-text)',
                  border: 'none'
                }}
              >
                <Download size={16} className="mr-2" />
                PNG
              </Button>
              <Button 
                className="rounded-xl"
                style={{ 
                  backgroundColor: 'var(--pastel-teal)', 
                  color: 'var(--dark-text)',
                  border: 'none'
                }}
              >
                <Download size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6">
          <Card 
            className="border-0 shadow-lg overflow-hidden"
            style={{ backgroundColor: 'var(--light-text)' }}
          >
            <CardHeader>
              <CardTitle style={{ color: 'var(--dark-text)' }}>Interactive Mindmap</CardTitle>
              <CardDescription style={{ color: 'var(--dark-text)' }}>
                Hover over nodes to see connections. Click and drag to explore the mindmap.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[600px] overflow-hidden" style={{ backgroundColor: 'var(--pastel-lilac)', opacity: 0.1 }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="absolute inset-0"
                >
                  {/* Render connections */}
                  {renderConnections()}
                  
                  {/* Render nodes */}
                  {mindmap.map(node => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.level === 0 ? 50 : node.level === 1 ? 35 : 25}
                        fill={node.color}
                        stroke="var(--dark-text)"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        style={{
                          filter: hoveredNode === node.id ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                          transform: hoveredNode === node.id ? 'scale(1.1)' : 'scale(1)',
                          transformOrigin: `${node.x}px ${node.y}px`
                        }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="var(--dark-text)"
                        className="pointer-events-none select-none"
                        style={{
                          fontSize: node.level === 0 ? '14px' : node.level === 1 ? '12px' : '10px',
                          fontWeight: node.level === 0 ? 'bold' : 'normal'
                        }}
                      >
                        {node.label.length > 12 ? `${node.label.substring(0, 12)}...` : node.label}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Tooltip for hovered node */}
                {hoveredNode && (
                  <div 
                    className="absolute bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10"
                    style={{
                      left: (mindmap.find(n => n.id === hoveredNode)?.x || 0) + 'px',
                      top: (mindmap.find(n => n.id === hoveredNode)?.y || 0) - 60 + 'px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {mindmap.find(n => n.id === hoveredNode)?.label}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <Button 
              variant="outline"
              className="rounded-xl"
              style={{ borderColor: 'var(--pastel-teal)', color: 'var(--dark-text)' }}
            >
              <Plus size={16} className="mr-2" />
              Zoom In
            </Button>
            <Button 
              variant="outline"
              className="rounded-xl"
              style={{ borderColor: 'var(--pastel-teal)', color: 'var(--dark-text)' }}
            >
              <Minus size={16} className="mr-2" />
              Zoom Out
            </Button>
            <Button 
              onClick={resetMindmap}
              className="rounded-xl"
              style={{ 
                backgroundColor: 'var(--pastel-turquoise)', 
                color: 'var(--dark-text)',
                border: 'none'
              }}
            >
              Create New Mindmap
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--pastel-beige)' }}>
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-text)' }}>Mindmap & Diagram Creator</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--pastel-lilac)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--dark-text)' }}>
              <Network size={24} />
              Create Visual Mindmap
            </CardTitle>
            <CardDescription style={{ color: 'var(--dark-text)', opacity: 0.8 }}>
              Generate interactive mindmaps from topics or existing documents to visualize concepts and relationships.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base mb-3 block" style={{ color: 'var(--dark-text)' }}>
                  Enter Topic
                </Label>
                <Input
                  placeholder="e.g., Artificial Intelligence, Photosynthesis..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="rounded-xl border-2"
                  style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-teal)' }}
                />
              </div>

              <div>
                <Label className="text-base mb-3 block" style={{ color: 'var(--dark-text)' }}>
                  Or Select Document
                </Label>
                <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                  <SelectTrigger 
                    className="rounded-xl" 
                    style={{ backgroundColor: 'var(--light-text)', borderColor: 'var(--pastel-teal)' }}
                  >
                    <SelectValue placeholder="Choose from your documents" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc, index) => (
                      <SelectItem key={index} value={doc}>
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          {doc}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark-text)' }}>
                Enter a topic OR select a document to generate a mindmap
              </p>
            </div>

            <Button 
              onClick={generateMindmap}
              disabled={(!topic && !selectedDocument) || isGenerating}
              className="w-full rounded-xl py-6 transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--pastel-teal)', 
                color: 'var(--dark-text)',
                border: 'none'
              }}
            >
              <Sparkles size={16} className="mr-2" />
              {isGenerating ? 'Generating Mindmap...' : 'Generate Mindmap'}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--pastel-pink)' }}>
            <CardContent className="p-6">
              <Network size={32} className="mx-auto mb-3" style={{ color: 'var(--dark-text)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>Interactive Nodes</h3>
              <p className="text-sm opacity-80" style={{ color: 'var(--dark-text)' }}>
                Hover over nodes to see connections and relationships
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--pastel-turquoise)' }}>
            <CardContent className="p-6">
              <Download size={32} className="mx-auto mb-3" style={{ color: 'var(--dark-text)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>Export Options</h3>
              <p className="text-sm opacity-80" style={{ color: 'var(--dark-text)' }}>
                Download as PNG or PDF for presentations
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--pastel-teal)' }}>
            <CardContent className="p-6">
              <Sparkles size={32} className="mx-auto mb-3" style={{ color: 'var(--dark-text)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>AI-Powered</h3>
              <p className="text-sm opacity-80" style={{ color: 'var(--dark-text)' }}>
                Automatically generates relevant concepts and connections
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}