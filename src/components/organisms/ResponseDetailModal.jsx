import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import { formService } from "@/services/api/formService"

const ResponseDetailModal = ({ response, onClose }) => {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForm()
  }, [response.formId])

  const loadForm = async () => {
    try {
      setLoading(true)
      const formData = await formService.getById(parseInt(response.formId))
      setForm(formData)
    } catch (error) {
      console.error("Error loading form:", error)
    } finally {
      setLoading(false)
    }
  }

  const getQuestionById = (questionId) => {
    return form?.questions?.find(q => q.id === questionId)
  }

  const formatAnswerValue = (value, question) => {
    if (!value && value !== 0) return "No answer"
    
    if (question?.type === "rating") {
      return `${value} out of 5 stars`
    }
    
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    
    return value.toString()
  }

  const getTypeIcon = (type) => {
    const iconMap = {
      text: "Type",
      textarea: "AlignLeft",
      multiple_choice: "CheckCircle", 
      email: "Mail",
      number: "Hash",
      rating: "Star"
    }
    return iconMap[type] || "HelpCircle"
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Response Details</h2>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={response.completed ? "success" : "warning"}>
                  {response.completed ? "Completed" : "Incomplete"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Submitted {format(new Date(response.submittedAt), "MMMM dd, yyyy 'at' h:mm a")}
                </span>
                <span className="text-sm text-gray-500">
                  Response #{response.id}
                </span>
              </div>
            </div>
            
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading response details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Form Info */}
              {form && (
                <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ApperIcon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{form.title}</h3>
                      <p className="text-sm text-gray-600">
                        {form.questions?.length} questions • Created {format(new Date(form.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Answers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <ApperIcon name="MessageSquare" size={20} />
                  <span>Answers ({response.answers?.length || 0})</span>
                </h3>

                {response.answers && response.answers.length > 0 ? (
                  response.answers.map((answer, index) => {
                    const question = getQuestionById(answer.questionId)
                    
                    return (
                      <Card key={`${answer.questionId}-${index}`} className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            {question ? (
                              <>
                                <div className="flex items-center space-x-2 mb-2">
                                  <ApperIcon 
                                    name={getTypeIcon(question.type)} 
                                    size={16} 
                                    className="text-gray-500" 
                                  />
                                  <Badge variant="primary" className="text-xs">
                                    {question.type.replace("_", " ")}
                                  </Badge>
                                  {question.required && (
                                    <Badge variant="error" className="text-xs">Required</Badge>
                                  )}
                                </div>

                                <h4 className="font-medium text-gray-800 mb-3">
                                  {question.text}
                                </h4>
                                
                                {question.helpText && (
                                  <p className="text-sm text-gray-600 mb-3">{question.helpText}</p>
                                )}
                              </>
                            ) : (
                              <h4 className="font-medium text-gray-800 mb-3">
                                Question (ID: {answer.questionId})
                              </h4>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-700">
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Answer:</span>
                              </p>
                              <div className="mt-1">
                                {question?.type === "rating" && answer.value ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <ApperIcon
                                          key={star}
                                          name="Star"
                                          size={20}
                                          className={
                                            star <= parseInt(answer.value)
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }
                                        />
                                      ))}
                                    </div>
                                    <span className="text-gray-600 ml-2">
                                      ({answer.value} out of 5 stars)
                                    </span>
                                  </div>
                                ) : (
                                  <p className="text-gray-800 font-medium">
                                    {formatAnswerValue(answer.value, question)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="p-8 text-center">
                    <ApperIcon name="MessageSquare" size={48} className="text-gray-300 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-800 mb-2">No Answers</h4>
                    <p className="text-gray-600">This response contains no answers.</p>
                  </Card>
                )}
              </div>

              {/* Response Metadata */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-3">Response Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Response ID</p>
                    <p className="font-medium text-gray-800">#{response.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium text-gray-800">
                      {response.completed ? "Completed" : "Incomplete"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(response.submittedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(response.submittedAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Response
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ResponseDetailModal