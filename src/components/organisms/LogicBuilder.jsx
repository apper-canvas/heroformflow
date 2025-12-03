import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"

const LogicBuilder = ({ form, onUpdateForm }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedRule, setSelectedRule] = useState(null)
  const [showRuleEditor, setShowRuleEditor] = useState(false)

  const conditions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' }
  ]

  const handleAddRule = (questionId) => {
    const newRule = {
      condition: 'equals',
      targetQuestionId: '',
      targetValue: '',
      action: 'show'
    }

    const updatedQuestions = form.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          conditionalLogic: [...(q.conditionalLogic || []), newRule]
        }
      }
      return q
    })

    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })

    setSelectedQuestion(questionId)
    setSelectedRule(updatedQuestions.find(q => q.id === questionId).conditionalLogic.length - 1)
    setShowRuleEditor(true)
  }

  const handleUpdateRule = (questionId, ruleIndex, updatedRule) => {
    const updatedQuestions = form.questions.map(q => {
      if (q.id === questionId) {
        const newLogic = [...(q.conditionalLogic || [])]
        newLogic[ruleIndex] = updatedRule
        return {
          ...q,
          conditionalLogic: newLogic
        }
      }
      return q
    })

    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })
  }

  const handleDeleteRule = (questionId, ruleIndex) => {
    const updatedQuestions = form.questions.map(q => {
      if (q.id === questionId) {
        const newLogic = [...(q.conditionalLogic || [])]
        newLogic.splice(ruleIndex, 1)
        return {
          ...q,
          conditionalLogic: newLogic
        }
      }
      return q
    })

    onUpdateForm({
      ...form,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    })

    setShowRuleEditor(false)
    setSelectedQuestion(null)
    setSelectedRule(null)
  }

  const getQuestionTitle = (questionId) => {
    const question = form.questions.find(q => q.id === questionId)
    return question ? question.text : questionId
  }

const getAvailableTargetQuestions = (currentQuestionId) => {
    const currentIndex = form.questions.findIndex(q => q.id === currentQuestionId)
    return form.questions.slice(0, currentIndex).map((q, index) => ({
      value: q.id,
      label: `Q${index + 1}: ${q.text || 'Untitled Question'}`
    }))
  }

  const getTargetValueOptions = (targetQuestionId) => {
    const targetQuestion = form.questions.find(q => q.id === targetQuestionId)
    if (!targetQuestion) return []
    
    if (targetQuestion.type === 'multiple_choice' || targetQuestion.type === 'rating') {
      return targetQuestion.options.map(option => ({
        value: option,
        label: option
      }))
    }
    
    return []
  }

  const RuleEditor = ({ question, ruleIndex, rule }) => {
    const [editedRule, setEditedRule] = useState(rule)
    const availableTargets = getAvailableTargetQuestions(question.id)
    const targetValueOptions = getTargetValueOptions(editedRule.targetQuestionId)

    const handleSave = () => {
      if (!editedRule.targetQuestionId || !editedRule.condition) {
        toast.error("Please complete all required fields")
        return
      }

      handleUpdateRule(question.id, ruleIndex, editedRule)
      setShowRuleEditor(false)
      toast.success("Logic rule updated successfully")
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg mx-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Logic Rule
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRuleEditor(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
<FormField
                label="When Question"
                type="select"
                value={editedRule.targetQuestionId}
                onChange={(e) => setEditedRule(prev => ({ 
                  ...prev, 
                  targetQuestionId: e.target.value,
                  targetValue: '' 
                }))}
                options={availableTargets}
                placeholder={availableTargets.length > 0 ? "Choose which question triggers this logic" : "No previous questions available"}
                required
              />

              <FormField
                label="Condition"
                type="select"
                value={editedRule.condition}
                onChange={(e) => setEditedRule(prev => ({ ...prev, condition: e.target.value }))}
                options={conditions}
              />

              {editedRule.targetQuestionId && (
                <div>
                  {targetValueOptions.length > 0 ? (
                    <FormField
                      label="Value"
                      type="select"
                      value={editedRule.targetValue}
                      onChange={(e) => setEditedRule(prev => ({ ...prev, targetValue: e.target.value }))}
                      options={targetValueOptions}
                      placeholder="Select value"
                    />
                  ) : (
                    <FormField
                      label="Value"
                      type="text"
                      value={editedRule.targetValue}
                      onChange={(e) => setEditedRule(prev => ({ ...prev, targetValue: e.target.value }))}
                      placeholder="Enter comparison value"
                    />
                  )}
                </div>
              )}

              <FormField
                label="Action"
                type="select"
                value={editedRule.action}
                onChange={(e) => setEditedRule(prev => ({ ...prev, action: e.target.value }))}
                options={[
                  { value: 'show', label: 'Show this question' },
                  { value: 'hide', label: 'Hide this question' }
                ]}
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => handleDeleteRule(question.id, ruleIndex)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={16} />
                Delete Rule
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRuleEditor(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Rule
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Logic Builder
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Info" size={16} />
              <span>Create conditional flows based on user responses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {form.questions.map((question, index) => {
              const hasLogic = question.conditionalLogic && question.conditionalLogic.length > 0
              const availableTargets = getAvailableTargetQuestions(question.id)

              return (
                <Card key={question.id} className={cn(
                  "p-6 transition-all duration-200",
                  hasLogic ? "border-primary bg-purple-50" : "border-gray-200"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {question.text || 'Untitled Question'}
                        </h3>
                      </div>
                      
                      <div className="ml-11">
                        <p className="text-sm text-gray-600 mb-3">
                          Type: {question.type.replace('_', ' ')}
                        </p>

                        {hasLogic && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Conditional Logic Rules:
                            </h4>
                            {question.conditionalLogic.map((rule, ruleIndex) => (
                              <div
                                key={ruleIndex}
                                className="flex items-center gap-2 p-3 bg-white rounded-md border cursor-pointer hover:border-primary transition-colors"
                                onClick={() => {
                                  setSelectedQuestion(question.id)
                                  setSelectedRule(ruleIndex)
                                  setShowRuleEditor(true)
                                }}
                              >
                                <ApperIcon name="GitBranch" size={14} className="text-primary" />
                                <span className="text-sm text-gray-700">
                                  Show when "{getQuestionTitle(rule.targetQuestionId)}" {rule.condition.replace('_', ' ')} "{rule.targetValue}"
                                </span>
                                <ApperIcon name="ChevronRight" size={14} className="text-gray-400 ml-auto" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {availableTargets.length > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddRule(question.id)}
                          className="flex items-center gap-2"
                        >
                          <ApperIcon name="Plus" size={14} />
                          Add Logic
                        </Button>
                      ) : (
                        <div className="text-xs text-gray-500 px-3 py-2 bg-gray-100 rounded-md">
                          No previous questions
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {form.questions.length === 0 && (
            <Card className="p-12 text-center">
              <ApperIcon name="GitBranch" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Questions Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add questions to your form first, then you can create conditional logic between them.
              </p>
            </Card>
          )}
        </div>
      </div>

      {showRuleEditor && selectedQuestion && selectedRule !== null && (
        <RuleEditor
          question={form.questions.find(q => q.id === selectedQuestion)}
          ruleIndex={selectedRule}
          rule={form.questions.find(q => q.id === selectedQuestion).conditionalLogic[selectedRule]}
        />
      )}
    </div>
  )
}

export default LogicBuilder