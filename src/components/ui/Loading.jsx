import React from "react"

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-gray-50 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        {/* Logo placeholder */}
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full mx-auto animate-pulse" />
        
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent rounded-full animate-spin mx-auto" 
               style={{ animationDelay: '0.1s', animationDirection: 'reverse' }} />
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Loading FormFlow</h3>
          <p className="text-gray-600">Setting up your form builder...</p>
        </div>
        
        {/* Skeleton cards */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  )
}

export default Loading