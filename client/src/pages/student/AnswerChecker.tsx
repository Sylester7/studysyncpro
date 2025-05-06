
import DashboardLayout from '@/layouts/DashboardLayout';

export default function AnswerChecker() {
  return (
    <DashboardLayout>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Answer Checker
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get instant feedback on your answers
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Feature Removed
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          This feature has been removed as requested.
        </p>
      </div>
    </DashboardLayout>
  );
}
