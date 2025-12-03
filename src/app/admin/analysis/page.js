"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AnalysisPage() {
  const [installments, setInstallments] = useState([]);
  const [soldCars, setSoldCars] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [profitData, setProfitData] = useState({
    monthly: [],
    sixMonths: [],
    yearly: []
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  // Load data from localStorage
  useEffect(() => {
    // Only load sold cars data (exclude installments)
    const soldCarsData = JSON.parse(localStorage.getItem('soldCars') || '[]');
    setSoldCars(soldCarsData);
    
    // Calculate profit data for sold cars only
    calculateProfitData([], soldCarsData);
  }, []);

  // Calculate profit for installment cars (assume 15% profit margin)
  const calculateInstallmentProfit = (car) => {
    const carPrice = parseFloat(car.carPrice) || 0;
    const profitMargin = 0.15; // 15% profit margin
    return carPrice * profitMargin;
  };

  // Calculate profit for sold cars (assume 20% profit margin)
  const parseCurrency = (value) => {
    if (!value && value !== 0) return 0;
    if (typeof value === 'number') return value;
    const cleaned = value.toString().replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const calculateSoldCarProfit = (car) => {
    const carPrice = parseCurrency(car.soldPrice) || parseCurrency(car.sellingPrice) || parseCurrency(car.carPrice);
    const profitMargin = 0.20; // 20% profit margin
    return carPrice * profitMargin;
  };

  // Calculate profit data for different periods (Sold Cars Only)
  const calculateProfitData = (installmentsData, soldCarsData) => {
    const now = new Date();
    const monthlyData = [];
    const sixMonthsData = [];
    const yearlyData = [];

    // Monthly profit calculation (Sold Cars Only)
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      let monthlyProfit = 0;
      let soldCount = 0;

      // Calculate sold car profits only
      soldCarsData.forEach(car => {
        const soldDate = new Date(car.soldDate || car.purchaseDate);
        if (soldDate.getFullYear() === date.getFullYear() && 
            soldDate.getMonth() === date.getMonth()) {
          monthlyProfit += calculateSoldCarProfit(car);
          soldCount++;
        }
      });

      monthlyData.unshift({
        month: monthKey,
        profit: monthlyProfit,
        installmentCars: 0, // Always 0 for sold cars analysis
        soldCars: soldCount,
        totalCars: soldCount
      });
    }

    // Six months profit calculation (Sold Cars Only)
    for (let i = 0; i < 6; i++) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
      
      let monthProfit = 0;
      let soldCount = 0;

      soldCarsData.forEach(car => {
        const soldDate = new Date(car.soldDate || car.purchaseDate);
        if (soldDate >= startDate && soldDate <= endDate) {
          monthProfit += calculateSoldCarProfit(car);
          soldCount++;
        }
      });

      sixMonthsData.unshift({
        month: monthKey,
        profit: monthProfit,
        installmentCars: 0, // Always 0 for sold cars analysis
        soldCars: soldCount,
        totalCars: soldCount
      });
    }

    // Yearly profit calculation (Sold Cars Only)
    for (let i = 0; i < 5; i++) {
      const year = now.getFullYear() - i;
      let yearlyProfit = 0;
      let soldCount = 0;

      soldCarsData.forEach(car => {
        const soldDate = new Date(car.soldDate || car.purchaseDate);
        if (soldDate.getFullYear() === year) {
          yearlyProfit += calculateSoldCarProfit(car);
          soldCount++;
        }
      });

      yearlyData.unshift({
        year: year.toString(),
        profit: yearlyProfit,
        installmentCars: 0, // Always 0 for sold cars analysis
        soldCars: soldCount,
        totalCars: soldCount
      });
    }

    setProfitData({
      monthly: monthlyData,
      sixMonths: sixMonthsData,
      yearly: yearlyData
    });
  };

  // Get current period data
  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'monthly':
        return profitData.monthly;
      case 'sixMonths':
        return profitData.sixMonths;
      case 'yearly':
        return profitData.yearly;
      default:
        return profitData.monthly;
    }
  };

  // Calculate total profit for current period
  const getTotalProfit = () => {
    const data = getCurrentData();
    return data.reduce((total, item) => total + item.profit, 0);
  };

  // Calculate total cars for current period
  const getTotalCars = () => {
    const data = getCurrentData();
    return data.reduce((total, item) => total + item.totalCars, 0);
  };

  // Export to CSV (Excel compatible)
  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const data = getCurrentData();
      const periodLabel = selectedPeriod === 'yearly' ? 'Year' : 'Month';
      
      // Create CSV content
      let csvContent = `${periodLabel},Profit (฿),Sold Cars,Average Profit per Car (฿)\n`;
      
      // Add data rows
      data.forEach(item => {
        const period = selectedPeriod === 'yearly' ? item.year : item.month;
        const avgProfit = item.totalCars > 0 ? (item.profit / item.totalCars) : 0;
        csvContent += `${period},${item.profit},${item.soldCars},${avgProfit}\n`;
      });
      
      // Add summary rows
      csvContent += `\n`;
      csvContent += `SUMMARY,,,\n`;
      csvContent += `Total Profit,${getTotalProfit()},,\n`;
      csvContent += `Total Sold Cars,,${getTotalCars()},\n`;
      csvContent += `Average Profit per Car,,,${getTotalCars() > 0 ? (getTotalProfit() / getTotalCars()) : 0}\n`;
      csvContent += `Period,${selectedPeriod === 'monthly' ? 'Last 12 Months' : selectedPeriod === 'sixMonths' ? 'Last 6 Months' : 'Last 5 Years'},,\n`;
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `BKK_SoldCars_Analysis_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('CSV export error:', error);
      setIsExporting(false);
    }
  };

  // Export to PDF using browser print functionality
  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const data = getCurrentData();
      const periodText = selectedPeriod === 'monthly' ? 'Last 12 Months' : 
                        selectedPeriod === 'sixMonths' ? 'Last 6 Months' : 'Last 5 Years';
      
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>BKK KAUNG PYAE CAR SHOWROOM - Profit Analysis</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #dc3545; }
            .subtitle { font-size: 18px; margin-top: 10px; }
            .info { margin-bottom: 20px; }
            .summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #dc3545; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">BKK KAUNG PYAE CAR SHOWROOM</div>
            <div class="subtitle">Sold Cars Analysis Report</div>
          </div>
          
          <div class="info">
            <p><strong>Period:</strong> ${periodText}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Profit:</strong> ฿${getTotalProfit().toLocaleString()}</p>
            <p><strong>Total Sold Cars:</strong> ${getTotalCars()}</p>
            <p><strong>Average Profit per Car:</strong> ฿${getTotalCars() > 0 ? (getTotalProfit() / getTotalCars()).toLocaleString() : '0'}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${selectedPeriod === 'yearly' ? 'Year' : 'Month'}</th>
                <th>Profit (฿)</th>
                <th>Sold Cars</th>
                <th>Avg Profit/Car</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td>${selectedPeriod === 'yearly' ? item.year : item.month}</td>
                  <td>฿${item.profit.toLocaleString()}</td>
                  <td>${item.soldCars}</td>
                  <td>฿${item.totalCars > 0 ? (item.profit / item.totalCars).toLocaleString() : '0'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | BKK KAUNG PYAE CAR SHOWROOM</p>
          </div>
        </body>
        </html>
      `;
      
      // Open new window with content and trigger print
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        setIsExporting(false);
      }, 500);
      
    } catch (error) {
      console.error('PDF export error:', error);
      setIsExporting(false);
    }
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Sold Cars Analysis</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={exportToExcel}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isExporting ? 'Exporting...' : 'CSV'}
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isExporting ? 'Exporting...' : 'PDF'}
                </button>
              </div>
              
              {/* Period Selection */}
              <div className="flex bg-black/30 backdrop-blur-md rounded-lg p-1">
                <button
                  onClick={() => setSelectedPeriod('monthly')}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all ${
                    selectedPeriod === 'monthly' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPeriod('sixMonths')}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all ${
                    selectedPeriod === 'sixMonths' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setSelectedPeriod('yearly')}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all ${
                    selectedPeriod === 'yearly' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  <div className="text-2xl sm:text-3xl font-semibold text-white">฿{getTotalProfit().toLocaleString()}</div>
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
                  <div className="text-sm sm:text-base font-medium text-gray-300">Sold Cars</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">{getTotalCars()}</div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-sm sm:text-base font-medium text-gray-300">Profit Margin</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">20%</div>
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
                  <div className="text-sm sm:text-base font-medium text-gray-300">Total Sales</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white">฿{(soldCars.reduce((total, car) => total + parseCurrency(car.soldPrice || car.sellingPrice || car.carPrice), 0)).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
              Profit Trend - {selectedPeriod === 'monthly' ? 'Last 12 Months' : selectedPeriod === 'sixMonths' ? 'Last 6 Months' : 'Last 5 Years'}
            </h3>
            <div className="h-64 sm:h-80 bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-end justify-between h-full space-x-2">
                {getCurrentData().map((item, index) => {
                  const maxProfit = Math.max(...getCurrentData().map(d => d.profit));
                  const height = maxProfit > 0 ? (item.profit / maxProfit) * 100 : 0;
                  const period = selectedPeriod === 'yearly' ? item.year : item.month;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs sm:text-sm text-gray-300 mb-2 text-center">
                        {selectedPeriod === 'yearly' ? period : period.split('-')[1]}
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t transition-all duration-500 hover:from-red-500 hover:to-red-300"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${period}: ฿${item.profit.toLocaleString()}`}
                      ></div>
                      <div className="text-xs text-gray-400 mt-2 text-center">
                        ฿{item.profit > 1000 ? `${(item.profit/1000).toFixed(1)}k` : item.profit.toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Profit Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Sold Cars Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-white font-medium">Total Sold Cars</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">
                      ฿{getTotalProfit().toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {getTotalCars()} cars
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-white font-medium">Average Profit per Car</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">
                      ฿{getTotalCars() > 0 ? (getTotalProfit() / getTotalCars()).toLocaleString() : '0'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      20% margin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Profit Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Profit per Car:</span>
                  <span className="text-white font-semibold">
                    ฿{getTotalCars() > 0 ? (getTotalProfit() / getTotalCars()).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Highest Month/Year:</span>
                  <span className="text-white font-semibold">
                    {getCurrentData().length > 0 ? 
                      (selectedPeriod === 'yearly' ? 
                        getCurrentData().reduce((max, item) => item.profit > max.profit ? item : max).year :
                        getCurrentData().reduce((max, item) => item.profit > max.profit ? item : max).month
                      ) : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Periods:</span>
                  <span className="text-white font-semibold">{getCurrentData().length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Periods:</span>
                  <span className="text-white font-semibold">
                    {getCurrentData().filter(item => item.profit > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit List */}
          <div className="bg-black/20 backdrop-blur-2xl p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
              Profit Details - {selectedPeriod === 'monthly' ? 'Monthly' : selectedPeriod === 'sixMonths' ? '6 Months' : 'Yearly'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                      {selectedPeriod === 'yearly' ? 'Year' : 'Month'}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Sold Cars
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Avg Profit/Car
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/30 divide-y divide-gray-700">
                  {getCurrentData().map((item, index) => (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-white">
                        {selectedPeriod === 'yearly' ? item.year : item.month}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-green-400 font-semibold">
                        ฿{item.profit.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-yellow-300">
                        {item.soldCars}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-blue-300">
                        ฿{item.totalCars > 0 ? (item.profit / item.totalCars).toLocaleString() : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
