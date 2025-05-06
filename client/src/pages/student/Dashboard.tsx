import DashboardLayout from '@/layouts/DashboardLayout';
import StudentDashboard from '@/components/student/Dashboard';

export default function StudentDashboardPage() {
  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  );
}
