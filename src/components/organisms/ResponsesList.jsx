import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Empty from "@/components/ui/Empty"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ResponseDetailModal from "@/components/organisms/ResponseDetailModal"
import { responseService } from "@/services/api/responseService"
import { toast } from "react-toastify"

const ResponsesList = ({ formId }) => {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    if (formId) {
      loadResponses()
    }
  }, [formId])

  const loadResponses = async () => {
    if (!formId) return
    
    try {
      setLoading(true)
      setError("")
      const data = await responseService.getAll()
      const formResponses = data.filter(response => response.formId === formId)
      setResponses(formResponses)
    } catch (err) {
      console.error("Error loading responses:", err)
      setError("Failed to load responses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewResponse = (response) => {
    setSelectedResponse(response)
    setShowDetail(true)
  }

  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm("Are you sure you want to delete this response?")) {
      return
    }

    try {
      await responseService.delete(responseId)
      setResponses(prev => prev.filter(r => r.id !== responseId))
      toast.success("Response deleted successfully")
    } catch (error) {
      console.error("Error deleting response:", error)
      toast.error("Failed to delete response")
    }
  }

  const getResponseSummary = (response) => {
    if (!response.answers || response.answers.length === 0) {
      return "No answers"
    }

    const firstAnswer = response.answers[0]
    if (!firstAnswer.value) return "Empty response"
    
    const value = firstAnswer.value.toString()
    return value.length > 50 ? `${value.substring(0, 50)}...` : value
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadResponses} />

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Form Responses</h2>
            <p className="text-gray-600 mt-1">
              {responses.length} response{responses.length !== 1 ? "s" : ""} collected
            </p>
          </div>

          {responses.length > 0 && (
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={loadResponses}>
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {responses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-800">{responses.length}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ApperIcon name="Users" size={20} className="text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.round((responses.filter(r => r.completed).length / responses.length) * 100)}%
                  </p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <ApperIcon name="CheckCircle" size={20} className="text-success" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Latest Response</p>
                  <p className="text-sm font-medium text-gray-800">
                    {responses.length > 0 
                      ? format(new Date(responses[0].submittedAt), "MMM dd, yyyy")
                      : "No responses"
                    }
                  </p>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <ApperIcon name="Clock" size={20} className="text-accent" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Responses List */}
      <div className="flex-1 overflow-y-auto p-6">
        {responses.length > 0 ? (
          <div className="space-y-4">
            {responses.map((response) => (
              <Card key={response.id} hover className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant={response.completed ? "success" : "warning"}>
                        {response.completed ? "Completed" : "Incomplete"}
                      </Badge>
                      
                      <span className="text-sm text-gray-500">
                        Submitted {format(new Date(response.submittedAt), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Response Preview:</span> {getResponseSummary(response)}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="MessageSquare" size={14} />
                        <span>{response.answers?.length || 0} answers</span>
                      </span>
                      
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="User" size={14} />
                        <span>Response #{response.id}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResponse(response)}
                    >
                      <ApperIcon name="Eye" size={16} className="mr-1" />
                      View
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResponse(response.id)}
                      className="text-error hover:text-error"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            title="No responses yet"
            description="Share your form to start collecting responses from your audience"
            icon="Inbox"
          />
        )}
      </div>

      {/* Response Detail Modal */}
      {showDetail && selectedResponse && (
        <ResponseDetailModal
          response={selectedResponse}
          onClose={() => {
            setShowDetail(false)
            setSelectedResponse(null)
          }}
        />
      )}
    </div>
  )
}

export default ResponsesList