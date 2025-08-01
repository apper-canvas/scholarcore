import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import ClassTable from "@/components/organisms/ClassTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { cn } from "@/utils/cn";

const ClassesPage = ({ onMobileMenuToggle, onClassCountChange }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  useEffect(() => {
    loadClasses();
    loadStudents();
  }, []);

  useEffect(() => {
    if (onClassCountChange) {
      onClassCountChange(classes.length);
    }
  }, [classes.length, onClassCountChange]);

  useEffect(() => {
    if (selectedClass) {
      loadEnrolledStudents(selectedClass.Id);
    }
  }, [selectedClass, students]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAll();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError("Failed to load classes");
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

const loadEnrolledStudents = async (classId) => {
    try {
      const classData = await classService.getById(classId);
      if (classData && classData.enrolledStudents_c) {
        const enrolledIds = classData.enrolledStudents_c.split(',').map(id => parseInt(id.trim()));
        const enrolled = students.filter(student => 
          enrolledIds.includes(student.Id)
        );
        setEnrolledStudents(enrolled);
      }
    } catch (err) {
      console.error("Failed to load enrolled students:", err);
    }
  };

  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleEnrollStudent = async (studentId) => {
    if (!selectedClass) return;
    
    try {
      await classService.enrollStudent(selectedClass.Id, studentId);
      toast.success("Student enrolled successfully");
      loadClasses();
      loadEnrolledStudents(selectedClass.Id);
    } catch (err) {
      toast.error(err.message || "Failed to enroll student");
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    if (!selectedClass) return;
    
    try {
      await classService.unenrollStudent(selectedClass.Id, studentId);
      toast.success("Student unenrolled successfully");
      loadClasses();
      loadEnrolledStudents(selectedClass.Id);
    } catch (err) {
      toast.error(err.message || "Failed to unenroll student");
    }
  };

const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.courseName_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.instructor_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.courseCode_c?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !filterGrade || classItem.gradeLevel_c === filterGrade;
    const matchesSubject = !filterSubject || classItem.subject_c === filterSubject;
    
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const uniqueGrades = [...new Set(classes.map(c => c.gradeLevel))].sort();
  const uniqueSubjects = [...new Set(classes.map(c => c.subject))].sort();

  const getCapacityColor = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClasses} />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        title="Classes" 
        subtitle="Manage course schedules and assignments"
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Class List */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">All Classes</h2>
                  <p className="text-sm text-gray-500">
                    {filteredClasses.length} of {classes.length} classes
                  </p>
                </div>
                <Button size="sm" className="gap-2">
                  <ApperIcon name="Plus" size={16} />
                  Add Class
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search classes, instructors, or course codes..."
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    value={filterGrade}
                    onChange={setFilterGrade}
                    placeholder="Filter by Grade Level"
                  >
                    <option value="">All Grades</option>
                    {uniqueGrades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </Select>
                  
                  <Select
                    value={filterSubject}
                    onChange={setFilterSubject}
                    placeholder="Filter by Subject"
                  >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Class List */}
            <div className="overflow-y-auto max-h-96">
              {filteredClasses.length === 0 ? (
                <Empty 
                  message="No classes found"
                  description="Try adjusting your search or filters"
                />
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredClasses.map((classItem) => (
                    <motion.div
                      key={classItem.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200",
                        selectedClass?.Id === classItem.Id && "bg-primary-50 border-l-4 border-l-primary-500"
                      )}
                      onClick={() => handleSelectClass(classItem)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
<h3 className="font-medium text-gray-900">{classItem.courseName_c}</h3>
                             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                               {classItem.courseCode_c}
                             </span>
                           </div>
                           <p className="text-sm text-gray-600 mb-1">{classItem.instructor_c}</p>
                           <p className="text-sm text-gray-500">{classItem.gradeLevel_c} • {classItem.subject_c}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-sm font-medium text-gray-900">
                             {classItem.enrolledCount_c}/{classItem.capacity_c}
                           </p>
                           <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                             <div 
                               className={cn(
                                 "h-full rounded-full transition-all duration-300",
                                 getCapacityColor(classItem.enrolledCount_c, classItem.capacity_c)
                               )}
                               style={{ 
                                 width: `${Math.min((classItem.enrolledCount_c / classItem.capacity_c) * 100, 100)}%` 
                               }}
                             />
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Class Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {selectedClass ? (
              <div className="h-full flex flex-col">
                {/* Class Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
<h2 className="text-xl font-semibold text-gray-900 mb-1">
                         {selectedClass.courseName_c}
                       </h2>
                       <p className="text-sm text-gray-500">{selectedClass.courseCode_c}</p>
                     </div>
                     <div className="flex gap-2">
                       <Button variant="outline" size="sm">
                         <ApperIcon name="Edit2" size={16} />
                       </Button>
                       <Button variant="outline" size="sm">
                         <ApperIcon name="MoreVertical" size={16} />
                       </Button>
                     </div>
                   </div>

                   {/* Class Info Grid */}
                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <div>
                       <p className="text-sm text-gray-500">Instructor</p>
                       <p className="font-medium text-gray-900">{selectedClass.instructor_c}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Grade Level</p>
                       <p className="font-medium text-gray-900">{selectedClass.gradeLevel_c}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Room</p>
                       <p className="font-medium text-gray-900">{selectedClass.room_c}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-500">Schedule</p>
                       <p className="font-medium text-gray-900">{selectedClass.schedule_c}</p>
                     </div>
                   </div>

                   {/* Capacity Indicator */}
                   <div className="bg-gray-50 rounded-lg p-4">
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium text-gray-700">Class Capacity</span>
                       <span className="text-sm text-gray-500">
                         {selectedClass.enrolledCount_c} / {selectedClass.capacity_c} students
                       </span>
                     </div>
                     <div className="w-full h-3 bg-gray-200 rounded-full">
                       <div 
                         className={cn(
                           "h-full rounded-full transition-all duration-300",
                           getCapacityColor(selectedClass.enrolledCount_c, selectedClass.capacity_c)
                         )}
                         style={{ 
                           width: `${Math.min((selectedClass.enrolledCount_c / selectedClass.capacity_c) * 100, 100)}%` 
                         }}
                       />
                     </div>
                   </div>
                </div>

                {/* Enrolled Students */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Enrolled Students ({enrolledStudents.length})
                    </h3>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="UserPlus" size={16} />
                      Enroll Student
                    </Button>
                  </div>

                  {enrolledStudents.length === 0 ? (
                    <Empty 
                      message="No students enrolled"
                      description="Add students to this class to get started"
                    />
                  ) : (
                    <ClassTable 
                      students={enrolledStudents}
                      onUnenrollStudent={handleUnenrollStudent}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="BookOpen" size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
                  <p className="text-gray-500">
                    Choose a class from the list to view details and manage enrolled students.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;