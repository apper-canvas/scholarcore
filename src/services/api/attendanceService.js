class AttendanceService {
  constructor() {
    this.tableName = 'attendance_c';
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timestamp_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timestamp_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getAttendanceByDate(date) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getAttendanceByClass(classId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "classId_c",
            Operator: "EqualTo",
            Values: [parseInt(classId)],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getAttendanceByDateAndClass(date, classId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date],
            Include: true
          },
          {
            FieldName: "classId_c",
            Operator: "EqualTo",
            Values: [parseInt(classId)],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date and class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getAttendanceByStudent(studentId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "studentId_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async saveAttendance(attendanceRecords) {
    try {
      await this.delay();
      
      if (!Array.isArray(attendanceRecords)) {
        throw new Error("Attendance records must be an array");
      }

      if (attendanceRecords.length === 0) {
        throw new Error("No attendance records provided");
      }

      // First, delete existing records for the same date and class
      const firstRecord = attendanceRecords[0];
      await this.deleteByDateAndClass(firstRecord.date || firstRecord.date_c, firstRecord.classId || firstRecord.classId_c);

      // Create new records
      const recordsToCreate = attendanceRecords.map(record => ({
        Name: `Attendance for Student ${record.studentId || record.studentId_c}`,
        Tags: record.Tags || "",
        Owner: record.Owner || "",
        studentId_c: parseInt(record.studentId || record.studentId_c),
        classId_c: parseInt(record.classId || record.classId_c),
        date_c: record.date || record.date_c,
        status_c: record.status || record.status_c,
        timestamp_c: record.timestamp || record.timestamp_c || new Date().toISOString()
      }));

      const params = {
        records: recordsToCreate
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to save attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error saving attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(attendanceData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: `Attendance for Student ${attendanceData.studentId || attendanceData.studentId_c}`,
          Tags: attendanceData.Tags || "",
          Owner: attendanceData.Owner || "",
          studentId_c: parseInt(attendanceData.studentId || attendanceData.studentId_c),
          classId_c: parseInt(attendanceData.classId || attendanceData.classId_c),
          date_c: attendanceData.date || attendanceData.date_c,
          status_c: attendanceData.status || attendanceData.status_c,
          timestamp_c: attendanceData.timestamp || attendanceData.timestamp_c || new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: attendanceData.studentId || attendanceData.studentId_c ? `Attendance for Student ${attendanceData.studentId || attendanceData.studentId_c}` : undefined,
          Tags: attendanceData.Tags,
          Owner: attendanceData.Owner,
          studentId_c: attendanceData.studentId ? parseInt(attendanceData.studentId) : attendanceData.studentId_c ? parseInt(attendanceData.studentId_c) : undefined,
          classId_c: attendanceData.classId ? parseInt(attendanceData.classId) : attendanceData.classId_c ? parseInt(attendanceData.classId_c) : undefined,
          date_c: attendanceData.date || attendanceData.date_c,
          status_c: attendanceData.status || attendanceData.status_c,
          timestamp_c: attendanceData.timestamp || attendanceData.timestamp_c
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      await this.delay();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async deleteByDateAndClass(date, classId) {
    try {
      await this.delay();
      const existingRecords = await this.getAttendanceByDateAndClass(date, classId);
      
      if (existingRecords.length === 0) {
        return true;
      }

      const recordIds = existingRecords.map(record => record.Id);
      const params = {
        RecordIds: recordIds
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance by date and class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const attendanceService = new AttendanceService();