import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentNotes from "@/pages/student/Notes";
import StudentStudyPlanner from "@/pages/student/StudyPlanner";
import StudentFocusMode from "@/pages/student/FocusMode";
import StudentAnswerChecker from "@/pages/student/AnswerChecker";
import StudentAnalytics from "@/pages/student/Analytics";
import StudentBookMarketplace from "@/pages/student/BookMarketplace";
import StudentAISummarizer from "@/pages/student/AISummarizer";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import TeacherStudents from "@/pages/teacher/Students";
import TeacherAssignments from "@/pages/teacher/Assignments";
import TeacherGrading from "@/pages/teacher/Grading";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Switch>
              {/* Public routes */}
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              
              {/* Student routes */}
              <Route path="/student/dashboard" component={StudentDashboard} />
              <Route path="/student/planner" component={StudentStudyPlanner} />
              <Route path="/student/notes" component={StudentNotes} />
              <Route path="/student/books" component={StudentBookMarketplace} />
              <Route path="/student/focus" component={StudentFocusMode} />
              <Route path="/student/checker" component={StudentAnswerChecker} />
              <Route path="/student/analytics" component={StudentAnalytics} />
              <Route path="/student/summarizer" component={StudentAISummarizer} />
              
              {/* Teacher routes */}
              <Route path="/teacher/dashboard" component={TeacherDashboard} />
              <Route path="/teacher/students" component={TeacherStudents} />
              <Route path="/teacher/assignments" component={TeacherAssignments} />
              <Route path="/teacher/grading" component={TeacherGrading} />
              
              {/* Fallback route */}
              <Route component={NotFound} />
            </Switch>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
