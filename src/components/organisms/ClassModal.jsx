import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const ClassModal = ({ isOpen, onClose, onSave, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    courseName_c: '',
    courseCode_c: '',
    instructor_c: '',
    gradeLevel_c: '',
    subject_c: '',
    room_c: '',
    schedule_c: '',
    capacity_c: '',
    description_c: '',
    semester_c: '',
    credits_c: '',
    prerequisites_c: '',
    status_c: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        courseName_c: initialData.courseName_c || '',
        courseCode_c: initialData.courseCode_c || '',
        instructor_c: initialData.instructor_c || '',
        gradeLevel_c: initialData.gradeLevel_c || '',
        subject_c: initialData.subject_c || '',
        room_c: initialData.room_c || '',
        schedule_c: initialData.schedule_c || '',
        capacity_c: initialData.capacity_c || '',
        description_c: initialData.description_c || '',
        semester_c: initialData.semester_c || '',
        credits_c: initialData.credits_c || '',
        prerequisites_c: initialData.prerequisites_c || '',
        status_c: initialData.status_c || 'Active'
      });
    } else {
      setFormData({
        courseName_c: '',
        courseCode_c: '',
        instructor_c: '',
        gradeLevel_c: '',
        subject_c: '',
        room_c: '',
        schedule_c: '',
        capacity_c: '',
        description_c: '',
        semester_c: '',
        credits_c: '',
        prerequisites_c: '',
        status_c: 'Active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

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
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseName_c.trim()) {
      newErrors.courseName_c = 'Course name is required';
    }
    
    if (!formData.courseCode_c.trim()) {
      newErrors.courseCode_c = 'Course code is required';
    }
    
    if (!formData.instructor_c.trim()) {
      newErrors.instructor_c = 'Instructor is required';
    }
    
    if (!formData.gradeLevel_c.trim()) {
      newErrors.gradeLevel_c = 'Grade level is required';
    }
    
    if (!formData.subject_c.trim()) {
      newErrors.subject_c = 'Subject is required';
    }

    if (formData.capacity_c && (isNaN(formData.capacity_c) || parseInt(formData.capacity_c) < 1)) {
      newErrors.capacity_c = 'Capacity must be a positive number';
    }

    if (formData.credits_c && (isNaN(formData.credits_c) || parseInt(formData.credits_c) < 0)) {
      newErrors.credits_c = 'Credits must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const classData = {
      courseName_c: formData.courseName_c.trim(),
      courseCode_c: formData.courseCode_c.trim(),
      instructor_c: formData.instructor_c.trim(),
      gradeLevel_c: formData.gradeLevel_c.trim(),
      subject_c: formData.subject_c.trim(),
      room_c: formData.room_c.trim(),
      schedule_c: formData.schedule_c.trim(),
      capacity_c: formData.capacity_c ? parseInt(formData.capacity_c) : 0,
      enrolledCount_c: 0,
      enrolledStudents_c: '',
      description_c: formData.description_c.trim(),
      semester_c: formData.semester_c.trim(),
      credits_c: formData.credits_c ? parseInt(formData.credits_c) : 0,
      prerequisites_c: formData.prerequisites_c.trim(),
      status_c: formData.status_c
    };

    onSave(classData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Class' : 'Add New Class'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Course Name"
                name="courseName_c"
                value={formData.courseName_c}
                onChange={handleInputChange}
                error={errors.courseName_c}
                placeholder="Enter course name"
                required
              />

              <FormField
                label="Course Code"
                name="courseCode_c"
                value={formData.courseCode_c}
                onChange={handleInputChange}
                error={errors.courseCode_c}
                placeholder="e.g., MATH101"
                required
              />

              <FormField
                label="Instructor"
                name="instructor_c"
                value={formData.instructor_c}
                onChange={handleInputChange}
                error={errors.instructor_c}
                placeholder="Enter instructor name"
                required
              />

              <FormField
                label="Grade Level"
                name="gradeLevel_c"
                value={formData.gradeLevel_c}
                onChange={handleInputChange}
                error={errors.gradeLevel_c}
                placeholder="e.g., 9th Grade"
                required
              />

              <FormField
                label="Subject"
                name="subject_c"
                value={formData.subject_c}
                onChange={handleInputChange}
                error={errors.subject_c}
                placeholder="e.g., Mathematics"
                required
              />

              <FormField
                label="Room"
                name="room_c"
                value={formData.room_c}
                onChange={handleInputChange}
                error={errors.room_c}
                placeholder="e.g., Room 101"
              />

              <FormField
                label="Schedule"
                name="schedule_c"
                value={formData.schedule_c}
                onChange={handleInputChange}
                error={errors.schedule_c}
                placeholder="e.g., MWF 9:00-10:00 AM"
              />

              <FormField
                label="Capacity"
                name="capacity_c"
                type="number"
                value={formData.capacity_c}
                onChange={handleInputChange}
                error={errors.capacity_c}
                placeholder="Maximum students"
                min="1"
              />

              <FormField
                label="Semester"
                name="semester_c"
                value={formData.semester_c}
                onChange={handleInputChange}
                error={errors.semester_c}
                placeholder="e.g., Fall 2024"
              />

              <FormField
                label="Credits"
                name="credits_c"
                type="number"
                value={formData.credits_c}
                onChange={handleInputChange}
                error={errors.credits_c}
                placeholder="Credit hours"
                min="0"
              />
            </div>

            <FormField
              label="Prerequisites"
              name="prerequisites_c"
              value={formData.prerequisites_c}
              onChange={handleInputChange}
              error={errors.prerequisites_c}
              placeholder="List any prerequisites"
            />

            <FormField
              label="Description"
              name="description_c"
              type="textarea"
              value={formData.description_c}
              onChange={handleInputChange}
              error={errors.description_c}
              placeholder="Course description"
              rows={3}
            />

            <FormField
              label="Status"
              name="status_c"
              type="select"
              value={formData.status_c}
              onChange={handleInputChange}
              error={errors.status_c}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="gap-2"
              >
                <ApperIcon name="Save" size={16} />
                {initialData ? 'Update Class' : 'Create Class'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClassModal;