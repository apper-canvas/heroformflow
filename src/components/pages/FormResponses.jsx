import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "@/components/organisms/Header"
import ResponsesList from "@/components/organisms/ResponsesList"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { formService } from "@/services/api/formService"

const FormResponsesPage = () => {
  const { formId } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (formId) {
      loadForm()
    }
  }, [formId])

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

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadForm} />
  if (!form) return <ErrorView message="Form not found" />

  return (
    <div className="h-screen flex flex-col">
      <Header form={form} />
      
      <div className="flex-1 overflow-hidden">
        <ResponsesList formId={formId} />
      </div>
    </div>
  )
}

export default FormResponsesPage