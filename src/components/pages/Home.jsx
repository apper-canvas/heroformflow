import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Empty from "@/components/ui/Empty"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { formService } from "@/services/api/formService"
import { responseService } from "@/services/api/responseService"
import { toast } from "react-toastify"

const Home = () => {
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [formsData, responsesData] = await Promise.all([
        formService.getAll(),
        responseService.getAll()
      ])
      setForms(formsData)
      setResponses(responsesData)
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load forms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateForm = async () => {
    try {
      const newForm = {
        id: Date.now().toString(),
        title: "Untitled Form",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: [],
        settings: {
          thankYouMessage: "Thank you for your response!",
          redirectUrl: "",
          allowMultipleSubmissions: false
        }
      }

      const createdForm = await formService.create(newForm)
      navigate(`/form/${createdForm.id}/builder`)
      toast.success("New form created!")
    } catch (error) {
      console.error("Error creating form:", error)
      toast.error("Failed to create form")
    }
  }

  const handleDeleteForm = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return
    }

    try {
      await formService.delete(formId)
      setForms(prev => prev.filter(f => f.id !== formId))
      
      // Also delete associated responses
      const formResponses = responses.filter(r => r.formId === formId)
      for (const response of formResponses) {
        await responseService.delete(response.id)
      }
      setResponses(prev => prev.filter(r => r.formId !== formId))
      
      toast.success("Form deleted successfully")
    } catch (error) {
      console.error("Error deleting form:", error)
      toast.error("Failed to delete form")
    }
  }

  const handleDuplicateForm = async (form) => {
    try {
      const duplicatedForm = {
        ...form,
        id: Date.now().toString(),
        title: `${form.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: form.questions.map(q => ({
          ...q,
          id: Date.now().toString() + Math.random()
        }))
      }

      const createdForm = await formService.create(duplicatedForm)
      setForms(prev => [createdForm, ...prev])
      toast.success("Form duplicated successfully!")
    } catch (error) {
      console.error("Error duplicating form:", error)
      toast.error("Failed to duplicate form")
    }
  }

  const getResponseCount = (formId) => {
    return responses.filter(r => r.formId === formId).length
  }

  const getCompletionRate = (formId) => {
    const formResponses = responses.filter(r => r.formId === formId)
    if (formResponses.length === 0) return 0
    const completed = formResponses.filter(r => r.completed).length
    return Math.round((completed / formResponses.length) * 100)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FormFlow
              </h1>
              <p className="text-gray-600 mt-1">Create beautiful conversational forms</p>
            </div>

            <Button onClick={handleCreateForm} size="lg" className="flex items-center space-x-2">
              <ApperIcon name="Plus" size={20} />
              <span>Create New Form</span>
            </Button>
          </div>

          {/* Stats */}
          {forms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Forms</p>
                    <p className="text-2xl font-bold text-gray-800">{forms.length}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <ApperIcon name="FileText" size={24} className="text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Responses</p>
                    <p className="text-2xl font-bold text-gray-800">{responses.length}</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg">
                    <ApperIcon name="Users" size={24} className="text-success" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Completion</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {forms.length > 0 
                        ? Math.round(forms.reduce((acc, form) => acc + getCompletionRate(form.id), 0) / forms.length)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <ApperIcon name="TrendingUp" size={24} className="text-accent" />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {forms.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Forms</h2>
              <Button variant="ghost" onClick={loadData} className="flex items-center space-x-1">
                <ApperIcon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <Card key={form.id} hover className="p-6 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate mb-2">
                        {form.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="MessageCircle" size={14} />
                          <span>{form.questions?.length || 0} questions</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Users" size={14} />
                          <span>{getResponseCount(form.id)} responses</span>
                        </span>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateForm(form)}
                          className="p-1.5 text-gray-500 hover:text-secondary"
                        >
                          <ApperIcon name="Copy" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteForm(form.id)}
                          className="p-1.5 text-gray-500 hover:text-error"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant="primary" className="text-xs">
                      {getCompletionRate(form.id)}% completion
                    </Badge>
                    {form.questions?.length > 0 && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Last updated {format(new Date(form.updatedAt), "MMM dd, yyyy")}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/form/${form.id}/builder`)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit3" size={14} className="mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/form/${form.id}/responses`)}
                      className="flex items-center space-x-1"
                    >
                      <ApperIcon name="BarChart3" size={14} />
                      <span className="text-xs">{getResponseCount(form.id)}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/form/${form.id}/preview`)}
                      className="p-2"
                    >
                      <ApperIcon name="Eye" size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Empty
              title="Create your first form"
              description="Get started by building a conversational form that engages your audience one question at a time."
              action={handleCreateForm}
              actionText="Create New Form"
              icon="FileText"
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default Home