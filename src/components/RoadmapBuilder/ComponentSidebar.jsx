import React from 'react'
import { 
  Type, 
  Circle, 
  Square, 
  MousePointer, 
  Image, 
  List, 
  Link, 
  Minus, 
  MoreVertical,
  ExternalLink,
  Layout,
  Hash,
  AlignLeft
} from 'lucide-react'
import { useRoadmap, NODE_TYPES, getDefaultNodeStyle } from '../../context/RoadmapContext.jsx'

const ComponentItem = ({ icon: Icon, label, type, description, color = "text-gray-600" }) => {
  const { actions } = useRoadmap()

  const handleDragStart = (e) => {
    const nodeData = {
      type,
      content: label,
      x: 0, // Will be set by drop position
      y: 0,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      style: getDefaultNodeStyle(type)
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(nodeData))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleClick = () => {
    // Add to center of canvas when clicked
    const nodeData = {
      type,
      content: label,
      x: 200, // Default center position  
      y: 150,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      style: getDefaultNodeStyle(type)
    }
    
    actions.addNode(nodeData)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
      title={description}
    >
      <div className={`${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 group-hover:text-gray-700">
          {label}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {description}
        </div>
      </div>
    </div>
  )
}

// Helper functions for default node properties
const getDefaultWidth = (type) => {
  switch (type) {
    case NODE_TYPES.TITLE: return 300
    case NODE_TYPES.TOPIC: return 200
    case NODE_TYPES.SUBTOPIC: return 180
    case NODE_TYPES.HORIZONTAL_LINE: return 200
    case NODE_TYPES.VERTICAL_LINE: return 4
    case NODE_TYPES.PARAGRAPH: return 250
    case NODE_TYPES.LIST: return 200
    case NODE_TYPES.LINKS_GROUP: return 220
    case NODE_TYPES.BUTTON: return 120
    case NODE_TYPES.RESOURCE_BUTTON: return 150
    default: return 150
  }
}

const getDefaultHeight = (type) => {
  switch (type) {
    case NODE_TYPES.TITLE: return 60
    case NODE_TYPES.TOPIC: return 50  
    case NODE_TYPES.SUBTOPIC: return 45
    case NODE_TYPES.HORIZONTAL_LINE: return 2
    case NODE_TYPES.VERTICAL_LINE: return 100
    case NODE_TYPES.PARAGRAPH: return 80
    case NODE_TYPES.LIST: return 120
    case NODE_TYPES.BUTTON: return 40
    case NODE_TYPES.RESOURCE_BUTTON: return 40
    default: return 40
  }
}

const ComponentSidebar = () => {
  const components = [
    // Structure nodes
    {
      icon: Circle,
      label: 'Start',
      type: NODE_TYPES.START,
      description: 'Starting point',
      color: 'text-green-600'
    },
    {
      icon: Square,  
      label: 'End',
      type: NODE_TYPES.END,
      description: 'End point',
      color: 'text-red-600'
    },
    {
      icon: Type,
      label: 'Title',
      type: NODE_TYPES.TITLE,
      description: 'Main heading for sections',
      color: 'text-blue-600'
    },
    {
      icon: Circle,
      label: 'Topic', 
      type: NODE_TYPES.TOPIC,
      description: 'Primary learning topic',
      color: 'text-purple-600'
    },
    {
      icon: Hash,
      label: 'Subtopic',
      type: NODE_TYPES.SUBTOPIC, 
      description: 'Secondary learning topic',
      color: 'text-yellow-600'
    },
    
    // Interactive nodes
    {
      icon: MousePointer,
      label: 'Button',
      type: NODE_TYPES.BUTTON,
      description: 'Clickable action button',
      color: 'text-indigo-600'
    },
    {
      icon: ExternalLink,
      label: 'Resource',
      type: NODE_TYPES.RESOURCE_BUTTON,
      description: 'External resource link',
      color: 'text-blue-500'
    },
    {
      icon: Link,
      label: 'Links',
      type: NODE_TYPES.LINKS_GROUP,
      description: 'Related links collection',
      color: 'text-cyan-600'
    },
    
    // Content nodes
    {
      icon: AlignLeft,
      label: 'Paragraph',
      type: NODE_TYPES.PARAGRAPH,
      description: 'Text content block',
      color: 'text-gray-600'
    },
    {
      icon: List,
      label: 'List',
      type: NODE_TYPES.LIST,
      description: 'Bulleted list',
      color: 'text-gray-700'
    },
    
    // Visual elements
    {
      icon: Image,
      label: 'Image',
      type: NODE_TYPES.IMAGE,
      description: 'Image placeholder',
      color: 'text-orange-600'
    },
    {
      icon: Layout,
      label: 'Icon',
      type: NODE_TYPES.ICON,
      description: 'Icon placeholder',
      color: 'text-pink-600'
    },
    
    // Lines and separators
    {
      icon: Minus,
      label: 'H-Line',
      type: NODE_TYPES.HORIZONTAL_LINE,
      description: 'Horizontal divider',
      color: 'text-gray-500'
    },
    {
      icon: MoreVertical,  
      label: 'V-Line',
      type: NODE_TYPES.VERTICAL_LINE,
      description: 'Vertical divider',
      color: 'text-gray-500'  
    }
  ]

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Components
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Drag & drop or click to add components to your roadmap
        </p>
      </div>
      
      <div className="space-y-1">
        {components.map((component, index) => (
          <ComponentItem
            key={index}
            icon={component.icon}
            label={component.label}
            type={component.type}
            description={component.description}
            color={component.color}
          />
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">
          💡 Pro Tip
        </div>
        <div className="text-xs text-blue-800">
          Hold Shift while dragging to maintain aspect ratio
        </div>
      </div>
    </div>
  )
}

export default ComponentSidebar