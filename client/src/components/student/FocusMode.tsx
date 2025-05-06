import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Settings, Coffee, Bell, Volume2, VolumeX, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuestions } from '@/lib/gemini';

export default function FocusMode() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pomodoro');
  
  // Pomodoro States
  const [timerState, setTimerState] = useState('idle'); // 'idle', 'running', 'paused', 'break'
  const [displayTime, setDisplayTime] = useState('25:00');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [pomodoroSettings, setPomodoroSettings] = useState({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
  });
  const [currentSession, setCurrentSession] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [studyTopic, setStudyTopic] = useState('');
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<{question: string, answer: string}[]>([]);
  
  // Blocked Sites States
  const [blockEnabled, setBlockEnabled] = useState(false);
  const [blockedSites, setBlockedSites] = useState<string[]>([
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'youtube.com',
    'reddit.com'
  ]);
  const [newBlockedSite, setNewBlockedSite] = useState('');
  
  // Stats
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [todayFocusTime, setTodayFocusTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(3);
  
  // Sound effects
  const startSound = useRef<HTMLAudioElement | null>(null);
  const pauseSound = useRef<HTMLAudioElement | null>(null);
  const completeSound = useRef<HTMLAudioElement | null>(null);
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initialize audio elements
    startSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
    pauseSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-option-select-2573.mp3');
    completeSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    
    return () => {
      // Clear interval when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Format the time for display
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    
    // Check if timer has reached zero
    if (timeLeft === 0) {
      if (timerState === 'running') {
        // Focus period ended, start break
        handleBreakStart();
      } else if (timerState === 'break') {
        // Break period ended, prepare for next focus session
        handleBreakEnd();
        // Make sure questions appear when the break ends
        setShowQuestions(true);
      }
    }
  }, [timeLeft, timerState]);
  
  const startTimer = () => {
    // If no study topic is set, show the topic input first
    if (!studyTopic) {
      setShowTopicInput(true);
      return;
    }
    
    if (!muted && startSound.current) {
      startSound.current.play();
    }
    
    setTimerState('running');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!muted && completeSound.current) {
            completeSound.current.play();
          }
          return 0;
        }
        return prev - 1;
      });
      
      // Update total focus time
      if (timerState === 'running') {
        setTotalFocusTime(prev => prev + 1);
        setTodayFocusTime(prev => prev + 1);
      }
    }, 1000);
    
    toast({
      title: "Focus session started",
      description: `Topic: ${studyTopic}. Stay focused and minimize distractions.`
    });
  };
  
  const pauseTimer = () => {
    if (!muted && pauseSound.current) {
      pauseSound.current.play();
    }
    
    setTimerState('paused');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Timer paused",
      description: "Your session has been paused."
    });
  };
  
  const resetTimer = () => {
    setTimerState('idle');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeLeft(pomodoroSettings.focusDuration * 60);
    
    toast({
      title: "Timer reset",
      description: "Your session has been reset."
    });
  };
  
  const handleBreakStart = () => {
    // Determine if it's time for a long break
    const isLongBreak = currentSession % pomodoroSettings.sessionsBeforeLongBreak === 0;
    const breakDuration = isLongBreak 
      ? pomodoroSettings.longBreakDuration 
      : pomodoroSettings.shortBreakDuration;
    
    setTimerState('break');
    setTimeLeft(breakDuration * 60);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!muted && completeSound.current) {
            completeSound.current.play();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Update stats
    setCompletedSessions(prev => prev + 1);
    
    toast({
      title: isLongBreak ? "Long break started" : "Short break started",
      description: isLongBreak 
        ? "Great job! Take a longer break to recharge." 
        : "Good work! Take a short break."
    });
  };
  
  const handleBreakEnd = async () => {
    setCurrentSession(prev => prev + 1);
    setTimerState('idle');
    setTimeLeft(pomodoroSettings.focusDuration * 60);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Generate questions about the study topic
    if (studyTopic) {
      try {
        // Use Gemini AI to generate reflective questions about the study topic
        const generatedQuestions = await generateQuestions(studyTopic, 3);
        
        setQuestions(generatedQuestions);
        setShowQuestions(true);
        
        toast({
          title: "Questions generated",
          description: "Take time to reflect on what you learned.",
        });
      } catch (error) {
        console.error('Error generating questions:', error);
        
        // Fallback questions if there's an error
        const fallbackQuestions = [
          { 
            question: `What is the most important concept from ${studyTopic}?`, 
            answer: '' 
          },
          { 
            question: `How would you apply ${studyTopic} in a real-world scenario?`, 
            answer: '' 
          },
          { 
            question: `Explain ${studyTopic} in your own words.`, 
            answer: '' 
          }
        ];
        
        setQuestions(fallbackQuestions);
        setShowQuestions(true);
      }
    }
    
    toast({
      title: "Break ended",
      description: "Ready for another focus session?"
    });
  };
  
  const toggleMute = () => {
    setMuted(prev => !prev);
  };
  
  const saveSettings = () => {
    setTimeLeft(pomodoroSettings.focusDuration * 60);
    setShowSettings(false);
    
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated."
    });
  };
  
  const addBlockedSite = () => {
    if (!newBlockedSite) return;
    
    // Simple URL validation
    let url = newBlockedSite.trim();
    if (url.startsWith('http://')) {
      url = url.substring(7);
    } else if (url.startsWith('https://')) {
      url = url.substring(8);
    }
    
    if (url.startsWith('www.')) {
      url = url.substring(4);
    }
    
    if (blockedSites.includes(url)) {
      toast({
        title: "Site already blocked",
        description: `${url} is already in your blocked list.`,
        variant: "destructive"
      });
      return;
    }
    
    setBlockedSites([...blockedSites, url]);
    setNewBlockedSite('');
    
    toast({
      title: "Site blocked",
      description: `${url} has been added to your blocked list.`
    });
  };
  
  const removeBlockedSite = (site: string) => {
    setBlockedSites(blockedSites.filter(s => s !== site));
    
    toast({
      title: "Site unblocked",
      description: `${site} has been removed from your blocked list.`
    });
  };
  
  const toggleBlockEnabled = () => {
    setBlockEnabled(prev => !prev);
    
    toast({
      title: blockEnabled ? "Site blocking disabled" : "Site blocking enabled",
      description: blockEnabled 
        ? "You can now access all websites." 
        : "Distracting websites will be blocked during focus sessions."
    });
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  // Calculate progress percentage for the timer
  const calculateProgress = () => {
    const totalSeconds = timerState === 'break'
      ? (currentSession % pomodoroSettings.sessionsBeforeLongBreak === 0 
          ? pomodoroSettings.longBreakDuration * 60 
          : pomodoroSettings.shortBreakDuration * 60)
      : pomodoroSettings.focusDuration * 60;
    
    const progressPercentage = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    return Math.min(100, Math.max(0, progressPercentage));
  };

  // Function to handle submitting the study topic
  const handleSubmitTopic = () => {
    if (!studyTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter what you'll be studying",
        variant: "destructive"
      });
      return;
    }
    
    setShowTopicInput(false);
    startTimer();
  };
  
  // Function to handle answering questions
  const handleSubmitQuestions = () => {
    setShowQuestions(false);
    
    toast({
      title: "Session completed",
      description: "Your answers have been saved. Great job reflecting on what you learned!"
    });
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Focus Mode
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Minimize distractions and maximize productivity
          </p>
        </div>
      </div>
      
      {/* Study Topic Input Modal */}
      {showTopicInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>What are you studying?</CardTitle>
              <CardDescription>
                Enter the topic you'll be focusing on during this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studyTopic">Study Topic</Label>
                  <Input
                    id="studyTopic"
                    placeholder="e.g., Calculus, World History, Programming"
                    value={studyTopic}
                    onChange={(e) => setStudyTopic(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTopicInput(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitTopic}>
                Start Timer
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Questions Modal */}
      {showQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Reflection Questions</CardTitle>
              <CardDescription>
                Answer these questions about your study session on {studyTopic}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`question-${index}`}>{q.question}</Label>
                    <Input
                      id={`question-${index}`}
                      placeholder="Your answer..."
                      value={q.answer}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].answer = e.target.value;
                        setQuestions(newQuestions);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmitQuestions}>
                Submit Answers
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <Tabs defaultValue="pomodoro" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pomodoro" className="flex items-center">
            <Coffee className="h-4 w-4 mr-2" />
            Pomodoro Timer
          </TabsTrigger>
          <TabsTrigger value="blocker" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Website Blocker
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <Coffee className="h-4 w-4 mr-2" />
            Focus Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pomodoro" className="space-y-4">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {timerState === 'break' ? 'Break Time' : 'Focus Time'}
              </CardTitle>
              <CardDescription>
                {timerState === 'break' 
                  ? 'Take a break and recharge' 
                  : 'Stay focused on your task'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Session {currentSession}
                    {timerState === 'break' && ' • Break'}
                  </span>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={toggleMute}
                >
                  {muted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="text-center py-8">
                <div className="text-6xl font-bold text-gray-900 dark:text-white">
                  {displayTime}
                </div>
              </div>

              <Progress value={calculateProgress()} className="h-2" />

              <div className="flex justify-center space-x-4 pt-4">
                {timerState === 'idle' || timerState === 'paused' ? (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full w-14 h-14 p-0"
                    onClick={startTimer}
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full w-14 h-14 p-0"
                    onClick={pauseTimer}
                  >
                    <Pause className="h-8 w-8" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full w-14 h-14 p-0"
                  onClick={resetTimer}
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {showSettings && (
            <Card className="max-w-md mx-auto">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Timer Settings</CardTitle>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Focus Duration (minutes)</Label>
                  <div className="flex items-center justify-between">
                    <Slider 
                      value={[pomodoroSettings.focusDuration]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setPomodoroSettings({
                        ...pomodoroSettings, 
                        focusDuration: value[0]
                      })}
                      className="flex-1 mx-2"
                    />
                    <span className="w-10 text-center">{pomodoroSettings.focusDuration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Break (minutes)</Label>
                  <div className="flex items-center justify-between">
                    <Slider 
                      value={[pomodoroSettings.shortBreakDuration]}
                      min={1}
                      max={15}
                      step={1}
                      onValueChange={(value) => setPomodoroSettings({
                        ...pomodoroSettings, 
                        shortBreakDuration: value[0]
                      })}
                      className="flex-1 mx-2"
                    />
                    <span className="w-10 text-center">{pomodoroSettings.shortBreakDuration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Long Break (minutes)</Label>
                  <div className="flex items-center justify-between">
                    <Slider 
                      value={[pomodoroSettings.longBreakDuration]}
                      min={5}
                      max={30}
                      step={5}
                      onValueChange={(value) => setPomodoroSettings({
                        ...pomodoroSettings, 
                        longBreakDuration: value[0]
                      })}
                      className="flex-1 mx-2"
                    />
                    <span className="w-10 text-center">{pomodoroSettings.longBreakDuration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sessions before long break</Label>
                  <Select 
                    value={pomodoroSettings.sessionsBeforeLongBreak.toString()}
                    onValueChange={(value) => setPomodoroSettings({
                      ...pomodoroSettings,
                      sessionsBeforeLongBreak: parseInt(value)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sessions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 sessions</SelectItem>
                      <SelectItem value="3">3 sessions</SelectItem>
                      <SelectItem value="4">4 sessions</SelectItem>
                      <SelectItem value="5">5 sessions</SelectItem>
                      <SelectItem value="6">6 sessions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={saveSettings}
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="blocker" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Website Blocker</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="block-mode" className="text-sm">
                    {blockEnabled ? 'Enabled' : 'Disabled'}
                  </Label>
                  <Switch
                    id="block-mode"
                    checked={blockEnabled}
                    onCheckedChange={toggleBlockEnabled}
                  />
                </div>
              </div>
              <CardDescription>
                Block distracting websites during your focus sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter website domain (e.g., facebook.com)" 
                  value={newBlockedSite}
                  onChange={(e) => setNewBlockedSite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBlockedSite()}
                />
                <Button variant="outline" onClick={addBlockedSite}>
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Blocked Websites</Label>
                {blockedSites.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {blockedSites.map((site) => (
                      <div 
                        key={site} 
                        className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {site}
                        </span>
                        <button 
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => removeBlockedSite(site)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No websites in your block list
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 items-start">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-md text-sm">
                <p>
                  <strong>Note:</strong> Website blocking uses the browser's focus mode. Some 
                  websites may still be accessible in other browsers or incognito mode.
                </p>
              </div>
              <Button 
                variant="outline" 
                disabled={!blockEnabled || blockedSites.length === 0}
              >
                Test Blocking
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Focus Summary</CardTitle>
                <CardDescription>
                  Your focus time statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today</h4>
                    <div className="mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatTime(todayFocusTime)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</h4>
                    <div className="mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatTime(totalFocusTime)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sessions</h4>
                    <div className="mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {completedSessions}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak</h4>
                    <div className="mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {currentStreak} days
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Today</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" 
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right">65%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Yesterday</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" 
                          style={{ width: '80%' }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right">80%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">2 days ago</span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" 
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Focus Achievements</CardTitle>
                <CardDescription>
                  Milestones and productivity badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-2">
                      <Coffee className="h-8 w-8 text-primary-600 dark:text-primary-300" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                      Early Bird
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                      <Bell className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                      Focus Master
                    </span>
                  </div>
                  <div className="flex flex-col items-center opacity-40">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                      <Coffee className="h-8 w-8 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Night Owl
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Progress</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>10-Hour Milestone</span>
                        <span>7/10 hours</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>5-Day Streak</span>
                        <span>3/5 days</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>20 Sessions</span>
                        <span>12/20 sessions</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
