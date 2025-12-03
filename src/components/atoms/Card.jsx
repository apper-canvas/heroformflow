import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-md shadow-card border border-gray-100 transition-all duration-200"
  const hoverClasses = hover ? "hover:shadow-hover hover:-translate-y-1 cursor-pointer" : ""
  
  return (
    <div
      className={cn(baseClasses, hoverClasses, className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card