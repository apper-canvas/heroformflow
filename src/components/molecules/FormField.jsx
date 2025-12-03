import React from "react"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Input
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        error={error}
        {...props}
      />
    </div>
  )
}

export default FormField