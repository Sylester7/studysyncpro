import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { User, LogOut, Settings } from 'lucide-react';

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // Get user initials
  const getUserInitials = () => {
    if (!currentUser?.displayName) return 'U';
    return currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="relative group" ref={menuRef}>
      <button 
        className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || 'User'} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span>{getUserInitials()}</span>
          )}
        </div>
        <span className="hidden md:block">{currentUser?.displayName?.split(' ')[0] || 'User'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
          <a href="#profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <User className="h-4 w-4 mr-2" />
            Your Profile
          </a>
          <a href="#settings" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </a>
          <button 
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
