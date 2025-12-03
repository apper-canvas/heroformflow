import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import { cn } from "@/utils/cn"

const QuestionEditor = ({ question, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    text: question?.text || "",
    helpText: question?.helpText || "",
    required: question?.required || false,
    options: question?.options || [],
    validation: question?.validation || {}
  })

  // Update form data when question changes
  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text || "",
        helpText: question.helpText || "",
        required: question.required || false,
        options: question.options || [],
        validation: question.validation || {}
      })
    }
  }, [question])

  const handleUpdate = (field, value) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    
    // Auto-save the question
    onUpdate({
      ...question,
      ...updatedData
    })
  }

  const handleAddOption = () => {
    const newOptions = [...formData.options, `Option ${formData.options.length + 1}`]
    handleUpdate("options", newOptions)
  }

  const handleUpdateOption = (index, value) => {
    const updatedOptions = formData.options.map((option, i) => 
      i === index ? value : option
    )
    handleUpdate("options", updatedOptions)
  }

  const handleRemoveOption = (index) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index)
    handleUpdate("options", updatedOptions)
  }

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

  if (!question) return null

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name={getTypeIcon(question.type)} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Edit Question</h3>
            <p className="text-sm text-gray-600 capitalize">
              {question.type.replace("_", " ")} question
            </p>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onClose} className="p-2">
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Question Text */}
          <Card className="p-6">
            <h4 className="font-medium text-gray-800 mb-4">Question Details</h4>
            
            <FormField
              label="Question Text"
              value={formData.text}
              onChange={(e) => handleUpdate("text", e.target.value)}
              placeholder="Enter your question..."
              required
              className="mb-4"
            />
            
            <FormField
              label="Help Text (Optional)"
              value={formData.helpText}
              onChange={(e) => handleUpdate("helpText", e.target.value)}
              placeholder="Add helpful information for respondents..."
            />
          </Card>

          {/* Question Options - for multiple choice and rating */}
          {(question.type === "multiple_choice" || question.type === "rating") && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800">Answer Options</h4>
                <Button size="sm" onClick={handleAddOption}>
                  <ApperIcon name="Plus" size={16} className="mr-1" />
                  Add Option
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <FormField
                      value={option}
                      onChange={(e) => handleUpdateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.options.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-error hover:text-error"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Validation Rules */}
          {(question.type === "email" || question.type === "number") && (
            <Card className="p-6">
              <h4 className="font-medium text-gray-800 mb-4">Validation</h4>
              
              {question.type === "number" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Minimum Value"
                    type="number"
                    value={formData.validation.min || ""}
                    onChange={(e) => handleUpdate("validation", {
                      ...formData.validation,
                      min: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    placeholder="0"
                  />
                  <FormField
                    label="Maximum Value"
                    type="number"
                    value={formData.validation.max || ""}
                    onChange={(e) => handleUpdate("validation", {
                      ...formData.validation,
                      max: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    placeholder="100"
                  />
                </div>
              )}
            </Card>
          )}

          {/* Settings */}
          <Card className="p-6">
            <h4 className="font-medium text-gray-800 mb-4">Question Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Required Question</p>
                <p className="text-sm text-gray-600">Respondents must answer this question</p>
              </div>
              
              <button
                onClick={() => handleUpdate("required", !formData.required)}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  formData.required ? "bg-primary" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    formData.required ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
              <ApperIcon name="Eye" size={16} />
              <span>Preview</span>
            </h4>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-medium text-gray-800">
                    {formData.text || "Your question will appear here..."}
                    {formData.required && <span className="text-error ml-1">*</span>}
                  </h5>
                  {formData.helpText && (
                    <p className="text-sm text-gray-600 mt-1">{formData.helpText}</p>
                  )}
                </div>
                
                {/* Preview input based on type */}
                {question.type === "text" && (
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" 
                    placeholder="Short answer text"
                    disabled
                  />
                )}
                
                {question.type === "textarea" && (
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 h-24 resize-none" 
                    placeholder="Long answer text"
                    disabled
                  />
                )}
                
                {question.type === "email" && (
                  <input 
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" 
                    placeholder="email@example.com"
                    disabled
                  />
                )}
                
                {question.type === "number" && (
                  <input 
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" 
                    placeholder="Enter a number"
                    disabled
                  />
                )}
                
                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="preview-option" 
                          className="h-4 w-4 text-primary" 
                          disabled 
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === "rating" && (
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <ApperIcon 
                        key={star} 
                        name="Star" 
                        size={24} 
                        className="text-gray-300 cursor-pointer hover:text-yellow-400" 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default QuestionEditor