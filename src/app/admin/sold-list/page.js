"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SoldListPage() {
  const [soldCars, setSoldCars] = useState([]);

  useEffect(() => {
    // Load sold cars from localStorage
    const loadSoldCars = () => {
      const savedSoldCars = localStorage.getItem('soldCars');
      if (savedSoldCars) {
        setSoldCars(JSON.parse(savedSoldCars));
      } else {
        setSoldCars([]);
      }
    };

    loadSoldCars();

    // Listen for storage changes (when cars are marked as sold from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'soldCars') {
        loadSoldCars();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleTransferMark = (car) => {
    if (window.confirm(`Mark the sale of ${car.brand} ${car.model} (${car.licenseNo}) as completed? This indicates the ownership transfer is finalized.`)) {
      const updatedSoldCars = soldCars.map(c => {
        if (c.id === car.id) {
          return {
            ...c,
            transferCompleted: true,
            transferDate: new Date().toLocaleDateString('en-GB')
          };
        }
        return c;
      });
      
      setSoldCars(updatedSoldCars);
      localStorage.setItem('soldCars', JSON.stringify(updatedSoldCars));
      alert('Sale marked as completed! Ownership transfer is finalized.');
    }
  };

  const handleMoveBackToCarList = (car) => {
    if (window.confirm(`Move ${car.brand} ${car.model} (${car.licenseNo}) back to the car list?`)) {
      // Remove sold-specific fields and move back to car list
      const { soldDate, soldPrice, customerName, phoneNumber, passportNumber, transferCompleted, transferDate, ...carData } = car;
      
      // Add to car list
      const existingCars = JSON.parse(localStorage.getItem('cars') || '[]');
      const updatedCars = [...existingCars, carData];
      localStorage.setItem('cars', JSON.stringify(updatedCars));
      
      // Remove from sold list
      const updatedSoldCars = soldCars.filter(c => c.id !== car.id);
      setSoldCars(updatedSoldCars);
      localStorage.setItem('soldCars', JSON.stringify(updatedSoldCars));
      
      alert('Car moved back to car list successfully!');
    }
  };

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
            <Link href="/admin/sold-list" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Sold Cars</h2>
          </div>

          {/* Sold Cars Table */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-black/20 backdrop-blur-2xl">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      License
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Sold Price
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black/10 backdrop-blur-2xl divide-y divide-gray-600">
                  {soldCars.length > 0 ? (
                    soldCars.map((car, index) => (
                      <tr key={car.id} className="hover:bg-black/30 backdrop-blur-2xl">
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {index + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {car.licenseNo}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {car.brand || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {car.model || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {car.customerName || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {car.soldPrice 
                            ? (typeof car.soldPrice === 'number' 
                                ? `฿${car.soldPrice.toLocaleString()}` 
                                : `฿${parseInt(car.soldPrice).toLocaleString()}`)
                            : 'N/A'
                          }
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                          {(() => {
                            // First, check if there's a saved profit calculation from the profit calculator
                            const savedCalculations = JSON.parse(localStorage.getItem('profitCalculations') || '[]');
                            const savedCalculation = savedCalculations.find(calc => calc.carId === car.id);
                            
                            if (savedCalculation) {
                              // Use the saved profit calculation from profit calculator
                              const profit = savedCalculation.profit;
                              const profitFormatted = profit >= 0 ? `฿${profit.toLocaleString()}` : `-฿${Math.abs(profit).toLocaleString()}`;
                              const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';
                              return (
                                <span className={profitColor} title={`From Profit Calculator (${savedCalculation.lastUpdated})`}>
                                  {profitFormatted}
                                </span>
                              );
                            }
                            
                            // Check if profit was calculated during installment transfer
                            if (car.profit !== undefined) {
                              const profit = car.profit;
                              const profitFormatted = profit >= 0 ? `฿${profit.toLocaleString()}` : `-฿${Math.abs(profit).toLocaleString()}`;
                              const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';
                              return (
                                <span className={profitColor} title={`From Installment Transfer (Original: ฿${car.originalPrice?.toLocaleString() || 'N/A'}, Sold: ฿${typeof car.soldPrice === 'string' ? car.soldPrice?.replace('฿', '').replace(',', '') : car.soldPrice?.toLocaleString() || 'N/A'}, Expenses: ฿${car.totalExpenses?.toLocaleString() || 'N/A'})`}>
                                  {profitFormatted}
                                </span>
                              );
                            }
                            
                            // Fallback to basic calculation if no saved calculation exists
                            if (car.soldPrice && car.price) {
                              // Use the same calculation logic as profit calculator
                              const originalPrice = parseFloat(car.price?.replace('฿', '').replace(',', '') || 0);
                              const soldPrice = typeof car.soldPrice === 'string' 
                                ? parseFloat(car.soldPrice?.replace('฿', '').replace(',', '') || 0)
                                : parseFloat(car.soldPrice || 0);
                              
                              // Calculate total expenses (repair costs, fees, etc.)
                              let totalExpenses = 0;
                              if (car.financeFee) {
                                totalExpenses += parseFloat(car.financeFee?.replace('฿', '').replace(',', '') || 0);
                              }
                              
                              // Calculate profit using the same formula as profit calculator
                              // Profit = Selling Price - (Original Price + Total Expenses)
                              const profit = soldPrice - (originalPrice + totalExpenses);
                              
                              const profitFormatted = profit >= 0 ? `฿${profit.toLocaleString()}` : `-฿${Math.abs(profit).toLocaleString()}`;
                              const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';
                              return (
                                <span className={profitColor} title="Basic calculation (use Profit Calculator for detailed calculation)">
                                  {profitFormatted}
                                </span>
                              );
                            }
                            return 'N/A';
                          })()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                          {car.transferCompleted ? (
                            <span className="bg-green-600/20 backdrop-blur-md text-green-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium border border-green-500/30">
                              ✅ Completed
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleTransferMark(car);
                              }}
                              className="bg-black/20 backdrop-blur-md text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-black/30 hover:text-blue-500 font-medium border border-white/30 transition-all duration-200 cursor-pointer"
                            >
                              Name Transfer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-white/70">
                        No sold cars found. Mark cars as sold from the car details or edit car page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}