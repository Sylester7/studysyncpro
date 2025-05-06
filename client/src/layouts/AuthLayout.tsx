import { ReactNode } from 'react';
import { Link } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold text-primary-600 dark:text-primary-400">
              StudySync
            </a>
          </Link>
          <button 
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Welcome to StudySync
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            The AI-powered platform to transform your learning experience
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </div>
      </div>
      
      <footer className="py-4 bg-white dark:bg-gray-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} StudySync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
