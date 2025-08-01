class StudentService {
  constructor() {
    this.tableName = 'student_c';
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
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "gradeLevel_c" } },
          { field: { Name: "enrollmentStatus_c" } },
          { field: { Name: "enrollmentDate_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardianName_c" } },
          { field: { Name: "guardianPhone_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "dateOfBirth_c" } },
          { field: { Name: "guardianRelationship_c" } },
          { field: { Name: "guardianEmail_c" } },
          { field: { Name: "streetAddress_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zipCode_c" } }
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
        console.error("Error fetching students:", error?.response?.data?.message);
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
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "gradeLevel_c" } },
          { field: { Name: "enrollmentStatus_c" } },
          { field: { Name: "enrollmentDate_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardianName_c" } },
          { field: { Name: "guardianPhone_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "dateOfBirth_c" } },
          { field: { Name: "guardianRelationship_c" } },
          { field: { Name: "guardianEmail_c" } },
          { field: { Name: "streetAddress_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zipCode_c" } }
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
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getStudentsByClass(classId) {
    try {
      await this.delay();
      const { classService } = await import('./classService');
      const classData = await classService.getById(classId);
      
      if (!classData || !classData.enrolledStudents_c) {
        return [];
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "gradeLevel_c" } },
          { field: { Name: "enrollmentStatus_c" } },
          { field: { Name: "email_c" } }
        ],
        where: [
          {
            FieldName: "Id",
            Operator: "ExactMatch",
            Values: classData.enrolledStudents_c.split(',').map(id => parseInt(id.trim())),
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
        console.error("Error fetching students by class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(studentData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: `${studentData.firstName_c} ${studentData.lastName_c}`,
          Tags: studentData.Tags || "",
          Owner: studentData.Owner || "",
          firstName_c: studentData.firstName_c,
          lastName_c: studentData.lastName_c,
          studentId_c: studentData.studentId_c || `STU${Date.now()}`,
          gradeLevel_c: parseInt(studentData.gradeLevel_c),
          enrollmentStatus_c: studentData.enrollmentStatus_c || "Active",
          enrollmentDate_c: studentData.enrollmentDate_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c || "",
          address_c: studentData.address_c || "",
          guardianName_c: studentData.guardianName_c,
          guardianPhone_c: studentData.guardianPhone_c,
          notes_c: studentData.notes_c || "",
          dateOfBirth_c: studentData.dateOfBirth_c,
          guardianRelationship_c: studentData.guardianRelationship_c || "Parent",
          guardianEmail_c: studentData.guardianEmail_c || "",
          streetAddress_c: studentData.streetAddress_c || "",
          city_c: studentData.city_c || "",
          state_c: studentData.state_c || "",
          zipCode_c: studentData.zipCode_c || ""
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
          console.error(`Failed to create students ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, studentData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: studentData.firstName_c && studentData.lastName_c ? `${studentData.firstName_c} ${studentData.lastName_c}` : undefined,
          Tags: studentData.Tags,
          Owner: studentData.Owner,
          firstName_c: studentData.firstName_c,
          lastName_c: studentData.lastName_c,
          studentId_c: studentData.studentId_c,
          gradeLevel_c: studentData.gradeLevel_c ? parseInt(studentData.gradeLevel_c) : undefined,
          enrollmentStatus_c: studentData.enrollmentStatus_c,
          enrollmentDate_c: studentData.enrollmentDate_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          address_c: studentData.address_c,
          guardianName_c: studentData.guardianName_c,
          guardianPhone_c: studentData.guardianPhone_c,
          notes_c: studentData.notes_c,
          dateOfBirth_c: studentData.dateOfBirth_c,
          guardianRelationship_c: studentData.guardianRelationship_c,
          guardianEmail_c: studentData.guardianEmail_c,
          streetAddress_c: studentData.streetAddress_c,
          city_c: studentData.city_c,
          state_c: studentData.state_c,
          zipCode_c: studentData.zipCode_c
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
          console.error(`Failed to update students ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating student:", error?.response?.data?.message);
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
          console.error(`Failed to delete students ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const studentService = new StudentService();