import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-8 text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <ApperIcon name="AlertTriangle" size={48} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="Search" size={16} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} className="flex items-center space-x-2">
            <ApperIcon name="Home" size={16} />
            <span>Go Home</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Help text */}
        <div className="pt-8 border-t border-gray-100 mt-8">
          <p className="text-sm text-gray-500">
            Need help? Check out our{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary/80 underline"
            >
              forms dashboard
            </button>{" "}
            or create a new form.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default NotFound