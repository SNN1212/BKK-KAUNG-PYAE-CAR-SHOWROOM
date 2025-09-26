"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function InstallmentAnalysis() {
  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/View.png)' }}>
      {/* Top Navigation Bar */}
      <nav className="bg-black/70 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-white">BKK KAUNG PYAE CAR SHOWROOM</h1>
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
            <Link href="/admin/analysis" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Analysis
            </Link>
            <Link href="/admin/installment-analysis" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0">
              Installment Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Installment Analysis</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 hover:text-red-500 text-base sm:text-lg font-medium">
                Export Report
              </button>
              <button className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 hover:text-red-500 text-base sm:text-lg font-medium">
                Generate PDF
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-black/20 backdrop-blur-2xl rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Active Installments</h3>
              <p className="text-3xl font-bold text-white">24</p>
            </div>
            <div className="bg-black/20 backdrop-blur-2xl rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Total Collected</h3>
              <p className="text-3xl font-bold text-white">฿2,450,000</p>
            </div>
            <div className="bg-black/20 backdrop-blur-2xl rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Pending Amount</h3>
              <p className="text-3xl font-bold text-white">฿1,200,000</p>
            </div>
            <div className="bg-black/20 backdrop-blur-2xl rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Overdue</h3>
              <p className="text-3xl font-bold text-white">3</p>
            </div>
          </div>

          {/* Installment Details Table */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-md mb-6 sm:mb-8">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Installment Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-black/20 backdrop-blur-2xl">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Car Model
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Paid
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Remaining
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/10 backdrop-blur-2xl divide-y divide-gray-600">
                    <tr className="hover:bg-black/30 backdrop-blur-2xl">
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        John Doe
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        Toyota Camry
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿850,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿425,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿425,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-black/30 backdrop-blur-2xl">
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        Jane Smith
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        Honda Civic
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿720,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿360,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿360,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-md">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Payment History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-black/20 backdrop-blur-2xl">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black/10 backdrop-blur-2xl divide-y divide-gray-600">
                    <tr className="hover:bg-black/30 backdrop-blur-2xl">
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        2024-01-15
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        John Doe
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿50,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        Bank Transfer
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-black/30 backdrop-blur-2xl">
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        2024-01-14
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        Jane Smith
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        ฿45,000
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        Cash
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
