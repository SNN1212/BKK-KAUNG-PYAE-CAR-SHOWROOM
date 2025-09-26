"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function InstallmentDetails() {
  const params = useParams();
  const installmentId = params.id;
  
  const [installment, setInstallment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [paidMonths, setPaidMonths] = useState(new Set());
  const [ownerBookStatus, setOwnerBookStatus] = useState('pending'); // 'pending', 'ready', 'transferred'
  
  // Profit calculation modal state
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [profitData, setProfitData] = useState({
    originalPrice: 0,
    soldPrice: 0,
    totalExpenses: 0,
    profit: 0
  });
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ details: '', amount: '' });

  useEffect(() => {
    // Load installment data from localStorage
    const savedInstallments = localStorage.getItem('installments');
    
    if (savedInstallments) {
      try {
        const installments = JSON.parse(savedInstallments);
        const foundInstallment = installments.find(inst => inst.id.toString() === installmentId);
        
        if (foundInstallment) {
          setInstallment(foundInstallment);
          setLoading(false);
        } else {
          setInstallment(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing installments data:", error);
        setInstallment(null);
        setLoading(false);
      }
    } else {
      setInstallment(null);
      setLoading(false);
    }
  }, [installmentId]);


  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };



  const handleCompletePayment = () => {
    // Mark all months as paid
    const allMonths = Array.from({ length: parseInt(installment.installmentPeriod) || 0 }, (_, index) => index + 1);
    setPaidMonths(new Set(allMonths));
    
    // Update saved data with new payment status
    const savedData = localStorage.getItem(`installment_${installmentId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        parsedData.paidMonths = Array.from(allMonths);
        localStorage.setItem(`installment_${installmentId}`, JSON.stringify(parsedData));
      } catch (error) {
        console.error("Error updating saved data:", error);
      }
    }
  };

  const handleOwnerBookTransfer = () => {
    // Initialize profit calculation data
    if (installment) {
      const originalPrice = parseInt(installment.carPrice) || 0;
      const soldPrice = parseInt(installment.carPrice) || 0; // Default to car price
      
      setProfitData({
        originalPrice: originalPrice,
        soldPrice: soldPrice,
        totalExpenses: 0,
        profit: soldPrice - originalPrice
      });
      
      // Show profit calculation modal
      setShowProfitModal(true);
    }
  };

  const handleProfitInputChange = (field, value) => {
    setProfitData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
    
    // Recalculate profit when inputs change
    if (field === 'originalPrice' || field === 'soldPrice' || field === 'totalExpenses') {
      const originalPrice = field === 'originalPrice' ? (parseFloat(value) || 0) : prev.originalPrice;
      const soldPrice = field === 'soldPrice' ? (parseFloat(value) || 0) : prev.soldPrice;
      const totalExpenses = field === 'totalExpenses' ? (parseFloat(value) || 0) : prev.totalExpenses;
      
      setProfitData(prev => ({
        ...prev,
        [field]: parseFloat(value) || 0,
        profit: soldPrice - (originalPrice + totalExpenses)
      }));
    }
  };

  const addExpense = () => {
    if (newExpense.details.trim() && newExpense.amount.trim()) {
      const expense = {
        id: Date.now(),
        details: newExpense.details,
        amount: parseFloat(newExpense.amount) || 0
      };
      
      const updatedExpenses = [...expenses, expense];
      setExpenses(updatedExpenses);
      
      // Recalculate total expenses and profit
      const totalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const profit = profitData.soldPrice - (profitData.originalPrice + totalExpenses);
      
      setProfitData(prev => ({
        ...prev,
        totalExpenses: totalExpenses,
        profit: profit
      }));
      
      setNewExpense({ details: '', amount: '' });
    }
  };

  const removeExpense = (expenseId) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    setExpenses(updatedExpenses);
    
    // Recalculate total expenses and profit
    const totalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = profitData.soldPrice - (profitData.originalPrice + totalExpenses);
    
    setProfitData(prev => ({
      ...prev,
      totalExpenses: totalExpenses,
      profit: profit
    }));
  };

  const handleCompleteTransfer = () => {
    // Update owner book status
    setOwnerBookStatus('transferred');
    
    // Move car from installment list to sold list with profit data
    if (installment) {
      // Create sold car entry with profit information
      const soldCarData = {
        id: installment.id,
        carList: installment.carListNo,
        licenseNo: installment.licensePlate,
        brand: installment.carModel ? installment.carModel.split(' ')[0] : 'Unknown',
        model: installment.carModel ? installment.carModel.split(' ').slice(1).join(' ') : 'Unknown',
        engine: 'N/A',
        color: 'N/A',
        wd: 'N/A',
        gear: 'N/A',
        price: installment.carPrice ? `฿${parseInt(installment.carPrice).toLocaleString()}` : 'N/A',
        year: 'N/A',
        purchasedKilo: 'N/A',
        financeFee: 'N/A',
        repairHistory: 'N/A',
        carPhoto: '/admin.png',
        // Sold car specific fields
        soldDate: new Date().toLocaleDateString('en-GB'),
        soldPrice: `฿${profitData.soldPrice.toLocaleString()}`,
        customerName: installment.customerName,
        phoneNumber: installment.phoneNumber,
        passportNumber: installment.passportNumber,
        transferCompleted: true,
        transferDate: new Date().toLocaleDateString('en-GB'),
        // Profit calculation data
        originalPrice: profitData.originalPrice,
        totalExpenses: profitData.totalExpenses,
        profit: profitData.profit,
        expenses: expenses
      };

      // Add to sold cars list
      const existingSoldCars = JSON.parse(localStorage.getItem('soldCars') || '[]');
      const updatedSoldCars = [...existingSoldCars, soldCarData];
      localStorage.setItem('soldCars', JSON.stringify(updatedSoldCars));

      // Remove from installment list
      const existingInstallments = JSON.parse(localStorage.getItem('installments') || '[]');
      const updatedInstallments = existingInstallments.filter(inst => inst.id.toString() !== installmentId);
      localStorage.setItem('installments', JSON.stringify(updatedInstallments));

      console.log('Transfer completed with profit data:', {
        originalPrice: profitData.originalPrice,
        soldPrice: profitData.soldPrice,
        totalExpenses: profitData.totalExpenses,
        profit: profitData.profit,
        expenses: expenses
      });
      
      alert("Owner book transfer completed! Car has been moved to sold list with profit calculation.");
      
      // Close modal and redirect to sold list
      setShowProfitModal(false);
      window.location.href = '/admin/sold-list';
    }
  };

  const handlePaymentClick = (monthNumber) => {
    setPaidMonths(prev => {
      const newPaidMonths = new Set(prev);
      if (newPaidMonths.has(monthNumber)) {
        newPaidMonths.delete(monthNumber); // Unmark as paid
      } else {
        newPaidMonths.add(monthNumber); // Mark as paid
      }
      
      // Update saved data with new payment status
      const savedData = localStorage.getItem(`installment_${installmentId}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          parsedData.paidMonths = Array.from(newPaidMonths);
          localStorage.setItem(`installment_${installmentId}`, JSON.stringify(parsedData));
        } catch (error) {
          console.error("Error updating saved data:", error);
        }
      }
      
      return newPaidMonths;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-xl">Loading installment details...</div>
        </div>
      </div>
    );
  }

  if (!installment) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-xl">Installment not found</div>
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

      {/* Back Button - Responsive Positioning */}
      <div className="absolute left-2 sm:left-4 top-16 sm:top-20 z-10">
        <Link href="/admin/installments" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
          ← Back to Installments
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0 mt-8 sm:mt-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Installment Details</h2>
          </div>

          {/* Installment Details Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Customer Information */}
            <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-300">Name</p>
                    <p className="text-white text-lg font-medium">{installment.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Passport Number</p>
                    <p className="text-white text-lg font-medium">{installment.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Phone Number</p>
                    <p className="text-white text-lg font-medium">{installment.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Financial Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-300">Car Price</p>
                    <p className="text-white text-lg font-medium">{installment.carPrice ? `฿${parseInt(installment.carPrice).toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Down Payment</p>
                    <p className="text-white text-lg font-medium">{installment.downPayment ? `฿${parseInt(installment.downPayment).toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Monthly Payment</p>
                    <p className="text-white text-lg font-medium">{installment.monthlyPayment ? `฿${parseInt(installment.monthlyPayment).toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Installment Period</p>
                    <p className="text-white text-lg font-medium">{installment.installmentPeriod || 'N/A'} months</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Vehicle Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-300">Car Model</p>
                    <p className="text-white text-lg font-medium">{installment.carModel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">License Plate</p>
                    <p className="text-white text-lg font-medium">{installment.licensePlate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Car List No.</p>
                    <p className="text-white text-lg font-medium">{installment.carListNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Purchased Date</p>
                    <p className="text-white text-lg font-medium">{installment.purchasedDate || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Installment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-300">Total Amount</p>
                  <p className="text-white text-xl font-bold">{installment.carPrice ? `฿${parseInt(installment.carPrice).toLocaleString()}` : 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-300">Remaining Balance</p>
                  <p className="text-white text-xl font-bold">
                    {installment.carPrice && installment.downPayment ? 
                      `฿${(parseInt(installment.carPrice) - parseInt(installment.downPayment)).toLocaleString()}` : 
                      'N/A'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-300">Total Payments</p>
                  <p className="text-white text-xl font-bold">
                    {installment.monthlyPayment && installment.installmentPeriod ? 
                      `฿${(parseInt(installment.monthlyPayment) * parseInt(installment.installmentPeriod)).toLocaleString()}` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
              
              {/* Payment Schedule Display */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-white">
                    Payment Schedule ({installment.installmentPeriod || 0} months)
                  </h4>
                  <button
                    onClick={handleCompletePayment}
                    className="bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-md hover:bg-black/30 hover:text-red-500 font-medium cursor-pointer border border-white/30 transition-all duration-200"
                  >
                    Complete Payment
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: parseInt(installment.installmentPeriod) || 0 }, (_, index) => {
                      const monthNumber = index + 1;
                      const paymentAmount = parseInt(installment.monthlyPayment) || 0;
                      
                      // Calculate due date from purchased date
                      const dueDate = new Date();
                      if (installment.purchasedDate) {
                        // Convert purchased date string to Date object
                        const [day, month, year] = installment.purchasedDate.split('/');
                        dueDate.setDate(parseInt(day));
                        dueDate.setMonth(parseInt(month) - 1); // Month is 0-indexed
                        dueDate.setFullYear(parseInt(year));
                      }
                      dueDate.setMonth(dueDate.getMonth() + monthNumber);
                      
                      const isPaid = paidMonths.has(monthNumber);
                      
                      return (
                        <div 
                          key={monthNumber} 
                          onClick={() => handlePaymentClick(monthNumber)}
                          className={`bg-black/30 rounded-lg p-4 border border-gray-600 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            isPaid ? 'border-green-500 bg-green-900/20' : 'hover:border-gray-500'
                          }`}
                        >
                          <div className="text-center">
                            <p className="text-sm text-gray-300 mb-1">Month {monthNumber}</p>
                            <p className="text-white text-lg font-bold mb-2">
                              ฿{paymentAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              Due: {dueDate.toLocaleDateString('en-GB')}
                            </p>
                            <div className="mt-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isPaid 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {/* Payment Summary */}
                <div className="mt-6 p-4 bg-black/30 rounded-lg border border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Monthly Payment</p>
                      <p className="text-white text-lg font-bold">
                        ฿{(parseInt(installment.monthlyPayment) || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Paid Amount</p>
                      <p className="text-green-400 text-lg font-bold">
                        ฿{((parseInt(installment.monthlyPayment) || 0) * paidMonths.size).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Remaining</p>
                      <p className="text-yellow-400 text-lg font-bold">
                        ฿{((parseInt(installment.monthlyPayment) || 0) * ((parseInt(installment.installmentPeriod) || 0) - paidMonths.size)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Book Status Section */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Owner Book Status</h3>
              
              <div className="space-y-4">
                {/* Status Display */}
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg border border-gray-600">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Current Status</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        ownerBookStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : ownerBookStatus === 'ready'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {ownerBookStatus === 'pending' ? 'Pending Payment' : 
                         ownerBookStatus === 'ready' ? 'Ready for Transfer' : 
                         'Transferred to Owner'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Transfer Button - Only show when all payments are complete */}
                  {paidMonths.size === (parseInt(installment.installmentPeriod) || 0) && ownerBookStatus !== 'transferred' && (
                                          <button
                        onClick={handleOwnerBookTransfer}
                        className="bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-md hover:bg-black/30 hover:text-red-500 font-medium cursor-pointer border border-white/30 transition-all duration-200"
                      >
                        Transfer Owner Book
                      </button>
                  )}
                </div>

                {/* Status Information */}
                <div className="text-sm text-gray-300 space-y-2">
                  {ownerBookStatus === 'pending' && (
                    <p>• Owner book will be transferred after all payments are completed</p>
                  )}
                  {ownerBookStatus === 'ready' && (
                    <p>• All payments completed. Owner book is ready for transfer</p>
                  )}
                  {ownerBookStatus === 'transferred' && (
                    <p>• Owner book has been transferred to the customer</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Calculation Modal */}
      {showProfitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profit Calculation - Owner Book Transfer</h3>
              
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Car Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Car Model</label>
                        <p className="text-gray-800 font-medium">{installment?.carModel || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">License Plate</label>
                        <p className="text-gray-800 font-medium">{installment?.licensePlate || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Customer</label>
                        <p className="text-gray-800 font-medium">{installment?.customerName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profit Calculation */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Profit Calculation</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-600 mb-1">
                          Original Price (฿) *
                        </label>
                        <input
                          type="number"
                          id="originalPrice"
                          value={profitData.originalPrice}
                          onChange={(e) => handleProfitInputChange('originalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="soldPrice" className="block text-sm font-medium text-gray-600 mb-1">
                          Sold Price (฿) *
                        </label>
                        <input
                          type="number"
                          id="soldPrice"
                          value={profitData.soldPrice}
                          onChange={(e) => handleProfitInputChange('soldPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Additional Expenses</h4>
                    <div className="space-y-3">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div>
                            <span className="font-medium text-gray-800">{expense.details}</span>
                            <span className="ml-2 text-gray-600">฿{expense.amount.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Expense details"
                          value={newExpense.details}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, details: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={addExpense}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profit Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Profit Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sold Price:</span>
                        <span className="font-medium text-gray-800">฿{profitData.soldPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="font-medium text-gray-800">฿{profitData.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Expenses:</span>
                        <span className="font-medium text-gray-800">฿{profitData.totalExpenses.toLocaleString()}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-semibold">Profit/Loss:</span>
                        <span className={`font-bold text-lg ${profitData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitData.profit >= 0 ? '+' : ''}฿{profitData.profit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowProfitModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteTransfer}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                >
                  Complete Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
