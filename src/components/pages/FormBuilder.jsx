import React, { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import Header from "@/components/organisms/Header"
import FormBuilder from "@/components/organisms/FormBuilder"
import LogicBuilder from "@/components/organisms/LogicBuilder"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { formService } from "@/services/api/formService"
import { toast } from "react-toastify"

const FormBuilderPage = () => {
  const { formId } = useParams()
  const location = useLocation()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [activeView, setActiveView] = useState('builder')

  useEffect(() => {
    if (formId) {
      loadForm()
    }
  }, [formId])

  useEffect(() => {
    // Set active view based on route
    if (location.pathname.includes('/logic')) {
      setActiveView('logic')
    } else {
      setActiveView('builder')
    }
  }, [location.pathname])

  // Auto-save functionality
  useEffect(() => {
    if (!form || !hasUnsavedChanges) return

    const saveTimeout = setTimeout(async () => {
      await handleAutoSave()
    }, 2000)

    return () => clearTimeout(saveTimeout)
  }, [form, hasUnsavedChanges])

  // Validate logic rules on form changes
  useEffect(() => {
    if (!form || !form.questions) return

    const errors = formService.validateLogicRules(form.questions)
    if (errors.length > 0) {
      console.warn('Logic validation errors:', errors)
    }

    const hasCircularDeps = formService.detectCircularDependencies(form.questions)
    if (hasCircularDeps) {
      toast.warning('Circular dependencies detected in logic rules')
    }
  }, [form])

  const loadForm = async () => {
    if (!formId) return
    
    try {
      setLoading(true)
      setError("")
      const formData = await formService.getById(parseInt(formId))
      setForm(formData)
    } catch (err) {
      console.error("Error loading form:", err)
      setError("Failed to load form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateForm = (updatedForm) => {
    setForm(updatedForm)
    setHasUnsavedChanges(true)
  }

  const handleAutoSave = async () => {
    if (!form || !hasUnsavedChanges) return

    try {
      setIsAutoSaving(true)
      await formService.update(form.id, form)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Auto-save failed:", error)
    } finally {
      setIsAutoSaving(false)
    }
  }

  const handleManualSave = async () => {
    if (!form) return

    try {
      await formService.update(form.id, form)
      setHasUnsavedChanges(false)
      toast.success("Form saved successfully!")
    } catch (error) {
      console.error("Error saving form:", error)
      toast.error("Failed to save form")
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadForm} />
  if (!form) return <ErrorView message="Form not found" />

  return (
    <div className="h-screen flex flex-col">
      <Header
        form={form}
        onSave={handleManualSave}
        isAutoSaving={isAutoSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1 px-6 py-2">
          <Button
            variant={activeView === 'builder' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('builder')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Edit3" size={16} />
            Form Builder
          </Button>
          <Button
            variant={activeView === 'logic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('logic')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="GitBranch" size={16} />
            Logic Builder
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'logic' ? (
          <LogicBuilder
            form={form}
            onUpdateForm={handleUpdateForm}
          />
        ) : (
          <FormBuilder
            form={form}
            onUpdateForm={handleUpdateForm}
          />
        )}
      </div>
    </div>
  )
}

export default FormBuilderPage