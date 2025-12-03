import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating something new", 
  action,
  actionText = "Get Started",
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto">
      {/* Empty state illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name={icon} size={40} className="text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
          <ApperIcon name="Plus" size={16} className="text-white" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      
      {/* Call to action */}
      {action && (
        <Button onClick={action} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionText}
        </Button>
      )}
      
      {/* Decorative elements */}
      <div className="flex space-x-2 mt-8 opacity-30">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}

export default Empty