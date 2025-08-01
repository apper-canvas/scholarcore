class AssignmentService {
  constructor() {
    this.tableName = 'assignment_c';
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
          { field: { Name: "description_c" } },
          { field: { Name: "pointsPossible_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "assignmentType_c" } },
          { field: { Name: "classId_c" } }
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
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "description_c" } },
          { field: { Name: "pointsPossible_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "assignmentType_c" } },
          { field: { Name: "classId_c" } }
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
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "description_c" } },
          { field: { Name: "pointsPossible_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "assignmentType_c" } },
          { field: { Name: "classId_c" } }
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
        console.error("Error fetching assignments by class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(assignmentData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: assignmentData.name || assignmentData.Name,
          Tags: assignmentData.Tags || "",
          Owner: assignmentData.Owner || "",
          description_c: assignmentData.description || assignmentData.description_c || "",
          pointsPossible_c: parseInt(assignmentData.pointsPossible || assignmentData.pointsPossible_c),
          dueDate_c: assignmentData.dueDate || assignmentData.dueDate_c,
          assignmentType_c: assignmentData.assignmentType || assignmentData.assignmentType_c || "Assignment",
          classId_c: parseInt(assignmentData.classId || assignmentData.classId_c)
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
          console.error(`Failed to create assignments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      await this.delay();
      
      // Only include Updateable fields in update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.name || assignmentData.Name,
          Tags: assignmentData.Tags,
          Owner: assignmentData.Owner,
          description_c: assignmentData.description || assignmentData.description_c,
          pointsPossible_c: assignmentData.pointsPossible ? parseInt(assignmentData.pointsPossible) : assignmentData.pointsPossible_c ? parseInt(assignmentData.pointsPossible_c) : undefined,
          dueDate_c: assignmentData.dueDate || assignmentData.dueDate_c,
          assignmentType_c: assignmentData.assignmentType || assignmentData.assignmentType_c,
          classId_c: assignmentData.classId ? parseInt(assignmentData.classId) : assignmentData.classId_c ? parseInt(assignmentData.classId_c) : undefined
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
          console.error(`Failed to update assignments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating assignment:", error?.response?.data?.message);
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
          console.error(`Failed to delete assignments ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const assignmentService = new AssignmentService();