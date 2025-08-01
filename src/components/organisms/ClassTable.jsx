import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ClassTable = ({ students, onUnenrollStudent }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleRow = (studentId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ApperIcon name="ArrowUpDown" size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ApperIcon name="ArrowUp" size={14} className="text-primary-600" />
      : <ApperIcon name="ArrowDown" size={14} className="text-primary-600" />;
  };

  const sortableStudents = [...students];
  if (sortConfig.key) {
    sortableStudents.sort((a, b) => {
      const asc = sortConfig.direction === 'asc';
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
if (sortConfig.key === 'name') {
        aValue = `${a.firstName_c} ${a.lastName_c}`.toLowerCase();
        bValue = `${b.firstName_c} ${b.lastName_c}`.toLowerCase();
      }
      
      if (aValue < bValue) return asc ? -1 : 1;
      if (aValue > bValue) return asc ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                >
                  Student
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
<button
                  onClick={() => handleSort('studentId_c')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                >
                  Student ID
                  <SortIcon column="studentId_c" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
<button
                  onClick={() => handleSort('email_c')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                >
                  Email
                  <SortIcon column="email_c" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
<button
                  onClick={() => handleSort('enrollmentStatus_c')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                >
                  Status
                  <SortIcon column="enrollmentStatus_c" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sortableStudents.map((student) => (
                <React.Fragment key={student.Id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
<div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-800">
                              {student.firstName_c?.[0]}{student.lastName_c?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName_c} {student.lastName_c}
                          </div>
                          <div className="text-sm text-gray-500">
                            Grade {student.gradeLevel_c}
                          </div>
                        </div>
                      </div>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {student.studentId_c}
                      </div>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email_c}
                      </div>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.enrollmentStatus_c)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnenrollStudent(student.Id)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <ApperIcon name="UserMinus" size={14} />
                          Unenroll
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRow(student.Id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <ApperIcon 
                          name={expandedRows.has(student.Id) ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                        />
                      </button>
                    </td>
                  </motion.tr>
                  
                  <AnimatePresence>
                    {expandedRows.has(student.Id) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan="6" className="px-6 py-4 bg-gray-50 border-l-4 border-l-primary-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                              <div className="space-y-1">
<p className="text-sm text-gray-600">
                                  <span className="font-medium">Phone:</span> {student.phone_c || 'Not provided'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Address:</span> {student.streetAddress_c || student.city_c || student.state_c || student.zipCode_c ? `${student.streetAddress_c || ''} ${student.city_c || ''} ${student.state_c || ''} ${student.zipCode_c || ''}`.trim() : 'Not provided'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Academic Information</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Date of Birth:</span> {student.dateOfBirth_c ? new Date(student.dateOfBirth_c).toLocaleDateString() : 'Not provided'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Enrollment Date:</span> {student.enrollmentDate_c ? new Date(student.enrollmentDate_c).toLocaleDateString() : 'Not provided'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Emergency Contact</h4>
                              <div className="space-y-1">
<p className="text-sm text-gray-600">
                                  <span className="font-medium">Contact:</span> {student.guardianName_c || 'Not provided'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Phone:</span> {student.guardianPhone_c || 'Not provided'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassTable;