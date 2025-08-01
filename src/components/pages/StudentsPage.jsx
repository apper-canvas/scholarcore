import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";

const StudentsPage = ({ onMobileMenuToggle }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(studentData);
        toast.success("Student added successfully!");
      }
      await loadStudents();
    } catch (err) {
      toast.error("Failed to save student. Please try again.");
      console.error("Error saving student:", err);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        toast.success("Student deleted successfully!");
        await loadStudents();
      } catch (err) {
        toast.error("Failed to delete student. Please try again.");
        console.error("Error deleting student:", err);
      }
    }
  };

  const getStatistics = () => {
    const activeStudents = students.filter(s => s.enrollmentStatus === "Active").length;
    const gradeDistribution = students.reduce((acc, student) => {
      acc[student.gradeLevel] = (acc[student.gradeLevel] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalStudents: students.length,
      activeEnrollments: activeStudents,
      gradeDistribution
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header 
          title="Students" 
          subtitle="Manage student records and enrollment" 
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-24"></div>
              </div>
            ))}
          </div>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <Header 
          title="Students" 
          subtitle="Manage student records and enrollment" 
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadStudents} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Students" 
        subtitle="Manage student records and enrollment" 
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <div className="flex-1 p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="Users"
            trend="up"
            trendValue="+12% from last month"
          />
          <StatCard
            title="Active Enrollments"
            value={stats.activeEnrollments}
            icon="UserCheck"
            trend="up"
            trendValue="+5% from last month"
          />
          <StatCard
            title="Grade Levels"
            value={Object.keys(stats.gradeDistribution).length}
            icon="BookOpen"
            trend="neutral"
            trendValue="Across all grades"
          />
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={handleAddStudent} className="inline-flex items-center">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, ID, or email..."
            className="w-full sm:w-80"
          />
        </div>

        {/* Student Table */}
        {filteredStudents.length === 0 && !loading ? (
          <Empty
            title={searchQuery ? "No Students Found" : "No Students Yet"}
            description={searchQuery ? 
              "No students match your search criteria. Try adjusting your search terms." :
              "Get started by adding your first student to the system."
            }
            onAction={searchQuery ? undefined : handleAddStudent}
            actionLabel="Add First Student"
          />
        ) : (
          <StudentTable
            students={filteredStudents}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
      </div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};

export default StudentsPage;