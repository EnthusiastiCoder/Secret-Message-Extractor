import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="mt-4 text-gray-600 dark:text-gray-300">
            <p className="text-2xl font-semibold mb-2">Page Not Found</p>
            <p className="text-lg">The page you're looking for doesn't exist.</p>
          </div>
        </div>
        
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  )
}
