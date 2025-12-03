import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import QuestionCard from "@/components/molecules/QuestionCard"
import QuestionTypeSelector from "@/components/molecules/QuestionTypeSelector"
import QuestionEditor from "@/components/organisms/QuestionEditor"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"

const FormBuilder = ({ form, onUpdateForm }) => {
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  // Auto-select first question when form loads
  useEffect(() => {
    if (form?.questions && form.questions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(form.questions[0])
    }
  }, [form?.questions, selectedQuestion])

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      text: "",
      helpText: "",
      required: false,
      options: type === "multiple_choice" || type === "rating" ? ["Option 1"] : [],
      validation: {}
    }

    const updatedQuestions = [...(form?.questions || []), newQuestion]
    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })

    setSelectedQuestion(newQuestion)
    setShowTypeSelector(false)
    setShowEditor(true)
    toast.success("Question added!")
  }

  const handleQuestionUpdate = (updatedQuestion) => {
    const updatedQuestions = form.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    )
    
    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })
    
    setSelectedQuestion(updatedQuestion)
  }

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = form.questions.filter(q => q.id !== questionId)
    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })

    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(updatedQuestions.length > 0 ? updatedQuestions[0] : null)
    }
    
    toast.success("Question deleted")
  }

  const handleDuplicateQuestion = (question) => {
    const duplicatedQuestion = {
      ...question,
      id: Date.now().toString(),
      text: `${question.text} (Copy)`
    }

    const questionIndex = form.questions.findIndex(q => q.id === question.id)
    const updatedQuestions = [
      ...form.questions.slice(0, questionIndex + 1),
      duplicatedQuestion,
      ...form.questions.slice(questionIndex + 1)
    ]

    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })

    setSelectedQuestion(duplicatedQuestion)
    toast.success("Question duplicated!")
  }

  const handleReorderQuestions = (draggedId, targetIndex) => {
    const draggedIndex = form.questions.findIndex(q => q.id === draggedId)
    if (draggedIndex === -1) return

    const updatedQuestions = [...form.questions]
    const [draggedQuestion] = updatedQuestions.splice(draggedIndex, 1)
    updatedQuestions.splice(targetIndex, 0, draggedQuestion)

    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full">
        <Empty 
          title="No form selected" 
          description="Create a new form to get started"
          icon="FileText"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left Panel - Questions List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
            <Button
              size="sm"
              onClick={() => setShowTypeSelector(true)}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Plus" size={16} />
              <span>Add</span>
            </Button>
          </div>
          
          {form.questions?.length > 0 && (
            <p className="text-sm text-gray-600">
              {form.questions.length} question{form.questions.length !== 1 ? "s" : ""} total
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {form.questions?.length > 0 ? (
            form.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                isActive={selectedQuestion?.id === question.id}
                onClick={() => {
                  setSelectedQuestion(question)
                  setShowEditor(true)
                }}
                onEdit={(q) => {
                  setSelectedQuestion(q)
                  setShowEditor(true)
                }}
                onDelete={handleDeleteQuestion}
                onDuplicate={handleDuplicateQuestion}
              />
            ))
          ) : (
            <Empty
              title="No questions yet"
              description="Add your first question to get started"
              action={() => setShowTypeSelector(true)}
              actionText="Add Question"
              icon="MessageCircle"
            />
          )}
        </div>
      </div>

      {/* Right Panel - Question Editor */}
      <div className="flex-1 flex">
        {showEditor && selectedQuestion ? (
          <QuestionEditor
            question={selectedQuestion}
            onUpdate={handleQuestionUpdate}
            onClose={() => setShowEditor(false)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty
              title="Select a question to edit"
              description="Choose a question from the left panel or add a new one"
              action={() => setShowTypeSelector(true)}
              actionText="Add Question"
              icon="MousePointer"
            />
          </div>
        )}
      </div>

      {/* Question Type Selector Modal */}
      {showTypeSelector && (
        <QuestionTypeSelector
          onSelect={handleAddQuestion}
          onClose={() => setShowTypeSelector(false)}
        />
      )}
    </div>
  )
}

export default FormBuilder