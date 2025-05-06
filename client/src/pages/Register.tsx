import { useEffect } from 'react';
import { useLocation } from 'wouter';
import AuthLayout from '@/layouts/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const { currentUser, userRole } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (currentUser) {
      if (userRole === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [currentUser, userRole, navigate]);

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
