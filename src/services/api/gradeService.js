class GradeService {
  constructor() {
    this.tableName = 'grade_c';
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async delay(ms = 200) {
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
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "percentage_c" } }
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
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "percentage_c" } }
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
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByClass(classId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "percentage_c" } }
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
        console.error("Error fetching grades by class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByStudent(studentId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "percentage_c" } }
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
        console.error("Error fetching grades by student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByAssignment(assignmentId) {
    try {
      await this.delay();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "percentage_c" } }
        ],
        where: [
          {
            FieldName: "assignmentId_c",
            Operator: "EqualTo",
            Values: [parseInt(assignmentId)],
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
        console.error("Error fetching grades by assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(gradeData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: `Grade for Student ${gradeData.studentId || gradeData.studentId_c}`,
          Tags: gradeData.Tags || "",
          Owner: gradeData.Owner || "",
          studentId_c: parseInt(gradeData.studentId || gradeData.studentId_c),
          assignmentId_c: parseInt(gradeData.assignmentId || gradeData.assignmentId_c),
          classId_c: parseInt(gradeData.classId || gradeData.classId_c),
          score_c: parseFloat(gradeData.score || gradeData.score_c),
          percentage_c: parseInt(gradeData.percentage || gradeData.percentage_c)
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
          console.error(`Failed to create grades ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, gradeData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: gradeData.studentId || gradeData.studentId_c ? `Grade for Student ${gradeData.studentId || gradeData.studentId_c}` : undefined,
          Tags: gradeData.Tags,
          Owner: gradeData.Owner,
          studentId_c: gradeData.studentId ? parseInt(gradeData.studentId) : gradeData.studentId_c ? parseInt(gradeData.studentId_c) : undefined,
          assignmentId_c: gradeData.assignmentId ? parseInt(gradeData.assignmentId) : gradeData.assignmentId_c ? parseInt(gradeData.assignmentId_c) : undefined,
          classId_c: gradeData.classId ? parseInt(gradeData.classId) : gradeData.classId_c ? parseInt(gradeData.classId_c) : undefined,
          score_c: gradeData.score !== undefined ? parseFloat(gradeData.score) : gradeData.score_c !== undefined ? parseFloat(gradeData.score_c) : undefined,
          percentage_c: gradeData.percentage !== undefined ? parseInt(gradeData.percentage) : gradeData.percentage_c !== undefined ? parseInt(gradeData.percentage_c) : undefined
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
          console.error(`Failed to update grades ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating grade:", error?.response?.data?.message);
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
          console.error(`Failed to delete grades ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async deleteByAssignment(assignmentId) {
    try {
      await this.delay();
      const grades = await this.getByAssignment(assignmentId);
      if (grades.length === 0) return true;
      
      const recordIds = grades.map(grade => grade.Id);
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
        console.error("Error deleting grades by assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async deleteByStudent(studentId) {
    try {
      await this.delay();
      const grades = await this.getByStudent(studentId);
      if (grades.length === 0) return true;
      
      const recordIds = grades.map(grade => grade.Id);
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
        console.error("Error deleting grades by student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const gradeService = new GradeService();