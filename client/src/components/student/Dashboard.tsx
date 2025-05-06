import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, Plus, Calendar, CheckSquare, Database, 
  BarChart, AlertTriangle, Award, BookOpen 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 1,
      time: '09:00',
      title: 'Calculus Study Session',
      description: 'Integration techniques, Chapter 7',
      duration: '1h 30m',
      color: 'primary'
    },
    {
      id: 2,
      time: '11:00',
      title: 'Physics Lab Preparation',
      description: 'Review experiment protocol',
      duration: '45m',
      color: 'green'
    },
    {
      id: 3,
      time: '14:30',
      title: 'Group Discussion',
      description: 'Literature review with Sarah and Alex',
      duration: '1h',
      color: 'accent'
    }
  ]);
  const [dueTasks, setDueTasks] = useState([
    {
      id: 1,
      title: 'Physics Lab Report',
      dueDate: 'tomorrow at 11:59 PM',
      priority: 'urgent'
    },
    {
      id: 2,
      title: 'Literature Review Draft',
      dueDate: 'in 3 days',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Math Problem Set #3',
      dueDate: 'in 5 days',
      priority: 'low'
    },
    {
      id: 4,
      title: 'History Essay Outline',
      dueDate: 'next week',
      priority: 'low'
    }
  ]);
  const [studyStats, setStudyStats] = useState({
    hours: '14.5',
    hoursChange: '+2.3%',
    focusScore: '85%',
    focusScoreChange: '+5%',
    tasksCompleted: '12',
    tasksCompletedChange: '-1',
    productivity: '78%',
    productivityChange: '+8%',
    subjects: [
      { name: 'Math', percentage: 35, color: 'primary' },
      { name: 'Physics', percentage: 25, color: 'secondary' },
      { name: 'Literature', percentage: 20, color: 'accent' },
      { name: 'History', percentage: 15, color: 'yellow' },
      { name: 'Other', percentage: 5, color: 'gray' }
    ]
  });

  useEffect(() => {
    // Format the current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
    
    // Get user's first name
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName.split(' ')[0]);
    }
  }, [currentUser]);

  const handleAddTask = () => {
    toast({
      title: "Adding new task",
      description: "Creating a new task...",
    });
    // Here you would typically make an API call to add the task
    setDueTasks([
      ...dueTasks,
      {
        id: dueTasks.length + 1,
        title: "New Task",
        dueDate: "in 7 days",
        priority: "medium"
      }
    ]);
  };

  const handleToggleTask = (taskId: number) => {
    setDueTasks(dueTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task completed",
      description: "Task marked as done",
    });
  };

  const handleStartTimer = () => {
    toast({
      title: "Timer started",
      description: "Focus timer has started",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your study data is being exported",
    });
  };

  const getColorClass = (color: string, element: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      primary: {
        bg: 'bg-primary-50 dark:bg-gray-700',
        border: 'border-primary-500',
        text: 'text-primary-800 dark:text-primary-300'
      },
      green: {
        bg: 'bg-green-50 dark:bg-gray-700',
        border: 'border-green-500',
        text: 'text-green-800 dark:text-green-300'
      },
      accent: {
        bg: 'bg-accent-50 dark:bg-gray-700',
        border: 'border-accent-500',
        text: 'text-accent-800 dark:text-accent-300'
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-gray-700',
        border: 'border-yellow-500',
        text: 'text-yellow-800 dark:text-yellow-300'
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-700',
        border: 'border-gray-500',
        text: 'text-gray-800 dark:text-gray-300'
      }
    };
    
    return colorMap[color][element] || colorMap.primary[element];
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {currentDate} • Welcome back, {userName}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button variant="outline" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button className="flex items-center" onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-white p-6 mb-8 shadow-lg">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:flex-1">
            <h2 className="text-xl font-bold">AI Study Assistant</h2>
            <p className="mt-1 max-w-2xl">Your personalized learning companion</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-white text-primary-600 hover:bg-gray-100" onClick={() => {
              toast({
                title: "Coming Soon",
                description: "This feature will be available shortly!"
              });
            }}>
              Start Learning
            </Button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
            <BookOpen className="h-5 w-5 mr-2" />
            Smart Study Plans
          </button>
          <button className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Optimization
          </button>
          <button className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
            <Database className="h-5 w-5 mr-2" />
            Learning Analytics
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Today's Schedule</CardTitle>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleItems.map(item => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.time}</span>
                    <div className="h-full w-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                  </div>
                  <div className={`flex-1 min-w-0 ${getColorClass(item.color, 'bg')} p-3 rounded-lg border-l-4 ${getColorClass(item.color, 'border')}`}>
                    <div className="flex justify-between">
                      <h4 className={`text-sm font-medium ${getColorClass(item.color, 'text')}`}>{item.title}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.color === 'primary' ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Due Tasks and Assignments */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Due Soon</CardTitle>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dueTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due {task.dueDate}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Stats */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Study Stats</CardTitle>
            <select className="text-sm text-gray-500 dark:text-gray-400 border-none focus:ring-0 bg-transparent">
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Hours</h4>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{studyStats.hours}</p>
                  <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">{studyStats.hoursChange}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Score</h4>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{studyStats.focusScore}</p>
                  <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">{studyStats.focusScoreChange}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</h4>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{studyStats.tasksCompleted}</p>
                  <p className="ml-2 text-sm font-medium text-red-600 dark:text-red-400">{studyStats.tasksCompletedChange}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Productivity</h4>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{studyStats.productivity}</p>
                  <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">{studyStats.productivityChange}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subject Distribution</h4>
              <div className="space-y-2">
                {studyStats.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">{subject.name}</span>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`${subject.color === 'primary' ? 'bg-primary-600 dark:bg-primary-500' : 
                          subject.color === 'secondary' ? 'bg-secondary-600 dark:bg-secondary-500' : 
                          subject.color === 'accent' ? 'bg-accent-600 dark:bg-accent-500' : 
                          subject.color === 'yellow' ? 'bg-yellow-500 dark:bg-yellow-600' : 
                          'bg-gray-500 dark:bg-gray-400'} h-2.5 rounded-full`} 
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">{subject.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pomodoro Timer Widget */}
      <div className="fixed bottom-[80px] md:bottom-6 right-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Focus Timer</h3>
          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">25:00</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Study Session</p>
        </div>
        <div className="mt-3 flex items-center justify-center space-x-2">
          <button className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            onClick={handleStartTimer}
            className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
