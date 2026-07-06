import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentManagement from './pages/StudentManagement';
import ExamManagement from './pages/ExamManagement';
import QuestionManagement from './pages/QuestionManagement';
import ExamList from './pages/ExamList';
import ExamInstructions from './pages/ExamInstructions';
import TakeExam from './pages/TakeExam';
import ResultPage from './pages/ResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Role Based Authorizer Wrapper
const RoleRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (user && user.role !== allowedRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
};

// Layout with Sidebar and Navbar (for standard navigation)
const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px 40px 24px',
        flex: 1
      }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* SECURE EXAM SESSION VIEW (No Navbar or Sidebar) */}
      <Route path="/student/exams/:examId/take" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="STUDENT">
            <TakeExam />
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* Admin Protected Pages */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="ADMIN">
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/students" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="ADMIN">
            <DashboardLayout>
              <StudentManagement />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />

      <Route path="/admin/exams" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="ADMIN">
            <DashboardLayout>
              <ExamManagement />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />

      <Route path="/admin/exams/:examId/questions" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="ADMIN">
            <DashboardLayout>
              <QuestionManagement />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* Student Protected Pages */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="STUDENT">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />

      <Route path="/student/exams" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="STUDENT">
            <DashboardLayout>
              <ExamList />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />

      <Route path="/student/exams/:examId/instructions" element={
        <ProtectedRoute>
          <RoleRoute allowedRole="STUDENT">
            <DashboardLayout>
              <ExamInstructions />
            </DashboardLayout>
          </RoleRoute>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Shared Protected Pages */}
      <Route path="/results/:resultId" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ResultPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <LeaderboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
