import formsData from "@/services/mockData/forms.json";

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

  // Conditional logic validation methods
  validateLogicRules(questions) {
    const questionIds = new Set(questions.map(q => q.id))
    const errors = []

    questions.forEach(question => {
      if (question.conditionalLogic) {
        question.conditionalLogic.forEach((rule, ruleIndex) => {
          // Validate target question exists
          if (!questionIds.has(rule.targetQuestionId)) {
            errors.push({
              questionId: question.id,
              ruleIndex,
              error: `Target question ${rule.targetQuestionId} does not exist`
            })
          }

          // Validate no self-referencing
          if (rule.targetQuestionId === question.id) {
            errors.push({
              questionId: question.id,
              ruleIndex,
              error: 'Question cannot reference itself'
            })
          }

          // Validate required fields
          if (!rule.condition || !rule.targetValue || !rule.action) {
            errors.push({
              questionId: question.id,
              ruleIndex,
              error: 'Condition, target value, and action are required'
            })
          }
        })
      }
    })

    return errors
  }

  // Check for circular dependencies in logic flow
  detectCircularDependencies(questions) {
    const dependencies = new Map()
    
    // Build dependency graph
    questions.forEach(question => {
      dependencies.set(question.id, new Set())
      if (question.conditionalLogic) {
        question.conditionalLogic.forEach(rule => {
          dependencies.get(question.id).add(rule.targetQuestionId)
        })
      }
    })

    // DFS to detect cycles
    const visited = new Set()
    const recursionStack = new Set()
    
    const hasCycle = (nodeId) => {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false
      
      visited.add(nodeId)
      recursionStack.add(nodeId)
      
      const deps = dependencies.get(nodeId) || new Set()
      for (const dep of deps) {
        if (hasCycle(dep)) return true
      }
      
      recursionStack.delete(nodeId)
      return false
    }

    for (const questionId of dependencies.keys()) {
      if (!visited.has(questionId)) {
        if (hasCycle(questionId)) {
          return true
        }
      }
    }
    
    return false
  }

  // Evaluate which questions should be visible based on responses
  evaluateQuestionVisibility(questions, responses = {}) {
    const visibleQuestions = new Set()
    
    questions.forEach(question => {
      let isVisible = true
      
      if (question.conditionalLogic && question.conditionalLogic.length > 0) {
        isVisible = question.conditionalLogic.some(rule => {
          const targetResponse = responses[rule.targetQuestionId]
          
          switch (rule.condition) {
            case 'equals':
              return targetResponse === rule.targetValue
            case 'not_equals':
              return targetResponse !== rule.targetValue
            case 'contains':
              return targetResponse && targetResponse.includes(rule.targetValue)
            case 'greater_than':
              return parseFloat(targetResponse) > parseFloat(rule.targetValue)
            case 'less_than':
              return parseFloat(targetResponse) < parseFloat(rule.targetValue)
            case 'is_empty':
              return !targetResponse || targetResponse.trim() === ''
            case 'is_not_empty':
              return targetResponse && targetResponse.trim() !== ''
            default:
              return false
          }
        })
      }
      
      if (isVisible) {
        visibleQuestions.add(question.id)
      }
    })
    
return visibleQuestions
  }
}

export const formService = new FormService()