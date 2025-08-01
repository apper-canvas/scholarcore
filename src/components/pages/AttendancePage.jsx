import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { classService } from '@/services/api/classService';
import { studentService } from '@/services/api/studentService';
import { attendanceService } from '@/services/api/attendanceService';

const AttendancePage = ({ onMobileMenuToggle }) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedClassId) {
      loadAttendanceData();
    }
  }, [selectedDate, selectedClassId]);

  const loadClasses = async () => {
try {
      setLoading(true);
      const classesData = await classService.getAll();
      setClasses(classesData.filter(cls => cls.status_c === 'Active'));
    } catch (error) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Load students and enrolled students for selected class
      const [allStudents, selectedClass] = await Promise.all([
        studentService.getAll(),
        classService.getById(selectedClassId)
      ]);

      if (!selectedClass) {
        toast.error('Selected class not found');
        return;
      }

      const enrolledIds = selectedClass.enrolledStudents_c ? selectedClass.enrolledStudents_c.split(',').map(id => parseInt(id.trim())) : [];
      const enrolledStudentsList = allStudents.filter(student => 
        enrolledIds.includes(student.Id) && 
        student.enrollmentStatus_c === 'Active'
      );

      setStudents(allStudents);
      setEnrolledStudents(enrolledStudentsList);

      // Load existing attendance for this date and class
      const existingAttendance = await attendanceService.getAttendanceByDateAndClass(
        selectedDate, 
        parseInt(selectedClassId)
      );

      // Initialize attendance state
      const attendanceState = {};
      enrolledStudentsList.forEach(student => {
        const existing = existingAttendance.find(record => record.studentId_c === student.Id);
        attendanceState[student.Id] = existing ? existing.status_c : 'Present';
      });

      setAttendance(attendanceState);
    } catch (error) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const newAttendance = {};
    enrolledStudents.forEach(student => {
      newAttendance[student.Id] = 'Present';
    });
    setAttendance(newAttendance);
    toast.success('All students marked as present');
  };

  const handleResetAttendance = () => {
    const newAttendance = {};
    enrolledStudents.forEach(student => {
      newAttendance[student.Id] = 'Present';
    });
    setAttendance(newAttendance);
    toast.success('Attendance reset to default');
  };

const handleSaveAttendance = async () => {
    if (!selectedDate || !selectedClassId || enrolledStudents.length === 0) {
      toast.error('Please select a date and class with enrolled students');
      return;
    }

    try {
      setSaving(true);
      
      const attendanceRecords = enrolledStudents.map(student => ({
        studentId_c: student.Id,
        classId_c: parseInt(selectedClassId),
        date_c: selectedDate,
        status_c: attendance[student.Id] || 'Present',
        timestamp_c: new Date().toISOString()
      }));

      await attendanceService.saveAttendance(attendanceRecords);
      toast.success(`Attendance saved for ${format(new Date(selectedDate), 'MMM dd, yyyy')}`);
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const selectedClass = classes.find(cls => cls.Id === parseInt(selectedClassId));

  const getStatusBadge = (status) => {
    const styles = {
      Present: 'bg-green-100 text-green-800 border-green-200',
      Absent: 'bg-red-100 text-red-800 border-red-200',
      Tardy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Excused: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
              <p className="text-gray-600">Monitor student attendance and participation</p>
            </div>
          </div>
          <ApperIcon name="Calendar" size={24} className="text-primary-600" />
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <Select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full"
            >
              <option value="">Choose a class...</option>
{classes.map(cls => (
                 <option key={cls.Id} value={cls.Id}>
                   {cls.courseName_c} - {cls.instructor_c}
                 </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Selected Class Info */}
        {selectedClass && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-900">
                  {selectedClass.courseName} ({selectedClass.courseCode})
                </h3>
                <p className="text-primary-700 text-sm">
                  {selectedClass.instructor} • {selectedClass.room} • {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-primary-900 font-medium">
                  {enrolledStudents.length} Students
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-gray-600">Loading attendance data...</span>
            </div>
          </div>
        ) : !selectedClassId ? (
          <div className="text-center py-12">
            <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Date and Class</h3>
            <p className="text-gray-600">Choose a date and class to view and manage attendance</p>
          </div>
        ) : enrolledStudents.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h3>
            <p className="text-gray-600">There are no active students enrolled in this class</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleMarkAllPresent}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ApperIcon name="Check" size={16} />
                Mark All Present
              </Button>
              <Button
                onClick={handleResetAttendance}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ApperIcon name="RotateCcw" size={16} />
                Reset
              </Button>
              <Button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="flex items-center gap-2 ml-auto"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ApperIcon name="Save" size={16} />
                )}
                Save Attendance
              </Button>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
{enrolledStudents.map(student => (
                       <tr key={student.Id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center">
                             <div className="flex-shrink-0 h-10 w-10">
                               <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                 <ApperIcon name="User" size={16} className="text-gray-500" />
                               </div>
                             </div>
                             <div className="ml-4">
                               <div className="text-sm font-medium text-gray-900">
                                 {student.firstName_c} {student.lastName_c}
                               </div>
                               <div className="text-sm text-gray-500">
                                 {student.email_c}
                               </div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {student.studentId_c}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Grade {student.gradeLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(attendance[student.Id] || 'Present')}
                            <div className="flex gap-1">
                              {['Present', 'Absent', 'Tardy', 'Excused'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleAttendanceChange(student.Id, status)}
                                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                                    attendance[student.Id] === status
                                      ? 'bg-primary-600 text-white border-primary-600'
                                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-300 hover:text-primary-600'
                                  }`}
                                >
                                  {status.charAt(0)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;