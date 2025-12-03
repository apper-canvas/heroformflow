import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
const Header = ({ form, onSave, isAutoSaving, hasUnsavedChanges }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isBuilder = location.pathname.includes("/builder")
  const isResponses = location.pathname.includes("/responses")

  const handleBack = () => {
    navigate("/")
  }

  const handlePreview = () => {
    if (form?.id) {
      navigate(`/form/${form.id}/preview`)
    }
  }

  const handleToggleView = () => {
    if (form?.id) {
      if (isBuilder) {
        navigate(`/form/${form.id}/responses`)
      } else {
        navigate(`/form/${form.id}/builder`)
      }
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="flex items-center space-x-2">
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back to Forms</span>
          </Button>
          
          {form && (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full" />
              <h1 className="text-xl font-semibold text-gray-800 truncate max-w-md">
                {form.title || "Untitled Form"}
              </h1>
              {hasUnsavedChanges && (
                <Badge variant="warning" className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
                  <span>Unsaved</span>
                </Badge>
              )}
              {isAutoSaving && (
                <Badge variant="primary" className="flex items-center space-x-1">
                  <ApperIcon name="RefreshCw" size={12} className="animate-spin" />
                  <span>Saving...</span>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {form && (
            <>
              {/* View toggle */}
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant={isBuilder ? "primary" : "ghost"}
                  size="sm"
                  onClick={handleToggleView}
                  className={cn(
                    "px-4 py-2 text-sm",
                    !isBuilder && "hover:bg-white"
                  )}
                >
                  <ApperIcon name="Edit3" size={14} className="mr-2" />
                  Builder
                </Button>
                <Button
                  variant={isResponses ? "primary" : "ghost"}
                  size="sm"
                  onClick={handleToggleView}
                  className={cn(
                    "px-4 py-2 text-sm",
                    !isResponses && "hover:bg-white"
                  )}
                >
                  <ApperIcon name="BarChart3" size={14} className="mr-2" />
                  Responses
                </Button>
              </div>

              {/* Actions */}
              <Button variant="outline" onClick={handlePreview}>
                <ApperIcon name="Eye" size={16} className="mr-2" />
                Preview
              </Button>
              
              <Button onClick={onSave} className="flex items-center space-x-2">
                <ApperIcon name="Save" size={16} />
                <span>Save Form</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header