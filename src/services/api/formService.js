import formsData from "@/services/mockData/forms.json"

class FormService {
  constructor() {
    this.forms = this.loadFromStorage()
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("formflow_forms")
      if (stored) {
        return JSON.parse(stored)
      }
      // Initialize with mock data if no stored data
      localStorage.setItem("formflow_forms", JSON.stringify(formsData))
      return [...formsData]
    } catch (error) {
      console.error("Error loading forms from storage:", error)
      return [...formsData]
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("formflow_forms", JSON.stringify(this.forms))
    } catch (error) {
      console.error("Error saving forms to storage:", error)
    }
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.forms].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const form = this.forms.find(f => f.Id === id || f.id === id.toString())
    if (!form) {
      throw new Error(`Form with id ${id} not found`)
    }
    return { ...form }
  }

  async create(formData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Find highest existing Id and add 1
    const maxId = Math.max(...this.forms.map(f => f.Id), 0)
    const newForm = {
      ...formData,
      Id: maxId + 1,
      id: (maxId + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.forms.unshift(newForm)
    this.saveToStorage()
    return { ...newForm }
  }

  async update(id, formData) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = this.forms.findIndex(f => f.Id === parseInt(id) || f.id === id.toString())
    if (index === -1) {
      throw new Error(`Form with id ${id} not found`)
    }
    
    this.forms[index] = {
      ...this.forms[index],
      ...formData,
      updatedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return { ...this.forms[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.forms.findIndex(f => f.Id === parseInt(id) || f.id === id.toString())
    if (index === -1) {
      throw new Error(`Form with id ${id} not found`)
    }
    
    this.forms.splice(index, 1)
    this.saveToStorage()
    return true
  }
}

export const formService = new FormService()