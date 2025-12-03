import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "@/components/organisms/Header"
import FormBuilder from "@/components/organisms/FormBuilder"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { formService } from "@/services/api/formService"
import { toast } from "react-toastify"

const FormBuilderPage = () => {
  const { formId } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  useEffect(() => {
    if (formId) {
      loadForm()
    }
  }, [formId])

  // Auto-save functionality
  useEffect(() => {
    if (!form || !hasUnsavedChanges) return

    const saveTimeout = setTimeout(async () => {
      await handleAutoSave()
    }, 2000)

    return () => clearTimeout(saveTimeout)
  }, [form, hasUnsavedChanges])

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
      
      <div className="flex-1 overflow-hidden">
        <FormBuilder
          form={form}
          onUpdateForm={handleUpdateForm}
        />
      </div>
    </div>
  )
}

export default FormBuilderPage