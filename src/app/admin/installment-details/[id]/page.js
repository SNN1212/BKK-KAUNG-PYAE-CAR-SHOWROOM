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
  
  // Penalty fees for each month
  const [penaltyFees, setPenaltyFees] = useState({});

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
    // Directly transfer without profit calculator
    if (installment) {
      // Update owner book status
      setOwnerBookStatus('transferred');
      
      // Move car from installment list to sold list
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
        soldDate: new Date().toLocaleDateString('en-GB'),
        soldPrice: installment.carPrice ? `฿${parseInt(installment.carPrice).toLocaleString()}` : 'N/A',
        customerName: installment.customerName,
        phoneNumber: installment.phoneNumber,
        passportNumber: installment.passportNumber,
        transferCompleted: true,
        transferDate: new Date().toLocaleDateString('en-GB')
      };

      // Add to sold cars list
      const existingSoldCars = JSON.parse(localStorage.getItem('soldCars') || '[]');
      const updatedSoldCars = [...existingSoldCars, soldCarData];
      localStorage.setItem('soldCars', JSON.stringify(updatedSoldCars));

      // Remove from installment list
      const existingInstallments = JSON.parse(localStorage.getItem('installments') || '[]');
      const updatedInstallments = existingInstallments.filter(inst => inst.id.toString() !== installmentId);
      localStorage.setItem('installments', JSON.stringify(updatedInstallments));
      
      alert("Owner book transfer completed! Car has been moved to sold list.");
      
      // Redirect to sold list
      window.location.href = '/admin/sold-list';
    }
  };

  const handlePenaltyFeeChange = (monthNumber, value) => {
    setPenaltyFees(prev => ({
      ...prev,
      [monthNumber]: parseFloat(value) || 0
    }));
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
                          className={`bg-black/30 rounded-lg p-4 border border-gray-600 transition-all duration-200 ${
                            isPaid ? 'border-green-500 bg-green-900/20' : 'hover:border-gray-500'
                          }`}
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <p className="text-sm text-gray-300">Month {monthNumber}</p>
                              <button
                                onClick={() => handlePaymentClick(monthNumber)}
                                className="cursor-pointer"
                              >
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  isPaid 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {isPaid ? 'Paid' : 'Pending'}
                                </span>
                              </button>
                            </div>
                            <p className="text-white text-lg font-bold mb-2">
                              ฿{paymentAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                              Due: {dueDate.toLocaleDateString('en-GB')}
                            </p>
                            {!isPaid && (
                              <div className="mt-2">
                                <label className="block text-xs text-gray-300 mb-1">Penalty Fee (Overdue)</label>
                                <input
                                  type="number"
                                  value={penaltyFees[monthNumber] || ''}
                                  onChange={(e) => handlePenaltyFeeChange(monthNumber, e.target.value)}
                                  placeholder="0"
                                  min="0"
                                  className="w-full px-2 py-1 text-sm border border-gray-500 rounded-md bg-black/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
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

    </div>
  );
}
