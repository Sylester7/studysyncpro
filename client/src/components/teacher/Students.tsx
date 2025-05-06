import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Plus, MoreHorizontal, Filter, ArrowUpDown, 
  UserPlus, Mail, ChevronRight, TrendingUp, BarChart2, 
  Clock, CalendarDays, FileText, BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Student = {
  id: number;
  name: string;
  email: string;
  averageGrade: number;
  recentActivity: string;
  lastActive: Date;
  status: 'active' | 'inactive';
  progress: number;
  assignments: {
    completed: number;
    total: number;
  };
  subjects: string[];
};

export default function Students() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    subjects: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Sample students data - would come from API in real app
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      averageGrade: 92,
      recentActivity: "Submitted Physics Lab Report",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "active",
      progress: 85,
      assignments: {
        completed: 9,
        total: 12
      },
      subjects: ["Physics", "Mathematics", "Chemistry"]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      averageGrade: 88,
      recentActivity: "Completed Quiz: Integration Techniques",
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "active",
      progress: 75,
      assignments: {
        completed: 10,
        total: 12
      },
      subjects: ["Mathematics", "Computer Science"]
    },
    {
      id: 3,
      name: "Sarah Martinez",
      email: "sarah.martinez@example.com",
      averageGrade: 85,
      recentActivity: "Viewed Lecture: Wave Mechanics",
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "active",
      progress: 80,
      assignments: {
        completed: 11,
        total: 12
      },
      subjects: ["Physics", "Mathematics"]
    },
    {
      id: 4,
      name: "Jason Lee",
      email: "jason.lee@example.com",
      averageGrade: 62,
      recentActivity: "Started Assignment: Literary Analysis",
      lastActive: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      status: "inactive",
      progress: 40,
      assignments: {
        completed: 5,
        total: 12
      },
      subjects: ["Literature", "History"]
    },
    {
      id: 5,
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      averageGrade: 65,
      recentActivity: "No recent activity",
      lastActive: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: "inactive",
      progress: 45,
      assignments: {
        completed: 6,
        total: 12
      },
      subjects: ["Mathematics", "Literature"]
    },
    {
      id: 6,
      name: "Ryan Smith",
      email: "ryan.smith@example.com",
      averageGrade: 78,
      recentActivity: "Submitted Mathematics Problem Set",
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "active",
      progress: 65,
      assignments: {
        completed: 8,
        total: 12
      },
      subjects: ["Mathematics", "Physics"]
    }
  ]);

  const handleAddStudent = () => {
    if (!studentForm.name || !studentForm.email) {
      toast({
        title: "Missing information",
        description: "Please provide a name and email.",
        variant: "destructive"
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentForm.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      const newStudent: Student = {
        id: Date.now(),
        name: studentForm.name,
        email: studentForm.email,
        averageGrade: 0,
        recentActivity: "Just added to class",
        lastActive: new Date(),
        status: "active",
        progress: 0,
        assignments: {
          completed: 0,
          total: 12
        },
        subjects: studentForm.subjects ? studentForm.subjects.split(',').map(s => s.trim()) : []
      };

      setStudents([...students, newStudent]);
      
      // Reset form
      setStudentForm({
        name: '',
        email: '',
        subjects: ''
      });
      
      setIsAddStudentOpen(false);
      setLoading(false);
      
      toast({
        title: "Student added",
        description: `${newStudent.name} has been added to your class.`,
      });
    }, 1000);
  };

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDetailsOpen(true);
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleSendEmail = (student: Student | null) => {
    if (!student) return;
    
    toast({
      title: "Email client opened",
      description: `Compose an email to ${student.name}.`,
    });
  };

  // Format date relative to now
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  // Apply filters
  const filteredStudents = students.filter(student => {
    // Apply tab filter
    if (activeTab === 'active' && student.status !== 'active') {
      return false;
    }
    
    if (activeTab === 'inactive' && student.status !== 'inactive') {
      return false;
    }
    
    if (activeTab === 'atRisk' && student.averageGrade >= 70) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let result = 0;
    
    switch (sortBy) {
      case 'name':
        result = a.name.localeCompare(b.name);
        break;
      case 'grade':
        result = a.averageGrade - b.averageGrade;
        break;
      case 'progress':
        result = a.progress - b.progress;
        break;
      case 'lastActive':
        result = a.lastActive.getTime() - b.lastActive.getTime();
        break;
      default:
        result = a.name.localeCompare(b.name);
    }
    
    return sortDirection === 'asc' ? result : -result;
  });

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor your students' progress
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => setIsAddStudentOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                className="pl-10" 
                placeholder="Search students..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="atRisk">At Risk</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium text-left p-0 hover:bg-transparent"
                    onClick={() => handleSortChange('name')}
                  >
                    Student
                    {sortBy === 'name' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium text-right p-0 hover:bg-transparent"
                    onClick={() => handleSortChange('grade')}
                  >
                    Grade
                    {sortBy === 'grade' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium text-left p-0 hover:bg-transparent"
                    onClick={() => handleSortChange('progress')}
                  >
                    Progress
                    {sortBy === 'progress' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Recent Activity</TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium text-left p-0 hover:bg-transparent"
                    onClick={() => handleSortChange('lastActive')}
                  >
                    Last Active
                    {sortBy === 'lastActive' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map(student => (
                  <TableRow 
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleViewStudentDetails(student)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-medium ${student.averageGrade < 70 ? 'text-red-600 dark:text-red-400' : student.averageGrade >= 90 ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {student.averageGrade}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={student.progress} className="h-2 w-24" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {student.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm truncate max-w-[200px]">{student.recentActivity}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(student.lastActive)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="p-0" onClick={(e) => {
                        e.stopPropagation();
                        handleViewStudentDetails(student);
                      }}>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's information to add them to your class
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input 
                  id="name" 
                  placeholder="John Smith" 
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="john.smith@example.com" 
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="subjects">Subjects (comma separated)</Label>
                <Input 
                  id="subjects" 
                  placeholder="Mathematics, Physics, Literature" 
                  value={studentForm.subjects}
                  onChange={(e) => setStudentForm({...studentForm, subjects: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddStudent} disabled={loading}>
              {loading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStudentDetailsOpen} onOpenChange={setIsStudentDetailsOpen}>
        <DialogContent className="sm:max-w-4xl">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedStudent.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedStudent.email}
                      <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'}>
                        {selectedStudent.status}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-gray-400" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Average Grade</span>
                          <span className={`font-medium ${selectedStudent.averageGrade < 70 ? 'text-red-600 dark:text-red-400' : selectedStudent.averageGrade >= 90 ? 'text-green-600 dark:text-green-400' : ''}`}>
                            {selectedStudent.averageGrade}%
                          </span>
                        </div>
                        <Progress value={selectedStudent.averageGrade} className="h-2 mt-1" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Assignments</span>
                          <span className="text-sm">{selectedStudent.assignments.completed}/{selectedStudent.assignments.total} completed</span>
                        </div>
                        <Progress value={(selectedStudent.assignments.completed / selectedStudent.assignments.total) * 100} className="h-2 mt-1" />
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Subjects</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedStudent.subjects.map((subject, index) => (
                            <Badge key={index} variant="outline">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                      Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Recent Activity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {selectedStudent.recentActivity || "No recent activity"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Last Active</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {formatTimeAgo(selectedStudent.lastActive)}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Login Frequency</h4>
                        <div className="mt-2 grid grid-cols-7 gap-1">
                          {Array.from({ length: 7 }, (_, i) => (
                            <div 
                              key={i} 
                              className={`h-4 rounded-sm ${Math.random() > 0.3 ? 'bg-primary-200 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-700'}`}
                            ></div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Last 7 days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gray-400" />
                      Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Assignment #{index + 1}</span>
                            <Badge variant={Math.random() > 0.3 ? 'default' : 'secondary'}>
                              {Math.random() > 0.3 ? 'Completed' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Due in {Math.floor(Math.random() * 10) + 1} days
                          </p>
                        </div>
                      ))}
                      
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        View all assignments
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-gray-400" />
                      Grade History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] flex items-end space-x-2">
                      {Array.from({ length: 8 }, (_, i) => {
                        const height = 40 + Math.random() * 60;
                        return (
                          <div key={i} className="flex flex-col items-center flex-1">
                            <div className="w-full bg-primary-100 dark:bg-primary-900 rounded-t" style={{ height: `${height}%` }}></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">A{i+1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter className="flex justify-between sm:justify-between">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSendEmail(selectedStudent)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
                <Button variant="default" onClick={() => setIsStudentDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
