import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';

const AssignmentModal = ({ assignment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsPossible: '',
    dueDate: '',
    assignmentType: 'Assignment'
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
        name: assignment.name || '',
        description: assignment.description || '',
        pointsPossible: assignment.pointsPossible?.toString() || '',
        dueDate: assignment.dueDate || '',
        assignmentType: assignment.assignmentType || 'Assignment'
      });
    }
  }, [assignment]);

  const assignmentTypes = [
    'Assignment',
    'Quiz',
    'Test',
    'Exam',
    'Project',
    'Homework',
    'Discussion',
    'Lab',
    'Presentation'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Assignment name is required';
    }

    if (!formData.pointsPossible) {
      newErrors.pointsPossible = 'Points possible is required';
    } else if (isNaN(formData.pointsPossible) || parseInt(formData.pointsPossible) <= 0) {
      newErrors.pointsPossible = 'Points possible must be a positive number';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error('Failed to save assignment:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {assignment ? 'Edit Assignment' : 'Add Assignment'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <Label htmlFor="name">Assignment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter assignment name"
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter assignment description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pointsPossible">Points Possible *</Label>
                <Input
                  id="pointsPossible"
                  type="number"
                  min="1"
                  value={formData.pointsPossible}
                  onChange={(e) => handleInputChange('pointsPossible', e.target.value)}
                  placeholder="100"
                  className={errors.pointsPossible ? 'border-red-300' : ''}
                />
                {errors.pointsPossible && (
                  <p className="mt-1 text-sm text-red-600">{errors.pointsPossible}</p>
                )}
              </div>

              <div>
                <Label htmlFor="assignmentType">Type</Label>
                <Select
                  id="assignmentType"
                  value={formData.assignmentType}
                  onChange={(e) => handleInputChange('assignmentType', e.target.value)}
                >
                  {assignmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={errors.dueDate ? 'border-red-300' : ''}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                {assignment ? 'Update Assignment' : 'Create Assignment'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssignmentModal;