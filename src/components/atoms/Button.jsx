import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500 transform hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error/90 hover:to-red-600/90 focus:ring-error shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-success/90 hover:to-green-600/90 focus:ring-success shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-4 py-2 text-base rounded",
    lg: "px-6 py-3 text-lg rounded-md",
    xl: "px-8 py-4 text-xl rounded-md"
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button