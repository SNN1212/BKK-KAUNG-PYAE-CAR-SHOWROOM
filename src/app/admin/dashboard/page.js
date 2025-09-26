"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    carModel: "",
    licensePlate: "",
    customerName: "",
    passportNumber: "",
    phoneNumber: "",
    carPrice: "",
    downPayment: "",
    monthlyPayment: "",
    installmentPeriod: "",
    purchasedDate: "",
    carListNo: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create installment entry
    const installmentData = {
      id: Date.now(),
      carModel: formData.carModel,
      licensePlate: formData.licensePlate,
      customerName: formData.customerName,
      passportNumber: formData.passportNumber,
      phoneNumber: formData.phoneNumber,
      carPrice: formData.carPrice,
      downPayment: formData.downPayment,
      monthlyPayment: formData.monthlyPayment,
      installmentPeriod: formData.installmentPeriod,
      purchasedDate: formData.purchasedDate,
      carListNo: formData.carListNo
    };

    // Save to localStorage
    const existingInstallments = JSON.parse(localStorage.getItem('installments') || '[]');
    const updatedInstallments = [...existingInstallments, installmentData];
    localStorage.setItem('installments', JSON.stringify(updatedInstallments));

    // Remove car from car list since it's now in installments
    const existingCars = JSON.parse(localStorage.getItem('cars') || '[]');
    const updatedCars = existingCars.filter(car => 
      car.licenseNo !== formData.licensePlate && car.carList !== formData.carListNo
    );
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    
    // Update the cars state to reflect the removal
    setCars(updatedCars);

    alert("Installment added successfully! Car has been moved from car list to installment list.");
    
    setShowAddModal(false);
    setFormData({
      carModel: "",
      licensePlate: "",
      customerName: "",
      passportNumber: "",
      phoneNumber: "",
      carPrice: "",
      downPayment: "",
      monthlyPayment: "",
      installmentPeriod: "",
      purchasedDate: "",
      carListNo: ""
    });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setFormData({
      carModel: "",
      licensePlate: "",
      customerName: "",
      passportNumber: "",
      phoneNumber: "",
      carPrice: "",
      downPayment: "",
      monthlyPayment: "",
      installmentPeriod: "",
      purchasedDate: "",
      carListNo: ""
    });
  };

  const handleAddCarToInstallment = (car) => {
    // Check if car already exists in installments
    const existingInstallments = JSON.parse(localStorage.getItem('installments') || '[]');
    const carExists = existingInstallments.some(installment => 
      installment.licensePlate === car.licenseNo || installment.carListNo === car.carList
    );

    if (carExists) {
      alert("This car is already in the installment list!");
      return;
    }

    // Pre-fill form with car data
    setFormData({
      carModel: `${car.brand} ${car.model}`,
      licensePlate: car.licenseNo,
      customerName: "",
      passportNumber: "",
      phoneNumber: "",
      carPrice: car.price.replace('฿', '').replace(',', ''), // Remove currency formatting
      downPayment: "",
      monthlyPayment: "",
      installmentPeriod: "",
      purchasedDate: new Date().toLocaleDateString('en-GB'),
      carListNo: car.carList
    });
    
    setShowAddModal(true);
  };

  useEffect(() => {
    // Load cars from localStorage
    const savedCars = localStorage.getItem('cars');
    if (savedCars) {
      const cars = JSON.parse(savedCars);
      
      // Remove cars that are already in installments
      const existingInstallments = JSON.parse(localStorage.getItem('installments') || '[]');
      const filteredCars = cars.filter(car => 
        !existingInstallments.some(installment => 
          installment.licensePlate === car.licenseNo
        )
      );
      
      // Update localStorage if cars were removed
      if (filteredCars.length !== cars.length) {
        localStorage.setItem('cars', JSON.stringify(filteredCars));
      }
      
      setCars(filteredCars);
    } else {
      // Initialize with default cars if none exist
      const defaultCars = [
        { id: 1, licenseNo: "ABC-123", brand: "Toyota", model: "Camry", engine: "2.5L", color: "White", wd: "FWD", gear: "Auto", price: "฿25,000" },
        { id: 2, licenseNo: "XYZ-789", brand: "Honda", model: "Civic", engine: "1.8L", color: "Blue", wd: "FWD", gear: "Manual", price: "฿22,000" },
        { id: 3, licenseNo: "DEF-456", brand: "Ford", model: "Focus", engine: "2.0L", color: "Red", wd: "FWD", gear: "Auto", price: "฿20,000" },
      ];
      setCars(defaultCars);
      localStorage.setItem('cars', JSON.stringify(defaultCars));
    }
  }, []);


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
            <Link href="/admin/dashboard" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0">
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Car Inventory</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Link href="/admin/add-car" className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium w-full sm:w-auto border border-white/30 transition-all duration-200 cursor-pointer">
                Add New Car
              </Link>
            </div>
          </div>

          {/* Car Table */}
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
                      Engine
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      WD
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Gear
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black/10 backdrop-blur-2xl divide-y divide-gray-600">
                  {cars.map((car, index) => (
                    <tr key={car.id} className="hover:bg-black/30 backdrop-blur-2xl">
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-medium text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {index + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.licenseNo}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.brand}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.model}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.engine}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.color}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.wd}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.gear}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white cursor-pointer" onClick={() => window.location.href = `/admin/car-details/${car.id}`}>
                        {car.price}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
                        <div className="flex flex-col space-y-2">
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link href={`/admin/edit-car/${car.id}`} className="bg-black/20 backdrop-blur-md text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-black/30 hover:text-red-500 font-medium border border-white/30 transition-all duration-200 cursor-pointer">
                              Edit
                            </Link>
                            <Link href={`/admin/profit-calculator/${car.id}`} className="bg-black/20 backdrop-blur-md text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-black/30 hover:text-red-500 font-medium flex items-center justify-center min-w-[28px] sm:min-w-[32px] border border-white/30 transition-all duration-200 cursor-pointer">
                              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </Link>
                          </div>
                          <button
                            onClick={() => handleAddCarToInstallment(car)}
                            className="bg-black/20 backdrop-blur-md text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-black/30 hover:text-green-500 font-medium border border-white/30 transition-all duration-200 cursor-pointer w-full sm:w-auto"
                          >
                            Add in Installment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Installment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Installment</h3>
              
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
                      Car Model
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      name="carModel"
                      value={formData.carModel}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                      License Plate
                    </label>
                    <input
                      type="text"
                      id="licensePlate"
                      name="licensePlate"
                      value={formData.licensePlate}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., +66-999-999"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., A12345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="carPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Car Price
                    </label>
                    <input
                      type="number"
                      id="carPrice"
                      name="carPrice"
                      value={formData.carPrice}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
                      Down Payment
                    </label>
                    <input
                      type="number"
                      id="downPayment"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleInputChange}
                      placeholder="100000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="monthlyPayment" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Payment
                    </label>
                    <input
                      type="number"
                      id="monthlyPayment"
                      name="monthlyPayment"
                      value={formData.monthlyPayment}
                      onChange={handleInputChange}
                      placeholder="45000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="purchasedDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Purchased Date
                    </label>
                    <input
                      type="date"
                      id="purchasedDate"
                      name="purchasedDate"
                      value={formData.purchasedDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="installmentPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                      Installment Period (Months)
                    </label>
                    <input
                      type="number"
                      id="installmentPeriod"
                      name="installmentPeriod"
                      value={formData.installmentPeriod}
                      onChange={handleInputChange}
                      placeholder="12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 hover:text-red-500 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:text-red-200 font-medium cursor-pointer"
                    >
                      Add Installment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
