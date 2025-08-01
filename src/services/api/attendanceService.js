class AttendanceService {
  constructor() {
    this.storageKey = "scholar-hub-attendance";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
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
    const attendanceRecords = await this.getAll();
    return attendanceRecords.find(record => record.Id === parseInt(id));
  }

  async getAttendanceByDate(date) {
    await this.delay();
    const attendanceRecords = await this.getAll();
    return attendanceRecords.filter(record => record.date === date);
  }

  async getAttendanceByClass(classId) {
    await this.delay();
    const attendanceRecords = await this.getAll();
    return attendanceRecords.filter(record => record.classId === parseInt(classId));
  }

  async getAttendanceByDateAndClass(date, classId) {
    await this.delay();
    const attendanceRecords = await this.getAll();
    return attendanceRecords.filter(record => 
      record.date === date && record.classId === parseInt(classId)
    );
  }

  async getAttendanceByStudent(studentId) {
    await this.delay();
    const attendanceRecords = await this.getAll();
    return attendanceRecords.filter(record => record.studentId === parseInt(studentId));
  }

  async saveAttendance(attendanceRecords) {
    await this.delay();
    
    if (!Array.isArray(attendanceRecords)) {
      throw new Error("Attendance records must be an array");
    }

    const allRecords = await this.getAll();
    
    // Remove existing records for the same date and class
    const firstRecord = attendanceRecords[0];
    if (!firstRecord) {
      throw new Error("No attendance records provided");
    }

    const filteredRecords = allRecords.filter(record => 
      !(record.date === firstRecord.date && record.classId === firstRecord.classId)
    );

    // Generate IDs for new records
    const maxId = allRecords.length > 0 ? Math.max(...allRecords.map(r => r.Id || 0)) : 0;
    
    const newRecords = attendanceRecords.map((record, index) => ({
      ...record,
      Id: maxId + index + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const updatedRecords = [...filteredRecords, ...newRecords];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedRecords));
    
    return newRecords;
  }

  async create(attendanceData) {
    await this.delay();
    const records = await this.getAll();
    const maxId = records.length > 0 ? Math.max(...records.map(r => r.Id)) : 0;
    
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    records.push(newRecord);
    localStorage.setItem(this.storageKey, JSON.stringify(records));
    return newRecord;
  }

  async update(id, attendanceData) {
    await this.delay();
    const records = await this.getAll();
    const index = records.findIndex(record => record.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    records[index] = { 
      ...records[index], 
      ...attendanceData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(records));
    return records[index];
  }

  async delete(id) {
    await this.delay();
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.Id !== parseInt(id));
    
    if (filteredRecords.length === records.length) {
      throw new Error("Attendance record not found");
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredRecords));
    return true;
  }

  async deleteByDateAndClass(date, classId) {
    await this.delay();
    const records = await this.getAll();
    const filteredRecords = records.filter(record => 
      !(record.date === date && record.classId === parseInt(classId))
    );
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredRecords));
    return true;
  }
}

export const attendanceService = new AttendanceService();