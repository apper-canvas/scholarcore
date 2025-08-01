import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const StudentTable = ({ students, onEditStudent, onDeleteStudent }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    let sortableStudents = [...students];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [students, sortConfig]);

  const toggleRow = (studentId) => {
    setExpandedRow(expandedRow === studentId ? null : studentId);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      "Active": "bg-green-100 text-green-800 border-green-200",
      "Inactive": "bg-red-100 text-red-800 border-red-200",
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.Pending}`}>
        {status}
      </span>
    );
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-gray-400" />;
    }
    return (
      <ApperIcon 
        name={sortConfig.direction === "asc" ? "ArrowUp" : "ArrowDown"} 
        className="h-4 w-4 text-primary-600" 
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort("firstName")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Name</span>
                  <SortIcon column="firstName" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort("studentId")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Student ID</span>
                  <SortIcon column="studentId" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort("gradeLevel")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Grade Level</span>
                  <SortIcon column="gradeLevel" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort("enrollmentStatus")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Status</span>
                  <SortIcon column="enrollmentStatus" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map((student, index) => (
              <React.Fragment key={student.Id}>
                <tr 
                  className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  } ${expandedRow === student.Id ? "bg-blue-50" : ""}`}
                  onClick={() => toggleRow(student.Id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
                       <div className="flex-shrink-0 h-10 w-10">
                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                           <span className="text-sm font-medium text-white">
                             {student.firstName_c?.charAt(0)}{student.lastName_c?.charAt(0)}
                           </span>
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
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     {student.studentId_c}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
Grade {student.gradeLevel_c}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
{getStatusBadge(student.enrollmentStatus_c)}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditStudent(student);
                        }}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStudent(student.Id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                      <ApperIcon 
                        name={expandedRow === student.Id ? "ChevronUp" : "ChevronDown"} 
                        className="h-4 w-4 text-gray-400" 
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRow === student.Id && (
                    <tr>
                      <td colSpan={5} className="px-0 py-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-blue-50 border-t border-blue-100"
                        >
                          <div className="px-6 py-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               <div>
                                 <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                                 <div className="space-y-1 text-sm text-gray-600">
                                   <p><strong>Phone:</strong> {student.phone_c}</p>
                                   <p><strong>Address:</strong> {student.address_c}</p>
                                 </div>
                               </div>
                               <div>
                                 <h4 className="text-sm font-medium text-gray-900 mb-2">Guardian Information</h4>
                                 <div className="space-y-1 text-sm text-gray-600">
                                   <p><strong>Guardian:</strong> {student.guardianName_c}</p>
                                   <p><strong>Guardian Phone:</strong> {student.guardianPhone_c}</p>
                                 </div>
                               </div>
                               <div>
                                 <h4 className="text-sm font-medium text-gray-900 mb-2">Enrollment Details</h4>
                                 <div className="space-y-1 text-sm text-gray-600">
                                   <p><strong>Enrollment Date:</strong> {new Date(student.enrollmentDate_c).toLocaleDateString()}</p>
                                   <p><strong>Notes:</strong> {student.notes_c || "No notes available"}</p>
                                 </div>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;