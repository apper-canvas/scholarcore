import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const StudentModal = ({ isOpen, onClose, onSave, student = null }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    studentId: "",
    email: "",
    phone: "",
    gradeLevel: "",
    enrollmentStatus: "Active",
    enrollmentDate: new Date().toISOString().split("T")[0],
    guardianName: "",
    guardianRelationship: "Parent",
    guardianPhone: "",
    guardianEmail: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        dateOfBirth: student.dateOfBirth || "",
        studentId: student.studentId || "",
        email: student.email || "",
        phone: student.phone || "",
        gradeLevel: student.gradeLevel?.toString() || "",
        enrollmentStatus: student.enrollmentStatus || "Active",
        enrollmentDate: student.enrollmentDate || new Date().toISOString().split("T")[0],
        guardianName: student.guardianName || "",
        guardianRelationship: student.guardianRelationship || "Parent",
        guardianPhone: student.guardianPhone || "",
        guardianEmail: student.guardianEmail || "",
        streetAddress: student.streetAddress || "",
        city: student.city || "",
        state: student.state || "",
        zipCode: student.zipCode || "",
        notes: student.notes || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        studentId: "",
        email: "",
        phone: "",
        gradeLevel: "",
        enrollmentStatus: "Active",
        enrollmentDate: new Date().toISOString().split("T")[0],
        guardianName: "",
        guardianRelationship: "Parent",
        guardianPhone: "",
        guardianEmail: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        notes: ""
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    // Academic Details
    if (!formData.gradeLevel) newErrors.gradeLevel = "Grade level is required";
    
    // Guardian Information
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required";
    if (formData.guardianEmail.trim() && !/\S+@\S+\.\S+/.test(formData.guardianEmail)) {
      newErrors.guardianEmail = "Guardian email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const studentData = {
      ...formData,
      gradeLevel: parseInt(formData.gradeLevel),
      Id: student?.Id
    };

    onSave(studentData);
    onClose();
  };

  if (!isOpen) return null;

return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {student ? "Edit Student" : "Add New Student"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="User" className="h-5 w-5 mr-2 text-primary-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                />
                
                <FormField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                />

                <FormField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={errors.dateOfBirth}
                  required
                />

                <FormField
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  error={errors.studentId}
                  placeholder={student ? "" : "Auto-generated"}
                  disabled={!!student}
                />

                <FormField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />

                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Academic Details Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="BookOpen" className="h-5 w-5 mr-2 text-primary-600" />
                Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Grade Level"
                  type="select"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  error={errors.gradeLevel}
                  required
                >
                  <option value="">Select Grade</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </FormField>

                <FormField
                  label="Enrollment Date"
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleInputChange}
                />

                <FormField
                  label="Student Status"
                  type="select"
                  name="enrollmentStatus"
                  value={formData.enrollmentStatus}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </FormField>
              </div>
            </div>

            {/* Guardian Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Users" className="h-5 w-5 mr-2 text-primary-600" />
                Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Primary Guardian Name"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  error={errors.guardianName}
                  required
                />

                <FormField
                  label="Relationship"
                  type="select"
                  name="guardianRelationship"
                  value={formData.guardianRelationship}
                  onChange={handleInputChange}
                >
                  <option value="Parent">Parent</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Other">Other</option>
                </FormField>

                <FormField
                  label="Guardian Phone"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  error={errors.guardianPhone}
                  required
                />

                <FormField
                  label="Guardian Email"
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  error={errors.guardianEmail}
                />
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="MapPin" className="h-5 w-5 mr-2 text-primary-600" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Street Address"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  className="md:col-span-2"
                />

                <FormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />

                <FormField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />

                <FormField
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <FormField
                label="Additional Notes"
                type="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information about the student..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {student ? "Update Student" : "Add Student"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentModal;