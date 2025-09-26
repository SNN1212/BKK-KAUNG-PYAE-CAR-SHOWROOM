"use client";
import Link from "next/link";

export default function AnalysisPage() {
  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
      {/* Top Navigation Bar */}
      <nav className="bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">BKK KAUNG PYAE CAR SHOWROOM</h1>
            <button 
              onClick={handleLogout}
              className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <nav className="bg-black/70 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap space-x-4 sm:space-x-8 h-12 sm:h-14 overflow-x-auto scrollbar-hide">
            <Link href="/admin/dashboard" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Car List
            </Link>
            <Link href="/admin/installments" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Installments
            </Link>
            <Link href="/admin/installment-calculator" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Installment Calculator
            </Link>
            <Link href="/admin/sold-list" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Sold List
            </Link>
            <Link href="/admin/analysis" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0">
              Analysis
            </Link>
            <Link href="/admin/installment-analysis" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Installment Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">Business Analysis</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-sm sm:text-base font-medium text-gray-300">Total Sales</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">฿125,000</div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-sm sm:text-base font-medium text-gray-300">Total Profit</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">฿18,500</div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-sm sm:text-base font-medium text-gray-300">Cars Sold</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">24</div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-sm sm:text-base font-medium text-gray-300">Growth Rate</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">+12%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Sales Trend</h3>
              <div className="h-48 sm:h-64 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-gray-400 text-base sm:text-lg">Chart placeholder</span>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Top Selling Brands</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base text-white">Toyota</span>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-white">40%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base text-white">Honda</span>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-white">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base text-white">Ford</span>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-white">20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 sm:mt-8 bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center text-sm sm:text-base text-white">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3"></span>
                New car added: Toyota Camry 2024
              </div>
              <div className="flex items-center text-sm sm:text-base text-white">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
                Car sold: Honda Civic to John Doe
              </div>
              <div className="flex items-center text-sm sm:text-base text-white">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                Installment payment received: ฿500
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
