"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PhotoViewer from "../../../components/PhotoViewer";

export default function EditCar() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id;
  
  const [formData, setFormData] = useState({
    licenseNo: "",
    brand: "",
    model: "",
    engine: "",
    color: "",
    wd: "",
    gear: "",
    price: "",
    year: "",
    purchasedKilo: "",
    financeFee: "",
    repairHistory: [],
    carPhoto: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRepairHistory, setShowRepairHistory] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldPrice, setSoldPrice] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    phoneNumber: "",
    passportNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const [repairHistory, setRepairHistory] = useState([]);

  useEffect(() => {
    // Simulate loading car data
    setTimeout(() => {
      // This is mock data - replace with actual data fetching
      const mockCar = {
        id: carId,
        licenseNo: "ABC-123",
        brand: "Toyota",
        model: "Camry",
        engine: "2.5L",
        color: "White",
        wd: "FWD",
        gear: "Auto",
        price: "25000",
        year: "2023",
        financeFee: "5000",
        repairHistory: "Regular maintenance every 6 months. Oil change completed. Brake pads replaced at 50,000 km.",
        carPhoto: "/admin.png"
      };
      setFormData(mockCar);
      setShowRepairHistory(!!mockCar.repairHistory);
      setLoading(false);
    }, 500);
  }, [carId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      carPhoto: file
    }));
  };

  const addRepairHistory = () => {
    setRepairHistory(prev => [...prev, { details: '', amount: '' }]);
  };

  const removeRepairHistory = (index) => {
    setRepairHistory(prev => prev.filter((_, i) => i !== index));
  };

  const updateRepairHistory = (index, field, value) => {
    setRepairHistory(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call for updating car
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Car updated successfully!");
      // Redirect back to car details
      router.push(`/admin/car-details/${carId}`);
    } catch (error) {
      alert("Error updating car. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsSold = () => {
    if (!formData.licenseNo || !formData.brand || !formData.model) {
      alert("Please fill in the required car information before marking as sold.");
      return;
    }

    // Set default sold price to original price
    setSoldPrice(formData.price.replace('฿', '').replace(',', ''));
    setShowSoldModal(true);
  };

  const handleSoldSubmit = () => {
    if (!soldPrice || soldPrice.trim() === '') {
      alert("Please enter the sold price.");
      return;
    }

    if (!customerInfo.customerName.trim()) {
      alert("Please enter the customer name.");
      return;
    }

    if (!customerInfo.phoneNumber.trim()) {
      alert("Please enter the phone number.");
      return;
    }

    // Add to sold cars
    const soldCars = JSON.parse(localStorage.getItem('soldCars') || '[]');
    const soldCar = {
      id: parseInt(carId),
      licenseNo: formData.licenseNo,
      brand: formData.brand,
      model: formData.model,
      engine: formData.engine,
      color: formData.color,
      wd: formData.wd,
      gear: formData.gear,
      price: formData.price,
      year: formData.year,
      purchasedKilo: formData.purchasedKilo,
      financeFee: formData.financeFee,
      repairHistory: repairHistory,
      carPhoto: formData.carPhoto,
      soldDate: new Date().toLocaleDateString('en-GB'),
      soldPrice: `฿${parseInt(soldPrice).toLocaleString()}`,
      customerName: customerInfo.customerName,
      phoneNumber: customerInfo.phoneNumber,
      passportNumber: customerInfo.passportNumber
    };
    soldCars.push(soldCar);
    localStorage.setItem('soldCars', JSON.stringify(soldCars));

    // Remove from regular cars
    const savedCars = JSON.parse(localStorage.getItem('cars') || '[]');
    const updatedCars = savedCars.filter(c => c.id !== parseInt(carId));
    localStorage.setItem('cars', JSON.stringify(updatedCars));

    alert(`"${formData.brand} ${formData.model}" has been marked as sold for ${soldCar.soldPrice} and moved to the sold list!`);
    
    // Close modal and redirect
    setShowSoldModal(false);
    setSoldPrice("");
    setCustomerInfo({ customerName: "", phoneNumber: "", passportNumber: "" });
    router.push('/admin/dashboard');
  };

  const handleSoldCancel = () => {
    setShowSoldModal(false);
    setSoldPrice("");
    setCustomerInfo({ customerName: "", phoneNumber: "", passportNumber: "" });
  };

  const handleLogout = () => {
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-xl">Loading car details...</div>
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
        <Link href={`/admin/car-details/${carId}`} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
          ← Back to Details
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0 mt-8 sm:mt-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Edit Car</h2>
            <div className="flex space-x-4">
              <Link href="/admin/dashboard" className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="licenseNo" className="block text-base font-medium text-white mb-2">
                    License No. *
                  </label>
                  <input
                    type="text"
                    id="licenseNo"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., ABC-123"
                  />
                </div>

                <div>
                  <label htmlFor="brand" className="block text-base font-medium text-white mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Toyota"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-base font-medium text-white mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Camry"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-base font-medium text-white mb-2">
                    Selling Price (฿) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 25000"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-base font-medium text-white mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., White"
                  />
                </div>

                <div>
                  <label htmlFor="engine" className="block text-base font-medium text-white mb-2">
                    Engine Power *
                  </label>
                  <input
                    type="text"
                    id="engine"
                    name="engine"
                    value={formData.engine}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 2.5L"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-base font-medium text-white mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1900"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 2023"
                  />
                </div>

                <div>
                  <label htmlFor="purchasedKilo" className="block text-base font-medium text-white mb-2">
                    Purchased Kilo (km) *
                  </label>
                  <input
                    type="number"
                    id="purchasedKilo"
                    name="purchasedKilo"
                    value={formData.purchasedKilo}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                  />
                </div>

                <div>
                  <label htmlFor="wd" className="block text-base font-medium text-white mb-2">
                    WD *
                  </label>
                  <select
                    id="wd"
                    name="wd"
                    value={formData.wd}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select WD</option>
                    <option value="FWD">Front Wheel Drive (FWD)</option>
                    <option value="RWD">Rear Wheel Drive (RWD)</option>
                    <option value="AWD">All Wheel Drive (AWD)</option>
                    <option value="4WD">Four Wheel Drive (4WD)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="gear" className="block text-base font-medium text-white mb-2">
                    Gear Type *
                  </label>
                  <select
                    id="gear"
                    name="gear"
                    value={formData.gear}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Gear Type</option>
                    <option value="Manual">Manual</option>
                    <option value="Auto">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="Semi-Auto">Semi-Automatic</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="financeFee" className="block text-base font-medium text-white mb-2">
                    Finance Fee (฿)
                  </label>
                  <input
                    type="number"
                    id="financeFee"
                    name="financeFee"
                    value={formData.financeFee}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>

              {/* Car Photo Upload */}
              <div>
                <label htmlFor="carPhoto" className="block text-base font-medium text-white mb-2">
                  Car Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-black/30">
                  <div className="space-y-1 text-center">
                    {formData.carPhoto ? (
                      <div className="space-y-2">
                        <PhotoViewer 
                          src={typeof formData.carPhoto === 'string' ? formData.carPhoto : URL.createObjectURL(formData.carPhoto)} 
                          alt="Car preview" 
                          className="mx-auto h-32 w-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <div className="flex justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, carPhoto: null }))}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 cursor-pointer"
                          >
                            Remove Photo
                          </button>
                          <label
                            htmlFor="carPhoto"
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer"
                          >
                            Change Photo
                            <input
                              id="carPhoto"
                              name="carPhoto"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="carPhoto"
                            className="relative cursor-pointer bg-black/50 rounded-md font-medium text-red-500 hover:text-red-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="carPhoto"
                              name="carPhoto"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Repair History */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-bold text-white">Repair History</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newShowState = !showRepairHistory;
                      setShowRepairHistory(newShowState);
                      // Auto-add first repair entry when opening
                      if (newShowState && repairHistory.length === 0) {
                        setRepairHistory([{ details: '', amount: '' }]);
                      }
                    }}
                    className="flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    {showRepairHistory ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </button>
                </div>
                {showRepairHistory && (
                  <div className="space-y-4">
                    {repairHistory.map((item, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Repair details"
                            value={item.details}
                            onChange={(e) => updateRepairHistory(index, 'details', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            placeholder="Amount (฿)"
                            value={item.amount}
                            onChange={(e) => updateRepairHistory(index, 'amount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRepairHistory(index)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRepairHistory}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      + Add Repair
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/admin/car-details/${carId}`} className="bg-black/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base font-medium border border-white/30 transition-all duration-200 cursor-pointer text-center">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-black/30 hover:text-red-500 disabled:bg-black/10 disabled:cursor-not-allowed text-base font-medium border border-white/30 transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? "Updating..." : "Update Car"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleMarkAsSold}
                  disabled={isSubmitting}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 hover:text-red-200 disabled:bg-red-400 disabled:cursor-not-allowed text-base font-medium transition-all duration-200 cursor-pointer"
                >
                  Mark as Sold
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sold Price Modal */}
      {showSoldModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mark Car as Sold</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car: {formData.brand} {formData.model} ({formData.licenseNo})
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price: {formData.price}
                  </label>
                </div>

                <div>
                  <label htmlFor="soldPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Sold Price *
                  </label>
                  <input
                    type="number"
                    id="soldPrice"
                    value={soldPrice}
                    onChange={(e) => setSoldPrice(e.target.value)}
                    placeholder="Enter sold price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerInfo.customerName}
                    onChange={(e) => setCustomerInfo({...customerInfo, customerName: e.target.value})}
                    placeholder="Enter customer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={customerInfo.phoneNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, phoneNumber: e.target.value})}
                    placeholder="Enter phone number"
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
                    value={customerInfo.passportNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, passportNumber: e.target.value})}
                    placeholder="Enter passport number (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSoldCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 hover:text-red-500 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSoldSubmit}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:text-red-200 font-medium cursor-pointer"
                  >
                    Mark as Sold
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
