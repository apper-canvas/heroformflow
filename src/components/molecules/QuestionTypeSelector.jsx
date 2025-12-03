import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const QuestionTypeSelector = ({ onSelect, onClose }) => {
  const questionTypes = [
    { 
      id: "text", 
      label: "Short Text", 
      icon: "Type", 
      description: "Single line text input",
      color: "text-blue-600" 
    },
    { 
      id: "textarea", 
      label: "Long Text", 
      icon: "AlignLeft", 
      description: "Multi-line text area",
      color: "text-green-600" 
    },
    { 
      id: "multiple_choice", 
      label: "Multiple Choice", 
      icon: "CheckCircle", 
      description: "Single or multiple selection",
      color: "text-purple-600" 
    },
    { 
      id: "email", 
      label: "Email", 
      icon: "Mail", 
      description: "Email address input",
      color: "text-orange-600" 
    },
    { 
      id: "number", 
      label: "Number", 
      icon: "Hash", 
      description: "Numeric input field",
      color: "text-red-600" 
    },
    { 
      id: "rating", 
      label: "Rating", 
      icon: "Star", 
      description: "Star rating scale",
      color: "text-yellow-600" 
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Choose Question Type</h3>
              <p className="text-gray-600 mt-1">Select the type of question you want to add</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionTypes.map((type) => (
              <Card 
                key={type.id}
                hover
                onClick={() => onSelect(type.id)}
                className="p-4 cursor-pointer border-2 border-transparent hover:border-primary/20"
              >
                <div className="flex items-start space-x-4">
                  <div className={cn("p-2 rounded-lg bg-gray-50", type.color)}>
                    <ApperIcon name={type.icon} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 mb-1">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  <ApperIcon name="Plus" size={16} className="text-gray-400 mt-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default QuestionTypeSelector