import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/molecules/ProgressBar";
import { formService } from "@/services/api/formService";
import { responseService } from "@/services/api/responseService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const FormResponsePlayer = ({ formId }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [direction, setDirection] = useState("forward")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForm()
  }, [formId])

  const loadForm = async () => {
    if (!formId) return
    
    try {
      setLoading(true)
      const formData = await formService.getById(parseInt(formId))
      setForm(formData)
      
      // Initialize current answer if returning to a question
      const currentQuestion = formData.questions[currentQuestionIndex]
      if (currentQuestion && answers[currentQuestion.id]) {
        setCurrentAnswer(answers[currentQuestion.id])
      }
    } catch (error) {
      console.error("Error loading form:", error)
      toast.error("Failed to load form")
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = form?.questions?.[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === (form?.questions?.length - 1)

  const handleAnswerChange = (value) => {
    setCurrentAnswer(value)
  }

  const handleNext = async () => {
    if (!currentQuestion) return

    // Validate required questions
    if (currentQuestion.required && !currentAnswer.trim()) {
      toast.error("This question is required")
      return
    }

    // Validate email format
    if (currentQuestion.type === "email" && currentAnswer) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(currentAnswer)) {
        toast.error("Please enter a valid email address")
        return
      }
    }

    // Validate number range
    if (currentQuestion.type === "number" && currentAnswer) {
      const num = parseFloat(currentAnswer)
      if (currentQuestion.validation?.min !== undefined && num < currentQuestion.validation.min) {
        toast.error(`Value must be at least ${currentQuestion.validation.min}`)
        return
      }
      if (currentQuestion.validation?.max !== undefined && num > currentQuestion.validation.max) {
        toast.error(`Value must be no more than ${currentQuestion.validation.max}`)
        return
      }
    }

    // Save answer
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: currentAnswer
    }
    setAnswers(updatedAnswers)

    if (isLastQuestion) {
      // Submit form
      await handleSubmit(updatedAnswers)
    } else {
      // Move to next question
      setDirection("forward")
      setCurrentQuestionIndex(prev => prev + 1)
      
      // Load next answer if it exists
      const nextQuestion = form.questions[currentQuestionIndex + 1]
      if (nextQuestion && updatedAnswers[nextQuestion.id]) {
        setCurrentAnswer(updatedAnswers[nextQuestion.id])
      } else {
        setCurrentAnswer("")
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection("backward")
      setCurrentQuestionIndex(prev => prev - 1)
      
      // Load previous answer
      const prevQuestion = form.questions[currentQuestionIndex - 1]
      if (prevQuestion && answers[prevQuestion.id]) {
        setCurrentAnswer(answers[prevQuestion.id])
      } else {
        setCurrentAnswer("")
      }
    }
  }

  const handleSubmit = async (finalAnswers) => {
    try {
      setIsSubmitting(true)
      
      const responseData = {
        id: Date.now().toString(),
        formId: formId,
        submittedAt: new Date().toISOString(),
        completed: true,
        answers: Object.entries(finalAnswers).map(([questionId, value]) => ({
          questionId,
          value
        }))
      }

      await responseService.create(responseData)
      setIsComplete(true)
      toast.success("Form submitted successfully!")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  const renderQuestionInput = () => {
    if (!currentQuestion) return null

    const commonProps = {
      value: currentAnswer,
      onChange: (e) => handleAnswerChange(e.target.value),
      onKeyPress: handleKeyPress,
      className: "w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors",
      autoFocus: true
    }

    switch (currentQuestion.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Type your answer here..."
            {...commonProps}
          />
        )

      case "textarea":
        return (
          <textarea
            placeholder="Type your answer here..."
            rows={4}
            {...commonProps}
          />
        )

      case "email":
        return (
          <input
            type="email"
            placeholder="your.email@example.com"
            {...commonProps}
          />
        )

      case "number":
        return (
          <input
            type="number"
            placeholder="Enter a number..."
            min={currentQuestion.validation?.min}
            max={currentQuestion.validation?.max}
            {...commonProps}
          />
        )

      case "multiple_choice":
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(option)}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5",
                  currentAnswer === option 
                    ? "border-primary bg-primary/10 text-primary font-medium" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    currentAnswer === option ? "border-primary bg-primary" : "border-gray-300"
                  )}>
                    {currentAnswer === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )

      case "rating":
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswerChange(rating.toString())}
                className="p-2 transition-transform hover:scale-110"
              >
                <ApperIcon
                  name="Star"
                  size={40}
                  className={cn(
                    "transition-colors",
                    parseInt(currentAnswer) >= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 hover:text-yellow-300"
                  )}
                />
              </button>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/10 via-white to-success/5 flex items-center justify-center p-8">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-success to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ApperIcon name="Check" size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank you!</h2>
          <p className="text-gray-600 mb-6">
            {form?.settings?.thankYouMessage || "Your response has been submitted successfully."}
          </p>
          
          <Button onClick={() => navigate("/")} className="w-full">
            <ApperIcon name="Home" size={16} className="mr-2" />
            Back to Forms
          </Button>
        </Card>
      </div>
    )
  }

  if (!form || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-error/10 via-white to-error/5 flex items-center justify-center p-8">
        <Card className="max-w-md w-full p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Form not found</h2>
          <p className="text-gray-600 mb-6">The form you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Forms
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={form.questions.length} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            {/* Question */}
            <div className={cn(
              "animate-fade-in",
              direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"
            )}>
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">
                  {currentQuestion.text}
                  {currentQuestion.required && <span className="text-error ml-1">*</span>}
                </h1>
                
                {currentQuestion.helpText && (
                  <p className="text-gray-600 text-lg">{currentQuestion.helpText}</p>
                )}
              </div>

              {/* Answer Input */}
              <div className="mb-8">
                {renderQuestionInput()}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to continue
                </span>
                
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLastQuestion ? "Submit" : "Next"}</span>
                      <ApperIcon name={isLastQuestion ? "Check" : "ArrowRight"} size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FormResponsePlayer