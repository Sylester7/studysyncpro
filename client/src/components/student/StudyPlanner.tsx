import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Calendar as CalendarCheck, Clock, CheckSquare, XCircle, Edit2, Trash2, Brain, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStudyPlan } from '@/lib/gemini';
import { format } from 'date-fns';

export default function StudyPlanner() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('schedule');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // Task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    duration: '',
    subject: '',
    priority: 'medium'
  });

  // AI Plan form state
  const [aiPlanForm, setAiPlanForm] = useState({
    subjects: ['Mathematics', 'Physics'],
    daysAvailable: 7,
    hoursPerDay: 4
  });
  const [newSubject, setNewSubject] = useState('');

  // Tasks and study events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Calculus Study Session',
      description: 'Integration techniques, Chapter 7',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:30',
      subject: 'Mathematics',
      isCompleted: false,
      color: 'primary'
    },
    {
      id: 2,
      title: 'Physics Lab Preparation',
      description: 'Review experiment protocol',
      date: new Date(),
      startTime: '11:00',
      endTime: '11:45',
      subject: 'Physics',
      isCompleted: false,
      color: 'green'
    },
    {
      id: 3,
      title: 'Literature Analysis',
      description: 'Analyze modernist poetry themes',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      startTime: '13:00',
      endTime: '14:30',
      subject: 'Literature',
      isCompleted: false,
      color: 'accent'
    }
  ]);

  // Tasks that need to be completed
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Physics Lab Report',
      description: 'Complete lab report for Experiment 3',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'urgent',
      subject: 'Physics',
      isCompleted: false
    },
    {
      id: 2,
      title: 'Literature Review Draft',
      description: 'Write first draft of literature review',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      priority: 'medium',
      subject: 'Literature',
      isCompleted: false
    },
    {
      id: 3,
      title: 'Math Problem Set #3',
      description: 'Solve problems 1-20 from Chapter 5',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
      priority: 'low',
      subject: 'Mathematics',
      isCompleted: false
    }
  ]);

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }

    if (!newTask.date || !newTask.startTime) {
      toast({
        title: "Error",
        description: "Please select a date and start time",
        variant: "destructive"
      });
      return;
    }

    // Calculate end time based on duration
    const startTimeParts = newTask.startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startTimeParts[0], startTimeParts[1], 0);

    const durationMinutes = parseInt(newTask.duration) || 60;
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    const subjectColorMap: Record<string, string> = {
      'Mathematics': 'primary',
      'Physics': 'green',
      'Literature': 'accent',
      'History': 'yellow',
      'Chemistry': 'blue',
      'Biology': 'purple',
      'Computer Science': 'cyan'
    };

    const newEvent = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      date: newTask.date,
      startTime: newTask.startTime,
      endTime: endTime,
      subject: newTask.subject || 'Other',
      isCompleted: false,
      color: subjectColorMap[newTask.subject] || 'gray'
    };

    setEvents([...events, newEvent]);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      date: new Date(),
      startTime: '',
      duration: '',
      subject: '',
      priority: 'medium'
    });
    
    setShowTaskForm(false);
    
    toast({
      title: "Success",
      description: "Study session added to your schedule",
    });
  };

  const handleCompleteEvent = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, isCompleted: true } : event
    ));
    
    toast({
      title: "Session completed",
      description: "Great job! Keep up the good work.",
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    
    toast({
      title: "Session deleted",
      description: "The study session has been removed from your schedule.",
    });
  };

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    
    if (!aiPlanForm.subjects.includes(newSubject)) {
      setAiPlanForm({
        ...aiPlanForm,
        subjects: [...aiPlanForm.subjects, newSubject]
      });
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setAiPlanForm({
      ...aiPlanForm,
      subjects: aiPlanForm.subjects.filter(s => s !== subject)
    });
  };

  const handleGenerateAIPlan = async () => {
    if (aiPlanForm.subjects.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one subject",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      toast({
        title: "Generating study plan",
        description: "Please wait while we create your personalized study plan...",
      });

      const plan = await generateStudyPlan(
        aiPlanForm.subjects,
        aiPlanForm.daysAvailable,
        aiPlanForm.hoursPerDay
      );

      // Convert the plan to events
      const newEvents = plan.flatMap((dayPlan, dayIndex) => {
        const planDate = new Date();
        planDate.setDate(planDate.getDate() + dayIndex);
        
        return dayPlan.sessions.map((session, sessionIndex) => {
          // Start at 9 AM and add sessions sequentially
          const startHour = 9 + sessionIndex * 2;
          const startTime = `${startHour.toString().padStart(2, '0')}:00`;
          
          const durationHours = session.duration;
          const endHour = startHour + durationHours;
          const endTime = `${endHour.toString().padStart(2, '0')}:00`;

          const subjectColorMap: Record<string, string> = {
            'Mathematics': 'primary',
            'Physics': 'green',
            'Literature': 'accent',
            'History': 'yellow',
            'Chemistry': 'blue',
            'Biology': 'purple',
            'Computer Science': 'cyan'
          };

          return {
            id: Date.now() + sessionIndex,
            title: `${session.subject} - ${session.focus}`,
            description: `Focus on: ${session.focus}`,
            date: new Date(planDate),
            startTime,
            endTime,
            subject: session.subject,
            isCompleted: false,
            color: subjectColorMap[session.subject] || 'gray'
          };
        });
      });

      setEvents([...events, ...newEvents]);
      
      toast({
        title: "Study plan generated",
        description: `Added ${newEvents.length} study sessions to your schedule`,
      });
      
      setActiveTab('schedule');
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate study plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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
      blue: {
        bg: 'bg-blue-50 dark:bg-gray-700',
        border: 'border-blue-500',
        text: 'text-blue-800 dark:text-blue-300'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-gray-700',
        border: 'border-purple-500',
        text: 'text-purple-800 dark:text-purple-300'
      },
      cyan: {
        bg: 'bg-cyan-50 dark:bg-gray-700',
        border: 'border-cyan-500',
        text: 'text-cyan-800 dark:text-cyan-300'
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-700',
        border: 'border-gray-500',
        text: 'text-gray-800 dark:text-gray-300'
      }
    };
    
    return colorMap[color]?.[element] || colorMap.gray[element];
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

  const formatDate = (date: Date) => {
    return format(date, 'PP');
  };

  // Filter events for the selected date
  const filteredEvents = events.filter(event => {
    if (!date) return false;
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  }).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Filter for upcoming tasks
  const upcomingTasks = tasks.filter(task => !task.isCompleted)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Smart Study Planner
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Plan your study schedule and track your tasks
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Study Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule" className="flex items-center">
            <CalendarCheck className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            AI Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view or add study sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>Study Sessions</CardTitle>
                    <CardDescription>
                      {date ? formatDate(date) : 'Select a date'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map(event => (
                        <div key={event.id} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{event.startTime}</span>
                            <div className="h-full w-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{event.endTime}</span>
                          </div>
                          <div 
                            className={`flex-1 min-w-0 ${getColorClass(event.color, 'bg')} p-3 rounded-lg border-l-4 ${getColorClass(event.color, 'border')} ${event.isCompleted ? 'opacity-60' : ''}`}
                          >
                            <div className="flex justify-between">
                              <h4 className={`text-sm font-medium ${getColorClass(event.color, 'text')} ${event.isCompleted ? 'line-through' : ''}`}>
                                {event.title}
                              </h4>
                              <div className="flex space-x-1">
                                {!event.isCompleted ? (
                                  <button 
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                    onClick={() => handleCompleteEvent(event.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <span className="text-green-600 dark:text-green-400">
                                    <Check className="h-4 w-4" />
                                  </span>
                                )}
                                <button 
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{event.description}</p>
                            <div className="mt-2 flex items-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                {event.subject}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">No study sessions</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {date ? 'No study sessions scheduled for this date' : 'Select a date to view study sessions'}
                      </p>
                      {date && (
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => setShowTaskForm(true)}
                        >
                          Add a study session
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {showTaskForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Study Session</CardTitle>
                <CardDescription>Schedule a new study session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        placeholder="E.g., Calculus Study Session" 
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select 
                        value={newTask.subject} 
                        onValueChange={(value) => setNewTask({...newTask, subject: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Literature">Literature</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input 
                      id="description" 
                      placeholder="What will you study?" 
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTask.date ? format(newTask.date, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newTask.date}
                            onSelect={(date) => date && setNewTask({...newTask, date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input 
                        id="start-time" 
                        type="time" 
                        value={newTask.startTime}
                        onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input 
                        id="duration" 
                        type="number" 
                        placeholder="60" 
                        value={newTask.duration}
                        onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowTaskForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask}>
                      Add to Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your assignments and tasks that need completion</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-2">
                  {upcomingTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Checkbox 
                          id={`task-${task.id}`}
                          checked={task.isCompleted}
                          onCheckedChange={() => handleCompleteTask(task.id)}
                          className="h-4 w-4"
                        />
                        <div className="ml-3">
                          <p className={`text-sm font-medium text-gray-900 dark:text-white ${task.isCompleted ? 'line-through' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Due {formatDate(task.dueDate)}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {task.subject}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">No upcoming tasks</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You're all caught up! Great job.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-planner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Study Plan Generator</CardTitle>
              <CardDescription>Let AI create a personalized study schedule for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Subjects to Study</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiPlanForm.subjects.map(subject => (
                      <div 
                        key={subject}
                        className="bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 py-1 px-3 rounded-full text-sm flex items-center"
                      >
                        {subject}
                        <button 
                          className="ml-2 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
                          onClick={() => handleRemoveSubject(subject)}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Add a subject" 
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                    />
                    <Button variant="outline" onClick={handleAddSubject}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days">Days to Plan</Label>
                    <Select 
                      value={aiPlanForm.daysAvailable.toString()} 
                      onValueChange={(value) => setAiPlanForm({...aiPlanForm, daysAvailable: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                        <SelectItem value="14">2 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours per Day</Label>
                    <Select 
                      value={aiPlanForm.hoursPerDay.toString()} 
                      onValueChange={(value) => setAiPlanForm({...aiPlanForm, hoursPerDay: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours per day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleGenerateAIPlan}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>Generating Plan...</>
                  ) : (
                    <>Generate AI Study Plan</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
