class AssignmentService {
  constructor() {
    this.storageKey = "scholar-hub-assignments";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const initialAssignments = [
        {
          Id: 1,
          classId: 1,
          name: "Chapter 1 Quiz",
          description: "Basic concepts and terminology",
          pointsPossible: 25,
          dueDate: "2024-02-15",
          assignmentType: "Quiz",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          Id: 2,
          classId: 1,
          name: "Midterm Exam",
          description: "Comprehensive exam covering chapters 1-5",
          pointsPossible: 100,
          dueDate: "2024-03-01",
          assignmentType: "Exam",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(initialAssignments));
    }
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async getById(id) {
    await this.delay();
    const assignments = await this.getAll();
    return assignments.find(assignment => assignment.Id === parseInt(id));
  }

  async getByClass(classId) {
    await this.delay();
    const assignments = await this.getAll();
    return assignments.filter(assignment => assignment.classId === parseInt(classId));
  }

  async create(assignmentData) {
    await this.delay();
    const assignments = await this.getAll();
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
    
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      pointsPossible: parseInt(assignmentData.pointsPossible),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    assignments.push(newAssignment);
    localStorage.setItem(this.storageKey, JSON.stringify(assignments));
    return newAssignment;
  }

  async update(id, assignmentData) {
    await this.delay();
    const assignments = await this.getAll();
    const index = assignments.findIndex(assignment => assignment.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    assignments[index] = { 
      ...assignments[index], 
      ...assignmentData,
      pointsPossible: parseInt(assignmentData.pointsPossible),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(assignments));
    return assignments[index];
  }

  async delete(id) {
    await this.delay();
    const assignments = await this.getAll();
    const filteredAssignments = assignments.filter(assignment => assignment.Id !== parseInt(id));
    
    if (filteredAssignments.length === assignments.length) {
      throw new Error("Assignment not found");
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredAssignments));
    return true;
  }
}

export const assignmentService = new AssignmentService();