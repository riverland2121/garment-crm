import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            👗 Garment CRM
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Made-to-Measure Business Management System
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Complete solution for ladies ethnic wear business
          </p>
          
          {/* CTA Button */}
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-lg hover:bg-pink-700 transition-colors"
          >
            Open Dashboard →
          </Link>
        </div>

        {/* Success Card */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="ml-4 text-2xl font-semibold text-gray-900">
                Step 2 Complete: Dashboard Added
              </h2>
            </div>
            
            <div className="space-y-3 text-gray-600">
              <p className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Sidebar navigation with 8 menu items
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Dashboard with stats cards and recent orders
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Professional business layout
              </p>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h4 className="font-semibold mb-2">Customer Management</h4>
            <p className="text-sm text-gray-600">
              Track customers with CSV import/export
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h4 className="font-semibold mb-2">Order Tracking</h4>
            <p className="text-sm text-gray-600">
              Manage orders with detailed measurements
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h4 className="font-semibold mb-2">Inventory Control</h4>
            <p className="text-sm text-gray-600">
              Monitor materials and stock levels
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
