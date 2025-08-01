import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.storageKey = "scholar-hub-classes";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(classesData));
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
    const classes = await this.getAll();
    return classes.find(classItem => classItem.Id === parseInt(id));
  }

  async create(classData) {
    await this.delay();
    const classes = await this.getAll();
    const maxId = classes.length > 0 ? Math.max(...classes.map(c => c.Id)) : 0;
    
    const newClass = {
      ...classData,
      Id: maxId + 1,
      enrolledStudents: classData.enrolledStudents || [],
      enrolledCount: classData.enrolledStudents?.length || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    classes.push(newClass);
    localStorage.setItem(this.storageKey, JSON.stringify(classes));
    return newClass;
  }

  async update(id, classData) {
    await this.delay();
    const classes = await this.getAll();
    const index = classes.findIndex(classItem => classItem.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    classes[index] = { 
      ...classes[index], 
      ...classData,
      enrolledCount: classData.enrolledStudents?.length || classes[index].enrolledCount,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(classes));
    return classes[index];
  }

  async delete(id) {
    await this.delay();
    const classes = await this.getAll();
    const filteredClasses = classes.filter(classItem => classItem.Id !== parseInt(id));
    
    if (filteredClasses.length === classes.length) {
      throw new Error("Class not found");
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredClasses));
    return true;
  }

  async enrollStudent(classId, studentId) {
    await this.delay();
    const classItem = await this.getById(classId);
    if (!classItem) {
      throw new Error("Class not found");
    }
    
    if (classItem.enrolledStudents.includes(parseInt(studentId))) {
      throw new Error("Student already enrolled");
    }
    
    if (classItem.enrolledStudents.length >= classItem.capacity) {
      throw new Error("Class is at full capacity");
    }
    
    classItem.enrolledStudents.push(parseInt(studentId));
    return await this.update(classId, classItem);
  }

  async unenrollStudent(classId, studentId) {
    await this.delay();
    const classItem = await this.getById(classId);
    if (!classItem) {
      throw new Error("Class not found");
    }
    
    const studentIndex = classItem.enrolledStudents.indexOf(parseInt(studentId));
    if (studentIndex === -1) {
      throw new Error("Student not enrolled in this class");
    }
    
    classItem.enrolledStudents.splice(studentIndex, 1);
    return await this.update(classId, classItem);
  }
}

export const classService = new ClassService();