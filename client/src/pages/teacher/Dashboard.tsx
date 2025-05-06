import DashboardLayout from '@/layouts/DashboardLayout';
import TeacherDashboard from '@/components/teacher/Dashboard';

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout>
      <TeacherDashboard />
    </DashboardLayout>
  );
}