class GradeService {
  constructor() {
    this.storageKey = "scholar-hub-grades";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const initialGrades = [
        {
          Id: 1,
          studentId: 1,
          assignmentId: 1,
          classId: 1,
          score: 23,
          percentage: 92,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          Id: 2,
          studentId: 2,
          assignmentId: 1,
          classId: 1,
          score: 20,
          percentage: 80,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(initialGrades));
    }
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async getById(id) {
    await this.delay();
    const grades = await this.getAll();
    return grades.find(grade => grade.Id === parseInt(id));
  }

  async getByClass(classId) {
    await this.delay();
    const grades = await this.getAll();
    return grades.filter(grade => grade.classId === parseInt(classId));
  }

  async getByStudent(studentId) {
    await this.delay();
    const grades = await this.getAll();
    return grades.filter(grade => grade.studentId === parseInt(studentId));
  }

  async getByAssignment(assignmentId) {
    await this.delay();
    const grades = await this.getAll();
    return grades.filter(grade => grade.assignmentId === parseInt(assignmentId));
  }

  async create(gradeData) {
    await this.delay();
    const grades = await this.getAll();
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
    
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      score: parseFloat(gradeData.score),
      percentage: parseInt(gradeData.percentage),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    grades.push(newGrade);
    localStorage.setItem(this.storageKey, JSON.stringify(grades));
    return newGrade;
  }

  async update(id, gradeData) {
    await this.delay();
    const grades = await this.getAll();
    const index = grades.findIndex(grade => grade.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    grades[index] = { 
      ...grades[index], 
      ...gradeData,
      score: parseFloat(gradeData.score),
      percentage: parseInt(gradeData.percentage),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(grades));
    return grades[index];
  }

  async delete(id) {
    await this.delay();
    const grades = await this.getAll();
    const filteredGrades = grades.filter(grade => grade.Id !== parseInt(id));
    
    if (filteredGrades.length === grades.length) {
      throw new Error("Grade not found");
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredGrades));
    return true;
  }

  async deleteByAssignment(assignmentId) {
    await this.delay();
    const grades = await this.getAll();
    const filteredGrades = grades.filter(grade => grade.assignmentId !== parseInt(assignmentId));
    localStorage.setItem(this.storageKey, JSON.stringify(filteredGrades));
    return true;
  }

  async deleteByStudent(studentId) {
    await this.delay();
    const grades = await this.getAll();
    const filteredGrades = grades.filter(grade => grade.studentId !== parseInt(studentId));
    localStorage.setItem(this.storageKey, JSON.stringify(filteredGrades));
    return true;
  }
}

export const gradeService = new GradeService();