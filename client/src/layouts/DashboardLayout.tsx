import { ReactNode } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }
  
  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 pt-5 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
