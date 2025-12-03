import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"

const QuestionCard = ({ question, index, isActive, onClick, onEdit, onDelete, onDuplicate }) => {
  const [isDragging, setIsDragging] = useState(false)

  const getTypeIcon = (type) => {
    const iconMap = {
      text: "Type",
      textarea: "AlignLeft",
      multiple_choice: "CheckCircle",
      email: "Mail",
      number: "Hash",
      rating: "Star"
    }
    return iconMap[type] || "HelpCircle"
  }

  const getTypeColor = (type) => {
    const colorMap = {
      text: "text-blue-600",
      textarea: "text-green-600", 
      multiple_choice: "text-purple-600",
      email: "text-orange-600",
      number: "text-red-600",
      rating: "text-yellow-600"
    }
    return colorMap[type] || "text-gray-600"
  }

  const handleDragStart = (e) => {
    setIsDragging(true)
    e.dataTransfer.setData("text/plain", question.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        isActive && "border-2 border-primary shadow-hover",
        isDragging && "opacity-50 scale-95"
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Question number and drag handle */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>
            <ApperIcon name="GripVertical" size={16} className="text-gray-400 cursor-grab hover:text-gray-600" />
          </div>
          
          {/* Question content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon 
                name={getTypeIcon(question.type)} 
                size={16} 
                className={getTypeColor(question.type)} 
              />
              <Badge variant="primary" className="text-xs">
                {question.type.replace("_", " ")}
              </Badge>
              {question.required && (
                <Badge variant="error" className="text-xs">Required</Badge>
              )}
            </div>
            
            <h4 className="font-medium text-gray-800 mb-1 truncate">
              {question.text || "Untitled Question"}
            </h4>
            
            {question.helpText && (
              <p className="text-sm text-gray-600 truncate">{question.helpText}</p>
            )}
            
            {question.options && question.options.length > 0 && (
              <div className="flex items-center space-x-1 mt-2">
                <ApperIcon name="List" size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  {question.options.length} options
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(question)
            }}
            className="p-1.5 text-gray-500 hover:text-primary"
          >
            <ApperIcon name="Edit2" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(question)
            }}
            className="p-1.5 text-gray-500 hover:text-secondary"
          >
            <ApperIcon name="Copy" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(question.id)
            }}
            className="p-1.5 text-gray-500 hover:text-error"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default QuestionCard