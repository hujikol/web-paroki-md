export default function AdminErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Invalid username or password. Please try again.
        </p>
        <a
          href="/admin/login"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
