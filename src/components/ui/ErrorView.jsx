import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-gray-50 flex items-center justify-center p-8">
      <div className="text-center space-y-8 max-w-md">
        {/* Error illustration */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full mx-auto flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={40} className="text-error" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center">
            <ApperIcon name="X" size={16} className="text-white" />
          </div>
        </div>
        
        {/* Error message */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="flex items-center gap-2">
              <ApperIcon name="RefreshCw" size={16} />
              Try Again
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Refresh Page
          </Button>
        </div>
        
        {/* Help text */}
        <div className="pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            If the problem persists, please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorView