import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const StudentModal = ({ isOpen, onClose, onSave, student = null }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    gradeLevel: "",
    enrollmentStatus: "Active",
    enrollmentDate: new Date().toISOString().split("T")[0],
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        studentId: student.studentId || "",
        gradeLevel: student.gradeLevel?.toString() || "",
        enrollmentStatus: student.enrollmentStatus || "Active",
        enrollmentDate: student.enrollmentDate || new Date().toISOString().split("T")[0],
        email: student.email || "",
        phone: student.phone || "",
        address: student.address || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        notes: student.notes || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        studentId: "",
        gradeLevel: "",
        enrollmentStatus: "Active",
        enrollmentDate: new Date().toISOString().split("T")[0],
        email: "",
        phone: "",
        address: "",
        guardianName: "",
        guardianPhone: "",
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
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.gradeLevel) newErrors.gradeLevel = "Grade level is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required";
    
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
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

          <form onSubmit={handleSubmit} className="p-6">
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
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                error={errors.studentId}
                required
              />

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

              <FormField
                label="Enrollment Status"
                type="select"
                name="enrollmentStatus"
                value={formData.enrollmentStatus}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </FormField>

              <FormField
                label="Enrollment Date"
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleInputChange}
              />

              <FormField
                label="Guardian Name"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                error={errors.guardianName}
                required
                className="md:col-span-1"
              />

              <FormField
                label="Guardian Phone"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                error={errors.guardianPhone}
                required
              />

              <FormField
                label="Address"
                type="textarea"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="md:col-span-2"
              />

              <FormField
                label="Notes"
                type="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="md:col-span-2"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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