import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ThemeToggle } from "./theme-toggle"
import { toast } from "sonner@2.0.3"
import { 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Home, 
  Move, 
  Palette,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

interface MindMapNode {
  id: string
  text: string
  x: number
  y: number
  color: string
  size: 'small' | 'medium' | 'large'
  parentId?: string
  children: string[]
}

interface Connection {
  fromId: string
  toId: string
}

const PASTEL_COLORS = [
  '#ffd6e7', // pastel pink
  '#a2f0f7', // pastel teal
  '#d2a2f7', // pastel lilac
  '#f5f0e8', // pastel beige
  '#7dd3fc', // pastel turquoise
  '#a7f3d0', // pastel mint
  '#fed7aa', // pastel peach
  '#e0e7ff', // pastel lavender
]

const NODE_SIZES = {
  small: { width: 120, height: 60, fontSize: 12 },
  medium: { width: 160, height: 80, fontSize: 14 },
  large: { width: 200, height: 100, fontSize: 16 }
}

interface MindMapGeneratorProps {
  onNavigate: (page: string) => void
}

export function MindMapGenerator({ onNavigate }: MindMapGeneratorProps) {
  const [nodes, setNodes] = useState<MindMapNode[]>([
    {
      id: '1',
      text: 'Main Topic',
      x: 400,
      y: 300,
      color: PASTEL_COLORS[0],
      size: 'large',
      children: []
    }
  ])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showConnections, setShowConnections] = useState(true)
  const [mindMapTitle, setMindMapTitle] = useState('My Mind Map')
  
  const svgRef = useRef<SVGSVGElement>(null)
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 })

  // Update SVG dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          setSvgDimensions({
            width: container.clientWidth,
            height: container.clientHeight
          })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const addNode = useCallback((parentId?: string) => {
    const parentNode = parentId ? nodes.find(n => n.id === parentId) : null
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: 'New Node',
      x: parentNode ? parentNode.x + 200 : Math.random() * (svgDimensions.width - 200) + 100,
      y: parentNode ? parentNode.y + 150 : Math.random() * (svgDimensions.height - 200) + 100,
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      size: parentNode ? 'medium' : 'large',
      parentId,
      children: []
    }

    setNodes(prev => {
      const updated = [...prev, newNode]
      if (parentNode) {
        const parentIndex = updated.findIndex(n => n.id === parentId)
        if (parentIndex !== -1) {
          updated[parentIndex] = {
            ...updated[parentIndex],
            children: [...updated[parentIndex].children, newNode.id]
          }
        }
      }
      return updated
    })

    if (parentId) {
      setConnections(prev => [...prev, { fromId: parentId, toId: newNode.id }])
    }

    toast.success('Node added successfully!')
  }, [nodes, svgDimensions])

  const deleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId)
    if (!nodeToDelete) return

    // Remove all connections involving this node
    setConnections(prev => prev.filter(c => c.fromId !== nodeId && c.toId !== nodeId))
    
    // Remove the node and its children recursively
    const removeNodeAndChildren = (id: string, nodeList: MindMapNode[]): MindMapNode[] => {
      const node = nodeList.find(n => n.id === id)
      if (!node) return nodeList
      
      let updatedList = nodeList.filter(n => n.id !== id)
      
      // Remove children recursively
      node.children.forEach(childId => {
        updatedList = removeNodeAndChildren(childId, updatedList)
      })
      
      return updatedList
    }

    setNodes(prev => {
      let updated = removeNodeAndChildren(nodeId, prev)
      
      // Update parent's children array
      if (nodeToDelete.parentId) {
        const parentIndex = updated.findIndex(n => n.id === nodeToDelete.parentId)
        if (parentIndex !== -1) {
          updated[parentIndex] = {
            ...updated[parentIndex],
            children: updated[parentIndex].children.filter(id => id !== nodeId)
          }
        }
      }
      
      return updated
    })

    setSelectedNodeId(null)
    toast.success('Node deleted successfully!')
  }, [nodes])

  const updateNode = useCallback((nodeId: string, updates: Partial<MindMapNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    const svgRect = svgRef.current?.getBoundingClientRect()
    if (!svgRect) return

    setDraggedNodeId(nodeId)
    setSelectedNodeId(nodeId)
    setDragOffset({
      x: e.clientX - svgRect.left - node.x,
      y: e.clientY - svgRect.top - node.y
    })
  }, [nodes])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedNodeId || !svgRef.current) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const newX = e.clientX - svgRect.left - dragOffset.x
    const newY = e.clientY - svgRect.top - dragOffset.y

    updateNode(draggedNodeId, { x: newX, y: newY })
  }, [draggedNodeId, dragOffset, updateNode])

  const handleMouseUp = useCallback(() => {
    setDraggedNodeId(null)
    setDragOffset({ x: 0, y: 0 })
  }, [])

  const startEditing = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      setEditingNodeId(nodeId)
      setEditText(node.text)
    }
  }, [nodes])

  const finishEditing = useCallback(() => {
    if (editingNodeId) {
      updateNode(editingNodeId, { text: editText })
      setEditingNodeId(null)
      setEditText('')
      toast.success('Node updated!')
    }
  }, [editingNodeId, editText, updateNode])

  const exportMindMap = useCallback(() => {
    const mindMapData = {
      title: mindMapTitle,
      nodes,
      connections,
      created: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(mindMapData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mindMapTitle.replace(/[^a-zA-Z0-9]/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Mind map exported successfully!')
  }, [nodes, connections, mindMapTitle])

  const clearMindMap = useCallback(() => {
    setNodes([{
      id: '1',
      text: 'Main Topic',
      x: 400,
      y: 300,
      color: PASTEL_COLORS[0],
      size: 'large',
      children: []
    }])
    setConnections([])
    setSelectedNodeId(null)
    setMindMapTitle('My Mind Map')
    toast.success('Mind map cleared!')
  }, [])

  const renderConnection = useCallback((connection: Connection) => {
    const fromNode = nodes.find(n => n.id === connection.fromId)
    const toNode = nodes.find(n => n.id === connection.toId)
    
    if (!fromNode || !toNode) return null

    const fromSize = NODE_SIZES[fromNode.size]
    const toSize = NODE_SIZES[toNode.size]
    
    const fromX = fromNode.x + fromSize.width / 2
    const fromY = fromNode.y + fromSize.height / 2
    const toX = toNode.x + toSize.width / 2
    const toY = toNode.y + toSize.height / 2

    // Create a curved line
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    const controlX = midX + (fromY - toY) * 0.2
    const controlY = midY + (toX - fromX) * 0.2

    return (
      <path
        key={`${connection.fromId}-${connection.toId}`}
        d={`M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`}
        stroke="#8b5cf6"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
        opacity={showConnections ? 0.6 : 0}
        className="transition-opacity duration-300"
      />
    )
  }, [nodes, showConnections])

  const renderNode = useCallback((node: MindMapNode) => {
    const size = NODE_SIZES[node.size]
    const isSelected = selectedNodeId === node.id
    const isEditing = editingNodeId === node.id

    return (
      <g key={node.id}>
        <rect
          x={node.x}
          y={node.y}
          width={size.width}
          height={size.height}
          rx="16"
          fill={node.color}
          stroke={isSelected ? "#8b5cf6" : "transparent"}
          strokeWidth={isSelected ? "3" : "0"}
          className="cursor-move transition-all duration-200 hover:opacity-80"
          onMouseDown={(e) => handleMouseDown(e, node.id)}
        />
        
        {isEditing ? (
          <foreignObject x={node.x + 8} y={node.y + 8} width={size.width - 16} height={size.height - 16}>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={(e) => {
                if (e.key === 'Enter') finishEditing()
                if (e.key === 'Escape') {
                  setEditingNodeId(null)
                  setEditText('')
                }
              }}
              className="w-full h-full bg-transparent border-none outline-none text-center resize-none"
              style={{ fontSize: `${size.fontSize}px` }}
              autoFocus
            />
          </foreignObject>
        ) : (
          <text
            x={node.x + size.width / 2}
            y={node.y + size.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size.fontSize}
            fill="#374151"
            className="pointer-events-none select-none"
            style={{ maxWidth: size.width - 16 }}
          >
            {node.text.length > 20 ? `${node.text.substring(0, 20)}...` : node.text}
          </text>
        )}
      </g>
    )
  }, [selectedNodeId, editingNodeId, editText, handleMouseDown, finishEditing])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
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
                <div className="text-2xl">🌐</div>
                <div>
                  <h1 className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Mindmap Generator
                  </h1>
                  <p className="text-sm text-muted-foreground">Create visual concept maps</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                value={mindMapTitle}
                onChange={(e) => setMindMapTitle(e.target.value)}
                className="w-48"
                placeholder="Mind map title..."
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Node */}
              <div className="space-y-2">
                <Button
                  onClick={() => addNode()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Node
                </Button>
                
                {selectedNodeId && (
                  <Button
                    onClick={() => addNode(selectedNodeId)}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                )}
              </div>

              <Separator />

              {/* Node Actions */}
              {selectedNodeId && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Node</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEditing(selectedNodeId)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteNode(selectedNodeId)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Color Picker */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {PASTEL_COLORS.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => updateNode(selectedNodeId, { color })}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* View Controls */}
              <div className="space-y-2">
                <p className="text-sm font-medium">View</p>
                <Button
                  onClick={() => setShowConnections(!showConnections)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {showConnections ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  {showConnections ? 'Hide' : 'Show'} Connections
                </Button>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={exportMindMap}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                <Button
                  onClick={clearMindMap}
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-600"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>

              {/* Stats */}
              <div className="pt-4 space-y-2">
                <Badge variant="secondary" className="w-full justify-center">
                  {nodes.length} Nodes
                </Badge>
                <Badge variant="secondary" className="w-full justify-center">
                  {connections.length} Connections
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              <div 
                className="w-full h-[600px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
                style={{ minHeight: '600px' }}
              >
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Grid Pattern */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Render connections first (behind nodes) */}
                  {connections.map(renderConnection)}
                  
                  {/* Render nodes */}
                  {nodes.map(renderNode)}
                </svg>

                {/* Instructions overlay */}
                {nodes.length === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
                      <div className="text-4xl mb-2">🎯</div>
                      <h3 className="text-lg font-medium mb-2">Get Started!</h3>
                      <p className="text-sm text-muted-foreground">
                        Click "Add Node" to create your first concept,<br />
                        then drag nodes to organize your ideas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}