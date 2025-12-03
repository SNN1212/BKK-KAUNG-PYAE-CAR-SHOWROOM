"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProfitCalculator() {
  const params = useParams();
  const carId = params.id;

  const [formData, setFormData] = useState({
    originalPrice: "",
    retailedPrice: "",
    expenses: []
  });

  const [profit, setProfit] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [car, setCar] = useState(null);
  const [newExpense, setNewExpense] = useState({ detail: "", amount: "" });

  const parseCurrency = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    return parseFloat(
      value
        .toString()
        .replace(/[^\d.-]/g, "")
    ) || 0;
  };

  // Load car information and any saved profit calculation from localStorage
  useEffect(() => {
    if (!carId) return;

    const loadCarData = async () => {
      let foundCar = null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Try to fetch from API first to get purchasePrice
      if (API_BASE_URL) {
        try {
          const token = localStorage.getItem('token');
          const headers = {};
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const response = await fetch(`${API_BASE_URL}/api/car/${carId}`, {
            cache: "no-store",
            headers: headers
          });
          
          if (response.ok) {
            const data = await response.json();
            const apiCar = data.data || data;
            
            if (apiCar) {
              // Use purchasePrice from API (the very first purchase price)
              const purchasePrice = apiCar.purchasePrice || apiCar.priceToBuy || apiCar.originalPrice || apiCar.price;
              
              foundCar = {
                ...apiCar,
                purchasePrice: purchasePrice,
                originalPrice: apiCar.originalPrice || apiCar.priceToBuy || purchasePrice,
                price: apiCar.priceToSell || apiCar.price,
                soldPrice: apiCar.soldPrice,
                repairHistory: apiCar.repairs || apiCar.repairHistory || []
              };
            }
          }
        } catch (error) {
          console.error("Error fetching car from API:", error);
        }
      }

      // Fallback to localStorage if API didn't return a car
      if (!foundCar) {
        try {
          const savedCars = JSON.parse(localStorage.getItem("cars") || "[]");
          const soldCars = JSON.parse(localStorage.getItem("soldCars") || "[]");
          const allCars = [...savedCars, ...soldCars];

          foundCar = allCars.find((c) => c?.id?.toString() === carId.toString());
        } catch (error) {
          console.error("Error loading cars from storage:", error);
        }
      }

      if (!foundCar) {
        // Fall back to default seed data so page still works for demo cars
        const defaultCars = [
          { id: 1, carList: "001", licenseNo: "ABC-123", brand: "Toyota", model: "Camry", price: "฿25,000" },
          { id: 2, carList: "002", licenseNo: "XYZ-789", brand: "Honda", model: "Civic", price: "฿22,000" },
          { id: 3, carList: "003", licenseNo: "DEF-456", brand: "Ford", model: "Focus", price: "฿20,000" },
        ];
        foundCar = defaultCars.find((c) => c.id.toString() === carId.toString()) || null;
      }

      setCar(foundCar);

      // Helper function to convert repair history to expenses format
      const convertRepairHistoryToExpenses = (repairHistory) => {
        if (!repairHistory || !Array.isArray(repairHistory)) return [];
        
        return repairHistory
          .filter(item => item !== null && item !== undefined)
          .map((item, index) => {
            // Handle API format: { description, cost, repairDate }
            if (typeof item === 'object') {
              const description = item.description || item.details || '';
              const cost = item.cost !== undefined ? item.cost : item.amount;
              const repairDate = item.repairDate || '';
              
              // Format description with date if available
              let detailText = description;
              if (repairDate) {
                try {
                  const date = new Date(repairDate);
                  const formattedDate = date.toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  detailText = `${description} (${formattedDate})`;
                } catch (e) {
                  detailText = description;
                }
              }
              
              return {
                id: Date.now() + index,
                detail: detailText || 'Repair expense',
                amount: cost !== undefined && cost !== null ? parseCurrency(cost).toString() : '0',
                fromRepairHistory: true
              };
            }
            
            // Handle string format
            if (typeof item === 'string') {
              return {
                id: Date.now() + index,
                detail: item,
                amount: '0',
                fromRepairHistory: true
              };
            }
            
            return null;
          })
          .filter(item => item !== null);
      };

      // Prefill form with saved profit calculation if available
      try {
        const savedCalculations = JSON.parse(localStorage.getItem("profitCalculations") || "[]");
        const existingCalculation = savedCalculations.find(
          (calc) => calc.carId?.toString() === carId.toString()
        );

        if (existingCalculation) {
          // Merge saved expenses with repair history (avoid duplicates)
          const savedExpenses = existingCalculation.expenses || [];
          const repairHistoryData = foundCar?.repairHistory || foundCar?.repairs || [];
          const repairExpenses = convertRepairHistoryToExpenses(repairHistoryData);
          
          // Only add repair history expenses that aren't already in saved expenses
          const mergedExpenses = [...savedExpenses];
          repairExpenses.forEach(repairExp => {
            const exists = savedExpenses.some(savedExp => 
              savedExp.detail === repairExp.detail && 
              savedExp.amount === repairExp.amount
            );
            if (!exists) {
              mergedExpenses.push(repairExp);
            }
          });
          
          setFormData({
            originalPrice: existingCalculation.originalPrice?.toString() || "",
            retailedPrice: existingCalculation.retailedPrice?.toString() || "",
            expenses: mergedExpenses,
          });
          return;
        }
      } catch (error) {
        console.error("Error loading profit calculations:", error);
      }

      if (foundCar) {
        // Use purchasePrice (the very first purchase price) as the original price
        // Priority: purchasePrice > priceToBuy > originalPrice > price
        const purchasePriceValue = foundCar.purchasePrice || 
                                   foundCar.priceToBuy || 
                                   foundCar.originalPrice || 
                                   foundCar.price;
        
        // Convert repair history to expenses (check both repairHistory and repairs fields)
        const repairHistoryData = foundCar.repairHistory || foundCar.repairs || [];
        const repairExpenses = convertRepairHistoryToExpenses(repairHistoryData);
        
        setFormData((prev) => ({
          ...prev,
          originalPrice: parseCurrency(purchasePriceValue).toString(),
          retailedPrice: foundCar.soldPrice ? parseCurrency(foundCar.soldPrice).toString() : "",
          expenses: repairExpenses,
        }));
      }
    };

    loadCarData();
  }, [carId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExpense = () => {
    console.log('Add expense clicked!', newExpense);
    if (newExpense.detail && newExpense.amount) {
      setFormData(prev => ({
        ...prev,
        expenses: [...prev.expenses, { ...newExpense, id: Date.now() }]
      }));
      setNewExpense({ detail: "", amount: "" });
      console.log('Expense added successfully!');
    } else {
      console.log('Missing detail or amount');
    }
  };

  const removeExpense = (id) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  // Calculate profit automatically when any field changes
  useEffect(() => {
    const original = parseCurrency(formData.originalPrice);
    const retail = parseCurrency(formData.retailedPrice);
    
    // Calculate total expense from expenses array
    let totalExpense = 0;
    formData.expenses.forEach(expense => {
      totalExpense += parseCurrency(expense.amount);
    });

    const calculatedProfit = retail - (original + totalExpense);
    const calculatedPercentage = original > 0 ? (calculatedProfit / original) * 100 : 0;

    setProfit(calculatedProfit);
    setProfitPercentage(calculatedPercentage);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to save the profit calculation
    console.log("Profit calculation submitted:", { carId, ...formData, profit, profitPercentage });
  };

  const handleUpdateProfit = () => {
    if (!formData.originalPrice || !formData.retailedPrice) {
      alert("Please fill in both Original Price and Sold Price to calculate profit.");
      return;
    }

    if (!car) {
      alert("Unable to load car information. Please make sure the car still exists in the inventory.");
      return;
    }

    const originalPriceValue = parseCurrency(formData.originalPrice);
    const retailPriceValue = parseCurrency(formData.retailedPrice);
    const totalExpensesValue = formData.expenses.reduce(
      (sum, expense) => sum + parseCurrency(expense.amount),
      0
    );

    // Save profit calculation data to localStorage
    const profitData = {
      carId: parseInt(carId),
      originalPrice: originalPriceValue,
      retailedPrice: retailPriceValue,
      expenses: formData.expenses,
      totalExpenses: totalExpensesValue,
      profit: retailPriceValue - (originalPriceValue + totalExpensesValue),
      profitPercentage: originalPriceValue > 0 ? ((retailPriceValue - (originalPriceValue + totalExpensesValue)) / originalPriceValue) * 100 : 0,
      lastUpdated: new Date().toLocaleDateString('en-GB')
    };

    // Get existing profit calculations
    const existingCalculations = JSON.parse(localStorage.getItem('profitCalculations') || '[]');
    
    // Remove existing calculation for this car if it exists
    const updatedCalculations = existingCalculations.filter(calc => calc.carId !== parseInt(carId));
    
    // Add new calculation
    updatedCalculations.push(profitData);
    
    // Save to localStorage
    localStorage.setItem('profitCalculations', JSON.stringify(updatedCalculations));

    const numericCarId = parseInt(carId);
    let inventoryCars = [];
    let soldCars = [];
    let inventoryCarEntry = null;
    let existingSoldCarIndex = -1;

    try {
      inventoryCars = JSON.parse(localStorage.getItem('cars') || '[]');
      inventoryCarEntry = inventoryCars.find(carItem => carItem?.id?.toString() === carId.toString()) || null;

      soldCars = JSON.parse(localStorage.getItem('soldCars') || '[]');
      existingSoldCarIndex = soldCars.findIndex(carItem => carItem?.id?.toString() === carId.toString());
    } catch (error) {
      console.error('Error loading cars for sale transfer:', error);
    }

    const baseCarData = inventoryCarEntry || soldCars[existingSoldCarIndex] || {
      id: numericCarId,
      carList: car?.carList || '',
      licenseNo: car?.licenseNo || car?.licensePlate || '',
      brand: car?.brand || (car?.carModel ? car.carModel.split(' ')[0] : ''),
      model: car?.model || (car?.carModel ? car.carModel.split(' ').slice(1).join(' ') : ''),
      engine: car?.engine || 'N/A',
      color: car?.color || 'N/A',
      wd: car?.wd || 'N/A',
      gear: car?.gear || 'N/A',
      price: car?.price || formatCurrency(originalPriceValue),
      originalPrice: car?.originalPrice || formatCurrency(originalPriceValue),
      carPhoto: car?.carPhoto || '/admin.png',
      purchasedKilo: car?.purchasedKilo || '',
    };

    const soldCarEntry = {
      ...baseCarData,
      id: numericCarId,
      price: baseCarData.price || formatCurrency(originalPriceValue),
      soldDate: new Date().toLocaleDateString('en-GB'),
      soldPrice: formatCurrency(retailPriceValue),
      customerName: baseCarData.customerName || '',
      phoneNumber: baseCarData.phoneNumber || '',
      passportNumber: baseCarData.passportNumber || '',
      transferCompleted: baseCarData.transferCompleted || false,
      transferDate: baseCarData.transferDate || null,
      originalPrice: formatCurrency(originalPriceValue),
      totalExpenses: totalExpensesValue,
      profit: profitData.profit,
      expenses: formData.expenses,
      profitLastUpdated: profitData.lastUpdated
    };

    // Remove car from inventory if it exists there
    if (inventoryCarEntry) {
      const filteredCars = inventoryCars.filter(carItem => carItem?.id?.toString() !== carId.toString());
      localStorage.setItem('cars', JSON.stringify(filteredCars));
    }

    if (existingSoldCarIndex >= 0) {
      soldCars[existingSoldCarIndex] = soldCarEntry;
    } else {
      soldCars.push(soldCarEntry);
    }

    localStorage.setItem('soldCars', JSON.stringify(soldCars));

    setCar(soldCarEntry);

    const carDisplay = `${soldCarEntry.brand || ''} ${soldCarEntry.model || ''}`.trim() || `Car ID ${carId}`;
    const licenseDisplay = soldCarEntry.licenseNo || soldCarEntry.licensePlate || 'N/A';
    const calculatedProfit = soldCarEntry.profit;
    const calculatedPercentage = profitData.profitPercentage;
    
    alert(`✅ Profit Updated & Car Sold!\n\nCar: ${carDisplay} (${licenseDisplay})\nOriginal Price: ${formatCurrency(originalPriceValue)}\nTotal Expenses: ${formatCurrency(profitData.totalExpenses)}\nSold Price: ${formatCurrency(retailPriceValue)}\nProfit: ${formatCurrency(calculatedProfit)} (${calculatedPercentage.toFixed(2)}%)\n\nThis car has been moved to the sold list with the updated profit details.`);

    setTimeout(() => {
      window.location.href = '/admin/sold-list';
    }, 300);
  };

  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseCurrency(amount));
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
      {/* Top Navigation Bar */}
      <nav className="bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Profit Calculator</h1>
            <button 
              onClick={handleLogout}
              className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0 mt-8 sm:mt-12">
          {/* Back Button - Responsive Positioning */}
          <div className="absolute left-2 sm:left-4 top-16 sm:top-20 z-10">
            <Link href="/admin/dashboard" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Profit Calculator</h2>
              <p className="text-white/80 mt-2">Car: {car.brand} {car.model} - {car.licenseNo}</p>
            </div>
          </div>

          {/* Profit Calculator Form */}
          <div className="bg-black/20 backdrop-blur-2xl shadow-lg rounded-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Input Fields - One by One */}
              <div className="space-y-12">
                {/* Box 1: Original Price */}
                <div className="space-y-6">
                  <label htmlFor="originalPrice" className="block text-base font-medium text-white mb-4">
                    Original Price *
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="Enter original price"
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Box 2: Expenses */}
                <div className="space-y-6">
                  <div className="mb-4">
                    <label className="block text-base font-medium text-white">
                      Expenses
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Repair history expenses are automatically loaded (marked with 🔧)
                    </p>
                  </div>
                  
                  {/* Add New Expense */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        name="detail"
                        value={newExpense.detail}
                        onChange={handleExpenseInputChange}
                        placeholder="Expense detail"
                        className="flex-1 px-4 py-3 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        name="amount"
                        value={newExpense.amount}
                        onChange={handleExpenseInputChange}
                        placeholder="Amount"
                        className="w-28 px-4 py-3 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={addExpense}
                        className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200 font-bold cursor-pointer z-10 relative shadow-lg"
                        style={{ minWidth: '48px', minHeight: '48px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Expense List */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData.expenses.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">No expenses added yet</p>
                    ) : (
                      formData.expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between bg-black/20 rounded-md p-2 border border-gray-600/30">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-white text-sm font-medium truncate">{expense.detail}</span>
                            {expense.fromRepairHistory && (
                              <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-0.5 rounded flex-shrink-0" title="From Repair History">
                                🔧
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{formatCurrency(expense.amount)}</span>
                            <button
                              type="button"
                              onClick={() => removeExpense(expense.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-bold hover:bg-red-400/10 px-1 py-1 rounded transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Box 3: Sold Price */}
                <div className="space-y-6">
                  <label htmlFor="retailedPrice" className="block text-base font-medium text-white mb-4">
                    Sold Price *
                  </label>
                  <input
                    type="number"
                    id="retailedPrice"
                    name="retailedPrice"
                    value={formData.retailedPrice}
                    onChange={handleInputChange}
                    placeholder="Enter sold price"
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Box 4: Profit Summary */}
                <div className="space-y-6">
                  <label className="block text-base font-medium text-white mb-4">
                    Profit Summary
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-600 rounded-md bg-black/30 text-white text-base">
                    {formatCurrency(profit)}
                  </div>
                </div>
              </div>

              {/* Profit Percentage */}
              <div className="bg-black/30 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Profit Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-300">Original Price</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(parseFloat(formData.originalPrice) || 0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300">Total Cost</p>
                    <p className="text-xl font-bold text-white">{formatCurrency((parseFloat(formData.originalPrice) || 0) + formData.expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0))}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300">Profit Amount</p>
                    <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(profit)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300">Profit %</p>
                    <p className={`text-xl font-bold ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {profitPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="button"
                  onClick={handleUpdateProfit}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 font-bold text-lg cursor-pointer shadow-lg"
                >
                  Update Profit
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
