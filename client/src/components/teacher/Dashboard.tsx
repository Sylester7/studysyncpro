import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users, BookOpen, Download, FileText, CheckSquare, Calendar,
  BarChart2, TrendingUp, Clock, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Sample data - in a real app, this would be fetched from API
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalStudents: 58,
      activeStudents: 42,
      assignmentsCreated: 12,
      pendingGrading: 8,
      averageScore: 75,
    },
    recentAssignments: [
      {
        id: 1,
        title: "Calculus II - Integration Methods",
        subject: "Mathematics",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        submissions: 18,
        totalStudents: 25,
        status: "active"
      },
      {
        id: 2,
        title: "Physics Lab Report - Projectile Motion",
        subject: "Physics",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        submissions: 22,
        totalStudents: 24,
        status: "ended"
      },
      {
        id: 3,
        title: "Literary Analysis - Modernist Poetry",
        subject: "Literature",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        submissions: 8,
        totalStudents: 20,
        status: "active"
      }
    ],
    pendingGrading: [
      {
        id: 1,
        title: "Physics Lab Report - Projectile Motion",
        student: "Alex Johnson",
        submitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        subject: "Physics"
      },
      {
        id: 2,
        title: "Physics Lab Report - Projectile Motion",
        student: "Sarah Martinez",
        submitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        subject: "Physics"
      },
      {
        id: 3,
        title: "Mathematics Problem Set #3",
        student: "Michael Chen",
        submitted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        subject: "Mathematics"
      }
    ],
    studentPerformance: {
      classAverage: [65, 70, 68, 72, 75, 78, 80],
      subjectBreakdown: [
        { subject: "Mathematics", average: 72, improvement: "+3%" },
        { subject: "Physics", average: 78, improvement: "+5%" },
        { subject: "Literature", average: 82, improvement: "+1%" },
        { subject: "History", average: 76, improvement: "-2%" }
      ],
      topPerformers: [
        { name: "Emma Thompson", average: 92, trend: "up" },
        { name: "Michael Chen", average: 88, trend: "up" },
        { name: "Sarah Martinez", average: 85, trend: "stable" }
      ],
      needsAttention: [
        { name: "Jason Lee", average: 62, trend: "down" },
        { name: "Olivia Davis", average: 65, trend: "down" },
        { name: "Ryan Smith", average: 68, trend: "stable" }
      ]
    }
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

  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "Your dashboard data has been exported to CSV.",
    });
  };

  const handleCreateAssignment = () => {
    toast({
      title: "Feature coming soon",
      description: "Assignment creation will be available in the next update.",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getTimeRemaining = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Overdue";
    }
    
    if (diffDays === 0) {
      return "Due today";
    }
    
    if (diffDays === 1) {
      return "Due tomorrow";
    }
    
    return `Due in ${diffDays} days`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "ended":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "stable":
        return <TrendingStable className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Teacher Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {currentDate} • Welcome back, {userName}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateAssignment}>
            <FileText className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</span>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardData.overview.totalStudents}
                </p>
                <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                  {dashboardData.overview.activeStudents} active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignments</span>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardData.overview.assignmentsCreated}
                </p>
                <p className="ml-2 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {dashboardData.overview.pendingGrading} to grade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Class Average</span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardData.overview.averageScore}%
                </p>
                <Progress value={dashboardData.overview.averageScore} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Deadlines</span>
              </div>
              <Button variant="link" size="sm" className="text-primary-600 dark:text-primary-400 p-0">
                View All
              </Button>
            </div>
            <div className="mt-2">
              {dashboardData.recentAssignments.filter(a => a.status === 'active').slice(0, 2).map((assignment, index) => (
                <div key={index} className="flex items-center justify-between mt-2">
                  <div className="truncate">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {assignment.title}
                    </span>
                  </div>
                  <Badge variant="outline" className="ml-2 whitespace-nowrap">
                    {getTimeRemaining(assignment.dueDate)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>
              View status and submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardData.recentAssignments.map((assignment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <Badge className={getStatusBadgeClass(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-2">
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Submissions</span>
                      <span>{assignment.submissions}/{assignment.totalStudents}</span>
                    </div>
                    <Progress value={(assignment.submissions / assignment.totalStudents) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Pending Grading</CardTitle>
              <CardDescription>
                Student submissions awaiting feedback
              </CardDescription>
            </div>
            <Button variant="ghost" className="text-primary-600 dark:text-primary-400">
              Grade All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.pendingGrading.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{submission.student}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {submission.title} • {submission.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Submitted: {formatDate(submission.submitted)}
                    </p>
                  </div>
                  <Button size="sm">
                    Grade
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>
              Class overview and individual student progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Class Average Over Time</h4>
                <div className="flex justify-between h-44">
                  {dashboardData.studentPerformance.classAverage.map((score, index) => (
                    <div key={index} className="flex flex-col items-center justify-end h-full">
                      <div 
                        className="w-8 bg-primary-600 dark:bg-primary-500 rounded-t-md relative group" 
                        style={{ height: `${score}%` }}
                      >
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {score}%
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Week {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Subject Performance</h4>
                <div className="space-y-4">
                  {dashboardData.studentPerformance.subjectBreakdown.map((subject, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{subject.subject}</span>
                        <div className="flex items-center">
                          <span className="mr-2">{subject.average}%</span>
                          <span className={subject.improvement.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {subject.improvement}
                          </span>
                        </div>
                      </div>
                      <Progress value={subject.average} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="font-medium mb-4 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Top Performers
                </h4>
                <div className="space-y-2">
                  {dashboardData.studentPerformance.topPerformers.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="text-sm font-medium">{student.name}</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{student.average}%</span>
                        {getTrendIcon(student.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                  Needs Attention
                </h4>
                <div className="space-y-2">
                  {dashboardData.studentPerformance.needsAttention.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="text-sm font-medium">{student.name}</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{student.average}%</span>
                        {getTrendIcon(student.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Custom icons
function TrendingDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function TrendingStable(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
