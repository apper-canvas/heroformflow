import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  required,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 placeholder:text-gray-400 bg-white"
  
  const errorClasses = error 
    ? "border-error focus:border-error focus:ring-error/20" 
    : "border-gray-300 hover:border-gray-400"
    
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(baseClasses, errorClasses, className)}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input