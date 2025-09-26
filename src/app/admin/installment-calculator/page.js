"use client";
import Link from "next/link";
import { useState } from "react";

export default function InstallmentCalculatorPage() {
  const [formData, setFormData] = useState({
    carPrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: ''
  });
  const [result, setResult] = useState(null);

  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(formData.carPrice);
    const down = parseFloat(formData.downPayment);
    const rate = parseFloat(formData.interestRate) / 100 / 12;
    const term = parseFloat(formData.loanTerm) * 12;

    const loanAmount = price - down;
    const monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    });
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
            <Link href="/admin/installment-calculator" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0">
              Installment Calculator
            </Link>
            <Link href="/admin/sold-list" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
              Sold List
            </Link>
            <Link href="/admin/analysis" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">Installment Calculator</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Calculator Form */}
            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">Car Price (฿)</label>
                  <input
                    type="number"
                    value={formData.carPrice}
                    onChange={(e) => setFormData({...formData, carPrice: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black text-sm sm:text-base"
                    placeholder="25000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">Down Payment (฿)</label>
                  <input
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) => setFormData({...formData, downPayment: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black text-sm sm:text-base"
                    placeholder="5000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black text-sm sm:text-base"
                    placeholder="5.5"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">Loan Term (Years)</label>
                  <input
                    type="number"
                    value={formData.loanTerm}
                    onChange={(e) => setFormData({...formData, loanTerm: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black text-sm sm:text-base"
                    placeholder="5"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-red-700 transition-colors text-base sm:text-lg font-medium"
                >
                  Calculate
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Results</h3>
              
              {result ? (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 sm:p-6 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-red-900">฿{result.monthlyPayment}</div>
                    <div className="text-sm sm:text-base text-red-600">Monthly Payment</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900">฿{result.totalPayment}</div>
                    <div className="text-sm sm:text-base text-gray-600">Total Payment</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900">฿{result.totalInterest}</div>
                    <div className="text-sm sm:text-base text-gray-600">Total Interest</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-300 text-center py-6 sm:py-8 text-base sm:text-lg">
                  Enter car details and click Calculate to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
