import responsesData from "@/services/mockData/responses.json"

class ResponseService {
  constructor() {
    this.responses = this.loadFromStorage()
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("formflow_responses")
      if (stored) {
        return JSON.parse(stored)
      }
      // Initialize with mock data if no stored data
      localStorage.setItem("formflow_responses", JSON.stringify(responsesData))
      return [...responsesData]
    } catch (error) {
      console.error("Error loading responses from storage:", error)
      return [...responsesData]
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("formflow_responses", JSON.stringify(this.responses))
    } catch (error) {
      console.error("Error saving responses to storage:", error)
    }
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    return [...this.responses].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const response = this.responses.find(r => r.Id === id || r.id === id.toString())
    if (!response) {
      throw new Error(`Response with id ${id} not found`)
    }
    return { ...response }
  }

  async getByFormId(formId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.responses
      .filter(r => r.formId === formId.toString())
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .map(r => ({ ...r }))
  }

  async create(responseData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Find highest existing Id and add 1
    const maxId = Math.max(...this.responses.map(r => r.Id), 0)
    const newResponse = {
      ...responseData,
      Id: maxId + 1,
      id: (maxId + 1).toString(),
      submittedAt: new Date().toISOString()
    }
    
    this.responses.unshift(newResponse)
    this.saveToStorage()
    return { ...newResponse }
  }

  async update(id, responseData) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.responses.findIndex(r => r.Id === parseInt(id) || r.id === id.toString())
    if (index === -1) {
      throw new Error(`Response with id ${id} not found`)
    }
    
    this.responses[index] = {
      ...this.responses[index],
      ...responseData,
      submittedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return { ...this.responses[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.responses.findIndex(r => r.Id === parseInt(id) || r.id === id.toString())
    if (index === -1) {
      throw new Error(`Response with id ${id} not found`)
    }
    
    this.responses.splice(index, 1)
    this.saveToStorage()
    return true
  }
}

export const responseService = new ResponseService()