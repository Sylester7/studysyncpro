import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, Calendar, Clock, Award, TrendingUp, 
  BookOpen, BarChart2, PieChart, Activity, Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Analytics() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);

  // Sample data - in a real app, this would be fetched from API
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      studyHours: 14.5,
      studyHoursChange: '+2.3%',
      focusScore: 85,
      focusScoreChange: '+5%',
      tasksCompleted: 12,
      tasksCompletedChange: '-1',
      productivity: 78,
      productivityChange: '+8%',
      subjectDistribution: [
        { name: 'Mathematics', percentage: 35, color: 'primary' },
        { name: 'Physics', percentage: 25, color: 'secondary' },
        { name: 'Literature', percentage: 20, color: 'accent' },
        { name: 'History', percentage: 15, color: 'yellow' },
        { name: 'Other', percentage: 5, color: 'gray' }
      ],
      dailyActivity: [
        { day: 'Mon', hours: 2.5, percentage: 75 },
        { day: 'Tue', hours: 3.0, percentage: 85 },
        { day: 'Wed', hours: 1.5, percentage: 45 },
        { day: 'Thu', hours: 2.2, percentage: 65 },
        { day: 'Fri', hours: 3.5, percentage: 90 },
        { day: 'Sat', hours: 1.0, percentage: 30 },
        { day: 'Sun', hours: 0.8, percentage: 25 }
      ]
    },
    productivity: {
      weeklyTrend: [60, 75, 60, 85, 70, 90, 80],
      focusTimes: {
        morning: 35,
        afternoon: 45,
        evening: 20
      },
      distractions: [
        { source: 'Social Media', minutes: 45, percentage: 40 },
        { source: 'Email', minutes: 20, percentage: 18 },
        { source: 'Phone', minutes: 25, percentage: 22 },
        { source: 'Other', minutes: 22, percentage: 20 }
      ],
      streakDays: 4,
      longestStreak: 7
    },
    subjects: {
      performance: [
        { subject: 'Mathematics', mastery: 75, timeSpent: 5.2, tasks: 4 },
        { subject: 'Physics', mastery: 65, timeSpent: 3.8, tasks: 3 },
        { subject: 'Literature', mastery: 80, timeSpent: 2.5, tasks: 2 },
        { subject: 'History', mastery: 55, timeSpent: 1.5, tasks: 2 },
        { subject: 'Computer Science', mastery: 85, timeSpent: 1.5, tasks: 1 }
      ],
      improvement: [
        { subject: 'Mathematics', change: '+5%' },
        { subject: 'Physics', change: '+8%' },
        { subject: 'Literature', change: '+2%' },
        { subject: 'History', change: '-3%' },
        { subject: 'Computer Science', change: '+10%' }
      ]
    },
    achievements: {
      earned: [
        { name: 'Early Bird', icon: 'coffee', description: 'Study before 9am for 5 days' },
        { name: 'Focus Master', icon: 'zap', description: 'Maintain 90%+ focus score for 3 sessions' },
        { name: 'Bookworm', icon: 'book', description: 'Complete 10 study sessions' }
      ],
      progress: [
        { name: '10-Hour Milestone', current: 14.5, target: 10, completed: true },
        { name: '5-Day Streak', current: 4, target: 5, completed: false },
        { name: '20 Sessions', current: 12, target: 20, completed: false },
        { name: 'Perfect Week', current: 5, target: 7, completed: false }
      ]
    }
  });

  // Simulating API fetch when time range changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, [timeRange]);

  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "Your analytics data has been exported to CSV.",
    });
  };

  const getColorClass = (color: string, element: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      primary: {
        bg: 'bg-primary-600 dark:bg-primary-500',
        text: 'text-primary-600 dark:text-primary-400'
      },
      secondary: {
        bg: 'bg-secondary-600 dark:bg-secondary-500',
        text: 'text-secondary-600 dark:text-secondary-400'
      },
      accent: {
        bg: 'bg-accent-600 dark:bg-accent-500',
        text: 'text-accent-600 dark:text-accent-400'
      },
      yellow: {
        bg: 'bg-yellow-500 dark:bg-yellow-600',
        text: 'text-yellow-600 dark:text-yellow-400'
      },
      gray: {
        bg: 'bg-gray-500 dark:bg-gray-400',
        text: 'text-gray-600 dark:text-gray-400'
      }
    };
    
    return colorMap[color]?.[element] || colorMap.gray[element];
  };

  const getChangeTextColor = (change: string) => {
    if (change.startsWith('+')) {
      return 'text-green-600 dark:text-green-400';
    } else if (change.startsWith('-')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your study progress, productivity, and achievements
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Productivity
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Hours</span>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {analyticsData.overview.studyHours}
                    </p>
                    <p className={`ml-2 text-sm font-medium ${getChangeTextColor(analyticsData.overview.studyHoursChange)}`}>
                      {analyticsData.overview.studyHoursChange}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Score</span>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {analyticsData.overview.focusScore}%
                    </p>
                    <p className={`ml-2 text-sm font-medium ${getChangeTextColor(analyticsData.overview.focusScoreChange)}`}>
                      {analyticsData.overview.focusScoreChange}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</span>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {analyticsData.overview.tasksCompleted}
                    </p>
                    <p className={`ml-2 text-sm font-medium ${getChangeTextColor(analyticsData.overview.tasksCompletedChange)}`}>
                      {analyticsData.overview.tasksCompletedChange}
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
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Productivity</span>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {analyticsData.overview.productivity}%
                    </p>
                    <p className={`ml-2 text-sm font-medium ${getChangeTextColor(analyticsData.overview.productivityChange)}`}>
                      {analyticsData.overview.productivityChange}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>How your study time is split across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.overview.subjectDistribution.map((subject, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24">{subject.name}</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`${getColorClass(subject.color, 'bg')} h-2.5 rounded-full`}
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">{subject.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Your study performance over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between h-44">
                  {analyticsData.overview.dailyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center justify-end h-full">
                      <div 
                        className="w-8 bg-primary-100 dark:bg-primary-800 rounded-t-md relative group" 
                        style={{ height: `${day.percentage}%` }}
                      >
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.hours} hours
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Productivity Trend</CardTitle>
                <CardDescription>Your productivity scores for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between h-44">
                  {analyticsData.productivity.weeklyTrend.map((score, index) => (
                    <div key={index} className="flex flex-col items-center justify-end h-full">
                      <div 
                        className="w-8 bg-primary-600 dark:bg-primary-500 rounded-t-md relative group" 
                        style={{ height: `${score}%` }}
                      >
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {score}%
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Day {index + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Focus Times</CardTitle>
                <CardDescription>When you're most productive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <PieChart className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
                    <div className="w-full space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Morning</span>
                          <span>{analyticsData.productivity.focusTimes.morning}%</span>
                        </div>
                        <Progress value={analyticsData.productivity.focusTimes.morning} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Afternoon</span>
                          <span>{analyticsData.productivity.focusTimes.afternoon}%</span>
                        </div>
                        <Progress value={analyticsData.productivity.focusTimes.afternoon} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Evening</span>
                          <span>{analyticsData.productivity.focusTimes.evening}%</span>
                        </div>
                        <Progress value={analyticsData.productivity.focusTimes.evening} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {analyticsData.productivity.streakDays}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {analyticsData.productivity.longestStreak}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distraction Analysis</CardTitle>
              <CardDescription>Sources that interrupted your focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.productivity.distractions.map((distraction, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{distraction.source}</span>
                      <span>{distraction.minutes} mins ({distraction.percentage}%)</span>
                    </div>
                    <Progress value={distraction.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Mastery level and time spent on each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.subjects.performance.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">{subject.subject}</h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{subject.timeSpent} hours</span>
                            <span className="mx-2">•</span>
                            <span>{subject.tasks} tasks</span>
                            <span className="ml-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                              {analyticsData.subjects.improvement.find(item => item.subject === subject.subject)?.change || '0%'}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{subject.mastery}%</span>
                      </div>
                      <Progress value={subject.mastery} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Earned Achievements</CardTitle>
                <CardDescription>Badges you've unlocked through your study habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {analyticsData.achievements.earned.map((achievement, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-2">
                        {achievement.icon === 'coffee' ? (
                          <Coffee className="h-8 w-8 text-primary-600 dark:text-primary-300" />
                        ) : achievement.icon === 'zap' ? (
                          <Zap className="h-8 w-8 text-primary-600 dark:text-primary-300" />
                        ) : (
                          <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-300" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{achievement.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{achievement.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
                <CardDescription>Track your progress towards the next achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.achievements.progress.map((achievement, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{achievement.name}</span>
                        <span>{achievement.current}/{achievement.target}</span>
                      </div>
                      <Progress 
                        value={(achievement.current / achievement.target) * 100} 
                        className={`h-2 ${achievement.completed ? 'bg-green-500' : ''}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

// Icons
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function Coffee(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}
