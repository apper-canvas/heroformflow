import React from "react"
import { useParams } from "react-router-dom"
import FormResponsePlayer from "@/components/organisms/FormResponsePlayer"

const FormPreviewPage = () => {
  const { formId } = useParams()

  return <FormResponsePlayer formId={formId} />
}

export default FormPreviewPage