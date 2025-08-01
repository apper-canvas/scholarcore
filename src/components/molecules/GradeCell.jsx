import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

const GradeCell = ({ grade, assignment, onGradeChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (grade) {
      setInputValue(grade.score?.toString() || '');
    } else {
      setInputValue('');
    }
  }, [grade]);

  const handleCellClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setInputValue(value);
    }
  };

  const handleSave = async () => {
    if (inputValue === '') {
      setIsEditing(false);
      return;
    }

    const score = parseFloat(inputValue);
    if (isNaN(score) || score < 0 || score > assignment.pointsPossible) {
      setInputValue(grade?.score?.toString() || '');
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onGradeChange(score);
      setIsEditing(false);
    } catch (err) {
      setInputValue(grade?.score?.toString() || '');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(grade?.score?.toString() || '');
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-700 bg-green-50';
    if (percentage >= 80) return 'text-blue-700 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-700 bg-yellow-50';
    if (percentage >= 60) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-center p-1">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          min="0"
          max={assignment.pointsPossible}
          step="0.5"
          className="w-16 h-8 text-center text-sm p-1"
          autoFocus
          disabled={saving}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className={cn(
        "cursor-pointer hover:bg-gray-100 transition-colors rounded p-2 min-h-[48px] flex flex-col items-center justify-center gap-1",
        grade && getGradeColor(grade.percentage)
      )}
      onClick={handleCellClick}
    >
      {grade ? (
        <>
          <div className="text-sm font-medium">
            {grade.score}/{assignment.pointsPossible}
          </div>
          <div className="text-xs font-medium">
            {grade.percentage}%
          </div>
        </>
      ) : (
        <div className="text-xs text-gray-400 font-medium">
          Click to grade
        </div>
      )}
    </motion.div>
  );
};

export default GradeCell;