import { Link } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, BookOpen, Book, Calendar, Brain, CheckSquare, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">StudySync</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 mr-4"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-gray-50 dark:bg-gray-900 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
              <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    <span className="block">Transform your learning</span>
                    <span className="block text-primary-600 dark:text-primary-400">with AI-powered tools</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    StudySync helps you organize notes, create flashcards, manage study time, and more—all optimized by artificial intelligence to match your learning style.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link href="/register">
                        <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                          Get started
                        </a>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="#features">
                        <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-900 dark:hover:bg-primary-800 md:py-4 md:text-lg md:px-10">
                          Learn more
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything you need to succeed
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                StudySync combines powerful learning tools with artificial intelligence to help you study smarter, not harder.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Smart Notes & Flashcards</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Automatically convert your notes into organized flashcards with AI-powered summarization and keyword extraction.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Study Planner</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Create personalized study schedules based on your goals, deadlines, and learning patterns.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                      <Book className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Book Marketplace</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Buy, sell, or exchange textbooks with other students at discounted prices.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Focus Mode</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Block distractions and stay focused with customizable Pomodoro timers and website blocking.
                    </p>
                  </CardContent>
                </Card>

                

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                      <Gauge className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics Dashboard</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Track your study habits, productivity, and progress with detailed analytics and insights.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 dark:bg-primary-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-primary-200">Create your account today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register">
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
                    Get started
                  </a>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/login">
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800">
                    Sign in
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="mt-8 md:mt-0">
              <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} StudySync. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}