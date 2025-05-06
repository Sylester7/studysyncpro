import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentNotes from './pages/student/Notes';
import StudentFocus from './pages/student/Focus';
import StudentAnalytics from './pages/student/Analytics';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherGrading from './pages/teacher/Grading';
import TeacherStudents from './pages/teacher/Students';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/student"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/planner"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Smart Planner Page</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/notes"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Notes & Flashcards Page</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/sessions"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Study Sessions Page</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/tracker"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Productivity Tracker Page</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;