class ClassService {
  constructor() {
    this.tableName = 'class_c';
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
          { field: { Name: "courseName_c" } },
          { field: { Name: "courseCode_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "gradeLevel_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "enrolledCount_c" } },
          { field: { Name: "enrolledStudents_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "prerequisites_c" } },
          { field: { Name: "status_c" } }
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
        console.error("Error fetching classes:", error?.response?.data?.message);
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
          { field: { Name: "courseName_c" } },
          { field: { Name: "courseCode_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "gradeLevel_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "enrolledCount_c" } },
          { field: { Name: "enrolledStudents_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "prerequisites_c" } },
          { field: { Name: "status_c" } }
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
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(classData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: classData.courseName_c,
          Tags: classData.Tags || "",
          Owner: classData.Owner || "",
          courseName_c: classData.courseName_c,
          courseCode_c: classData.courseCode_c,
          instructor_c: classData.instructor_c,
          gradeLevel_c: classData.gradeLevel_c,
          subject_c: classData.subject_c,
          room_c: classData.room_c || "",
          schedule_c: classData.schedule_c || "",
          capacity_c: parseInt(classData.capacity_c) || 0,
          enrolledCount_c: parseInt(classData.enrolledCount_c) || 0,
          enrolledStudents_c: classData.enrolledStudents_c || "",
          description_c: classData.description_c || "",
          semester_c: classData.semester_c || "",
          credits_c: parseInt(classData.credits_c) || 0,
          prerequisites_c: classData.prerequisites_c || "",
          status_c: classData.status_c || "Active"
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
          console.error(`Failed to create classes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, classData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: classData.courseName_c,
          Tags: classData.Tags,
          Owner: classData.Owner,
          courseName_c: classData.courseName_c,
          courseCode_c: classData.courseCode_c,
          instructor_c: classData.instructor_c,
          gradeLevel_c: classData.gradeLevel_c,
          subject_c: classData.subject_c,
          room_c: classData.room_c,
          schedule_c: classData.schedule_c,
          capacity_c: classData.capacity_c ? parseInt(classData.capacity_c) : undefined,
          enrolledCount_c: classData.enrolledCount_c ? parseInt(classData.enrolledCount_c) : undefined,
          enrolledStudents_c: classData.enrolledStudents_c,
          description_c: classData.description_c,
          semester_c: classData.semester_c,
          credits_c: classData.credits_c ? parseInt(classData.credits_c) : undefined,
          prerequisites_c: classData.prerequisites_c,
          status_c: classData.status_c
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
          console.error(`Failed to update classes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating class:", error?.response?.data?.message);
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
          console.error(`Failed to delete classes ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async enrollStudent(classId, studentId) {
    try {
      await this.delay();
      const classItem = await this.getById(classId);
      if (!classItem) {
        throw new Error("Class not found");
      }
      
      const currentStudents = classItem.enrolledStudents_c ? classItem.enrolledStudents_c.split(',').map(id => id.trim()) : [];
      
      if (currentStudents.includes(studentId.toString())) {
        throw new Error("Student already enrolled");
      }
      
      if (currentStudents.length >= classItem.capacity_c) {
        throw new Error("Class is at full capacity");
      }
      
      currentStudents.push(studentId.toString());
      
      return await this.update(classId, {
        enrolledStudents_c: currentStudents.join(','),
        enrolledCount_c: currentStudents.length
      });
    } catch (error) {
      throw error;
    }
  }

  async unenrollStudent(classId, studentId) {
    try {
      await this.delay();
      const classItem = await this.getById(classId);
      if (!classItem) {
        throw new Error("Class not found");
      }
      
      const currentStudents = classItem.enrolledStudents_c ? classItem.enrolledStudents_c.split(',').map(id => id.trim()) : [];
      const studentIndex = currentStudents.indexOf(studentId.toString());
      
      if (studentIndex === -1) {
        throw new Error("Student not enrolled in this class");
      }
      
      currentStudents.splice(studentIndex, 1);
      
      return await this.update(classId, {
        enrolledStudents_c: currentStudents.join(','),
        enrolledCount_c: currentStudents.length
      });
    } catch (error) {
      throw error;
    }
  }
}

export const classService = new ClassService();