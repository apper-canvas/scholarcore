import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import StudentsPage from "@/components/pages/StudentsPage";
import ClassesPage from "@/components/pages/ClassesPage";
import ComingSoonPage from "@/components/pages/ComingSoonPage";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [classCount, setClassCount] = useState(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
<Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} classCount={classCount} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={
              <StudentsPage onMobileMenuToggle={toggleMobileMenu} />
            } />
<Route path="/classes" element={
              <ClassesPage 
                onMobileMenuToggle={toggleMobileMenu}
                onClassCountChange={setClassCount}
              />
            } />
            <Route path="/grades" element={
              <ComingSoonPage 
                title="Grades"
                subtitle="Track academic performance and assessments"
                icon="Award"
                description="Grade tracking system will provide comprehensive tools for recording, analyzing, and reporting student academic performance across all subjects."
                onMobileMenuToggle={toggleMobileMenu}
              />
            } />
            <Route path="/attendance" element={
              <ComingSoonPage 
                title="Attendance"
                subtitle="Monitor student attendance and participation"
                icon="Calendar"
                description="Attendance management will streamline the process of tracking student presence, tardiness, and participation in daily activities."
                onMobileMenuToggle={toggleMobileMenu}
              />
            } />
            <Route path="/reports" element={
              <ComingSoonPage 
                title="Reports"
                subtitle="Generate comprehensive analytics and insights"
                icon="BarChart3"
                description="Advanced reporting system will provide detailed analytics on student performance, attendance trends, and institutional metrics."
                onMobileMenuToggle={toggleMobileMenu}
              />
            } />
            <Route path="/settings" element={
              <ComingSoonPage 
                title="Settings"
                subtitle="Configure system preferences and options"
                icon="Settings"
                description="System configuration panel will allow you to customize application settings, user preferences, and institutional parameters."
                onMobileMenuToggle={toggleMobileMenu}
              />
            } />
          </Routes>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;