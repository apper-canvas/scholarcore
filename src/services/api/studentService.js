import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.storageKey = "scholar-hub-students";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(studentsData));
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
    const students = await this.getAll();
    return students.find(student => student.Id === parseInt(id));
  }

  async getStudentsByClass(classId) {
    await this.delay();
    const students = await this.getAll();
    const { classService } = await import('./classService');
    const classData = await classService.getById(classId);
    
    if (!classData || !classData.enrolledStudents) {
      return [];
    }
    
    return students.filter(student => 
      classData.enrolledStudents.includes(student.Id)
    );
  }

  async create(studentData) {
    await this.delay();
    const students = await this.getAll();
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    students.push(newStudent);
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return newStudent;
  }

  async update(id, studentData) {
    await this.delay();
    const students = await this.getAll();
    const index = students.findIndex(student => student.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    students[index] = { 
      ...students[index], 
      ...studentData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return students[index];
  }

  async delete(id) {
    await this.delay();
    const students = await this.getAll();
    const filteredStudents = students.filter(student => student.Id !== parseInt(id));
    
    if (filteredStudents.length === students.length) {
      throw new Error("Student not found");
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredStudents));
    return true;
  }
}

export const studentService = new StudentService();

class StudentService {
  constructor() {
    this.storageKey = "scholar-hub-students";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(studentsData));
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
    const students = await this.getAll();
    return students.find(student => student.Id === parseInt(id));
  }

async create(studentData) {
    await this.delay();
    const students = await this.getAll();
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    
    // Generate student ID if not provided
    const studentId = studentData.studentId || `STU${String(maxId + 1).padStart(4, '0')}`;
    
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      studentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    students.push(newStudent);
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return newStudent;
  }

async update(id, studentData) {
    await this.delay();
    const students = await this.getAll();
    const index = students.findIndex(student => student.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    students[index] = { 
      ...students[index], 
      ...studentData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return students[index];
  }

  async delete(id) {
    await this.delay();
    const students = await this.getAll();
    const filteredStudents = students.filter(student => student.Id !== parseInt(id));
    
    if (filteredStudents.length === students.length) {
      throw new Error("Student not found");
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredStudents));
    return true;
  }
}

export const studentService = new StudentService();