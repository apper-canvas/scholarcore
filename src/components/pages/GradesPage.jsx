import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import AssignmentModal from '@/components/organisms/AssignmentModal';
import GradeCell from '@/components/molecules/GradeCell';
import { classService } from '@/services/api/classService';
import { studentService } from '@/services/api/studentService';
import { assignmentService } from '@/services/api/assignmentService';
import { gradeService } from '@/services/api/gradeService';
import { cn } from '@/utils/cn';

const GradesPage = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadClassData();
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const classData = await classService.getAll();
      setClasses(classData);
      if (classData.length > 0) {
        setSelectedClass(classData[0]);
      }
    } catch (err) {
      setError('Failed to load classes');
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = async () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getStudentsByClass(selectedClass.Id),
        assignmentService.getByClass(selectedClass.Id),
        gradeService.getByClass(selectedClass.Id)
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError('Failed to load class data');
      toast.error('Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (classId) => {
    const selected = classes.find(c => c.Id === parseInt(classId));
    setSelectedClass(selected);
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setShowAssignmentModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.Id, {
          ...assignmentData,
          classId_c: selectedClass.Id
        });
        toast.success('Assignment updated successfully');
      } else {
        await assignmentService.create({
          ...assignmentData,
          classId_c: selectedClass.Id
        });
        toast.success('Assignment created successfully');
      }
      
      setShowAssignmentModal(false);
      setEditingAssignment(null);
      loadClassData();
    } catch (err) {
      toast.error('Failed to save assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? All grades for this assignment will be lost.')) {
      return;
    }

    try {
      await assignmentService.delete(assignmentId);
      await gradeService.deleteByAssignment(assignmentId);
      toast.success('Assignment deleted successfully');
      loadClassData();
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };

  const handleGradeChange = async (studentId, assignmentId, score) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const percentage = assignment ? Math.round((score / assignment.pointsPossible_c) * 100) : 0;
      
      const existingGrade = grades.find(g => 
        g.studentId_c === studentId && g.assignmentId_c === assignmentId
      );

      if (existingGrade) {
        await gradeService.update(existingGrade.Id, { score_c: score, percentage_c: percentage });
      } else {
        await gradeService.create({
          studentId_c: studentId,
          assignmentId_c: assignmentId,
          classId_c: selectedClass.Id,
          score_c: score,
          percentage_c: percentage
        });
      }

      loadClassData();
    } catch (err) {
      toast.error('Failed to save grade');
    }
  };
  const getStudentGrade = (studentId, assignmentId) => {
return grades.find(g => g.studentId_c === studentId && g.assignmentId_c === assignmentId);
  };

  const getAssignmentAverage = (assignmentId) => {
    const assignmentGrades = grades.filter(g => g.assignmentId_c === assignmentId);
    if (assignmentGrades.length === 0) return 0;
    
    const sum = assignmentGrades.reduce((acc, grade) => acc + grade.percentage_c, 0);
    return Math.round(sum / assignmentGrades.length);
  };

  const getStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId_c === studentId);
    if (studentGrades.length === 0) return 0;
    
    const sum = studentGrades.reduce((acc, grade) => acc + grade.percentage_c, 0);
    return Math.round(sum / studentGrades.length);
  };

  const handleStudentClick = (student) => {
    navigate('/', { state: { selectedStudent: student } });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClasses} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Grades" 
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <main className="flex-1 p-6">
        <div className="max-w-full mx-auto">
          {/* Class Selector */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="min-w-[200px]">
                <Select
                  value={selectedClass?.Id || ''}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select a class</option>
                  {classes.map(classItem => (
<option key={classItem.Id} value={classItem.Id}>
                       {classItem.subject_c} - {classItem.courseName_c} ({classItem.gradeLevel_c})
                     </option>
                   ))}
                </Select>
              </div>
              {selectedClass && (
                <div className="text-sm text-gray-600">
                  {students.length} students • {assignments.length} assignments
                </div>
              )}
            </div>
            
            {selectedClass && (
              <Button onClick={handleAddAssignment} className="flex items-center gap-2">
                <ApperIcon name="Plus" size={16} />
                Add Assignment
              </Button>
            )}
          </div>

          {!selectedClass ? (
            <Empty 
              icon="BookOpen"
              title="Select a Class"
              description="Choose a class from the dropdown to view and manage grades"
            />
          ) : students.length === 0 ? (
            <Empty 
              icon="Users"
              title="No Students"
              description="This class has no enrolled students"
            />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Grade Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="sticky left-0 bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 min-w-[200px]">
Student
                       </th>
                       {assignments.map(assignment => (
                         <th key={assignment.Id} className="px-4 py-4 text-center text-sm border-r border-gray-200 min-w-[120px]">
                           <div className="space-y-1">
                             <div className="flex items-center justify-center gap-2">
                               <span className="font-semibold text-gray-900">{assignment.Name}</span>
                               <div className="flex items-center gap-1">
                                 <button
                                   onClick={() => handleEditAssignment(assignment)}
                                   className="text-gray-400 hover:text-primary-600 transition-colors"
                                 >
                                   <ApperIcon name="Edit2" size={14} />
                                 </button>
                                 <button
                                   onClick={() => handleDeleteAssignment(assignment.Id)}
                                   className="text-gray-400 hover:text-red-600 transition-colors"
                                 >
                                   <ApperIcon name="Trash2" size={14} />
                                 </button>
                               </div>
                             </div>
                             <div className="text-xs text-gray-500">
                               {assignment.pointsPossible_c} pts
                             </div>
                             <div className="text-xs text-gray-500">
                               Due: {new Date(assignment.dueDate_c).toLocaleDateString()}
                             </div>
                             <div className="text-xs font-medium text-primary-600">
                               Avg: {getAssignmentAverage(assignment.Id)}%
                             </div>
                           </div>
                         </th>
                       ))}
                       <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 min-w-[100px]">
                         Average
                       </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <motion.tr 
                        key={student.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="sticky left-0 bg-white px-6 py-4 border-r border-gray-200 group">
                          <button
                            onClick={() => handleStudentClick(student)}
                            className="flex items-center gap-3 text-left w-full hover:text-primary-600 transition-colors"
                          >
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
{student.firstName_c?.[0]}{student.lastName_c?.[0]}
                               </span>
                             </div>
                             <div>
                               <div className="font-medium text-gray-900 group-hover:text-primary-600">
                                 {student.firstName_c} {student.lastName_c}
                               </div>
                               <div className="text-sm text-gray-500">{student.studentId_c}</div>
                             </div>
                            <ApperIcon name="ExternalLink" size={14} className="text-gray-400 group-hover:text-primary-600" />
                          </button>
                        </td>
                        {assignments.map(assignment => (
                          <td key={assignment.Id} className="px-2 py-4 text-center border-r border-gray-200">
                            <GradeCell
                              grade={getStudentGrade(student.Id, assignment.Id)}
                              assignment={assignment}
                              onGradeChange={(score) => handleGradeChange(student.Id, assignment.Id, score)}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-4 text-center">
                          <div className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium",
                            getStudentAverage(student.Id) >= 90 ? "bg-green-100 text-green-800" :
                            getStudentAverage(student.Id) >= 80 ? "bg-blue-100 text-blue-800" :
                            getStudentAverage(student.Id) >= 70 ? "bg-yellow-100 text-yellow-800" :
                            getStudentAverage(student.Id) >= 60 ? "bg-orange-100 text-orange-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {getStudentAverage(student.Id)}%
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showAssignmentModal && (
          <AssignmentModal
            assignment={editingAssignment}
            onSave={handleSaveAssignment}
            onClose={() => {
              setShowAssignmentModal(false);
              setEditingAssignment(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradesPage;