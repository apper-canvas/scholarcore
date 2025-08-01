import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { studentService } from '@/services/api/studentService';
import { attendanceService } from '@/services/api/attendanceService';
import { gradeService } from '@/services/api/gradeService';

function ReportsPage({ onMobileMenuToggle }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    previousSemesterStudents: 0,
    averageAttendance: 0,
    attendanceTrend: 0,
    gradeDistribution: {
      A: 0, B: 0, C: 0, D: 0, F: 0
    },
    studentsAtRisk: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [students, attendance, grades] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      // Calculate total enrolled students
      const activeStudents = students.filter(s => s.enrollmentStatus === 'Active');
      const totalStudents = activeStudents.length;
      
      // Mock previous semester comparison (would come from historical data)
      const previousSemesterStudents = Math.floor(totalStudents * 0.92); // 8% growth simulation
      
      // Calculate average attendance
      const attendanceRecords = attendance.filter(a => a.status === 'Present');
      const totalAttendanceRecords = attendance.length;
      const averageAttendance = totalAttendanceRecords > 0 
        ? Math.round((attendanceRecords.length / totalAttendanceRecords) * 100)
        : 0;
      
      // Mock attendance trend (would compare with previous periods)
      const attendanceTrend = 2.3; // 2.3% improvement simulation

      // Calculate grade distribution
      const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      grades.forEach(grade => {
        if (grade.letterGrade && gradeDistribution.hasOwnProperty(grade.letterGrade)) {
          gradeDistribution[grade.letterGrade]++;
        }
      });

      // Calculate students at risk (failing grades or poor attendance)
      const failingGrades = grades.filter(g => g.letterGrade === 'F' || g.letterGrade === 'D');
      const failingStudentIds = [...new Set(failingGrades.map(g => g.studentId))];
      
      // Students with poor attendance (less than 75%)
      const attendanceByStudent = {};
      attendance.forEach(record => {
        if (!attendanceByStudent[record.studentId]) {
          attendanceByStudent[record.studentId] = { present: 0, total: 0 };
        }
        attendanceByStudent[record.studentId].total++;
        if (record.status === 'Present') {
          attendanceByStudent[record.studentId].present++;
        }
      });

      const poorAttendanceStudents = Object.keys(attendanceByStudent).filter(studentId => {
        const studentAttendance = attendanceByStudent[studentId];
        const attendanceRate = studentAttendance.present / studentAttendance.total;
        return attendanceRate < 0.75; // Less than 75% attendance
      }).map(id => parseInt(id));

      const atRiskStudents = new Set([...failingStudentIds, ...poorAttendanceStudents]);

      setAnalytics({
        totalStudents,
        previousSemesterStudents,
        averageAttendance,
        attendanceTrend,
        gradeDistribution,
        studentsAtRisk: atRiskStudents.size
      });

      toast.success('Reports data loaded successfully');
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load reports data');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const getGradePercentage = (grade) => {
    const totalGrades = Object.values(analytics.gradeDistribution).reduce((sum, count) => sum + count, 0);
    return totalGrades > 0 ? Math.round((analytics.gradeDistribution[grade] / totalGrades) * 100) : 0;
  };

  const getStudentGrowth = () => {
    const growth = analytics.totalStudents - analytics.previousSemesterStudents;
    const percentage = analytics.previousSemesterStudents > 0 
      ? Math.round((growth / analytics.previousSemesterStudents) * 100)
      : 0;
    return { growth, percentage };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  const studentGrowth = getStudentGrowth();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600">Comprehensive analytics and insights</p>
            </div>
          </div>
          <button
            onClick={loadAnalytics}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Enrolled Students */}
          <StatCard
            title="Total Enrolled Students"
            value={analytics.totalStudents.toLocaleString()}
            icon="Users"
            subtitle={
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={studentGrowth.growth >= 0 ? "TrendingUp" : "TrendingDown"} 
                  size={14} 
                  className={studentGrowth.growth >= 0 ? "text-green-500" : "text-red-500"}
                />
                <span className={`text-sm ${studentGrowth.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {studentGrowth.growth >= 0 ? "+" : ""}{studentGrowth.percentage}% from last semester
                </span>
              </div>
            }
            className="bg-blue-50 border-blue-200"
          />

          {/* Average Attendance */}
          <StatCard
            title="Average Class Attendance"
            value={`${analytics.averageAttendance}%`}
            icon="Calendar"
            subtitle={
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={analytics.attendanceTrend >= 0 ? "TrendingUp" : "TrendingDown"} 
                  size={14} 
                  className={analytics.attendanceTrend >= 0 ? "text-green-500" : "text-red-500"}
                />
                <span className={`text-sm ${analytics.attendanceTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {analytics.attendanceTrend >= 0 ? "+" : ""}{analytics.attendanceTrend}% trend
                </span>
              </div>
            }
            className="bg-green-50 border-green-200"
          />

          {/* Grade Distribution */}
          <StatCard
            title="Grade Distribution"
            value="See Breakdown"
            icon="BarChart3"
            subtitle={
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>A: {getGradePercentage('A')}%</span>
                  <span>B: {getGradePercentage('B')}%</span>
                  <span>C: {getGradePercentage('C')}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>D: {getGradePercentage('D')}%</span>
                  <span>F: {getGradePercentage('F')}%</span>
                </div>
              </div>
            }
            className="bg-purple-50 border-purple-200"
          />

          {/* Students at Risk */}
          <StatCard
            title="Students at Risk"
            value={analytics.studentsAtRisk.toString()}
            icon="AlertTriangle"
            subtitle={
              <div className="flex items-center space-x-1">
                <ApperIcon name="Alert" size={14} className="text-orange-500" />
                <span className="text-sm text-orange-600">
                  Failing grades or poor attendance
                </span>
              </div>
            }
            className="bg-orange-50 border-orange-200"
          />
        </div>

        {/* Detailed Reports Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Analytics</h2>
            <p className="text-sm text-gray-600">In-depth performance and trend analysis</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Grade Distribution Details */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <ApperIcon name="PieChart" size={18} />
                  <span>Grade Distribution Breakdown</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.gradeDistribution).map(([grade, count]) => {
                    const percentage = getGradePercentage(grade);
                    const colors = {
                      A: 'bg-green-500',
                      B: 'bg-blue-500', 
                      C: 'bg-yellow-500',
                      D: 'bg-orange-500',
                      F: 'bg-red-500'
                    };
                    
                    return (
                      <div key={grade} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${colors[grade]}`}></div>
                          <span className="text-sm font-medium text-gray-700">Grade {grade}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{count} students</span>
                          <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Insights */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <ApperIcon name="TrendingUp" size={18} />
                  <span>Performance Insights</span>
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Users" size={18} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Enrollment Growth</p>
                        <p className="text-xs text-blue-700">
                          {studentGrowth.growth > 0 ? 'Increased' : 'Decreased'} by {Math.abs(studentGrowth.growth)} students ({Math.abs(studentGrowth.percentage)}%) compared to last semester
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Calendar" size={18} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Attendance Rate</p>
                        <p className="text-xs text-green-700">
                          Current average attendance is {analytics.averageAttendance}% with a {analytics.attendanceTrend >= 0 ? 'positive' : 'negative'} trend
                        </p>
                      </div>
                    </div>
                  </div>

                  {analytics.studentsAtRisk > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-3">
                        <ApperIcon name="AlertTriangle" size={18} className="text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-900">At-Risk Students</p>
                          <p className="text-xs text-orange-700">
                            {analytics.studentsAtRisk} students require attention due to poor academic performance or attendance
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;