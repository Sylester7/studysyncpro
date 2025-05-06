import DashboardLayout from '@/layouts/DashboardLayout';

export default function AssignmentsPage() {
  return (
    <DashboardLayout>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Assignments
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage assignments for your students
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          The assignments feature is currently under development. Check back soon for updates!
        </p>
      </div>
    </DashboardLayout>
  );
}