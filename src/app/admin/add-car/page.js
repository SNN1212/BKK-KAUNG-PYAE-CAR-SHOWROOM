"use client";
import Link from "next/link";
import { useState } from "react";
import PhotoViewer from "../../components/PhotoViewer";

export default function AddCar() {
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
  const [repairHistory, setRepairHistory] = useState([]);

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
      // Create car object with all form data
      const newCar = {
        id: Date.now(), // Generate unique ID
        licenseNo: formData.licenseNo,
        brand: formData.brand,
        model: formData.model,
        engine: formData.engine,
        color: formData.color,
        wd: formData.wd,
        gear: formData.gear,
        price: formData.price ? `฿${parseInt(formData.price).toLocaleString()}` : "",
        year: formData.year,
        purchasedKilo: formData.purchasedKilo,
        financeFee: formData.financeFee ? `฿${parseInt(formData.financeFee).toLocaleString()}` : "",
        repairHistory: repairHistory.length > 0 ? repairHistory.map(repair => 
          `${repair.details}${repair.amount ? ` (฿${parseInt(repair.amount).toLocaleString()})` : ''}`
        ).join('; ') : "No repair history recorded",
        carPhoto: formData.carPhoto ? "/admin.png" : "/admin.png" // Default photo for now
      };

      // Get existing cars from localStorage
      const existingCars = JSON.parse(localStorage.getItem('cars') || '[]');
      
      // Add new car to the list
      const updatedCars = [...existingCars, newCar];
      
      // Save to localStorage
      localStorage.setItem('cars', JSON.stringify(updatedCars));
      
      // Show success message
      alert(`Car "${newCar.brand} ${newCar.model}" added successfully to the car list!`);
      
      // Reset form
      setFormData({
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
      setRepairHistory([]);
      
      // Redirect to car list to see the new car
      window.location.href = '/admin/dashboard';
      
    } catch (error) {
      console.error('Error adding car:', error);
      alert("Error adding car. Please try again.");
    } finally {
      setIsSubmitting(false);
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



      {/* Back Button - Responsive Positioning */}
      <div className="absolute left-2 sm:left-4 top-16 sm:top-20 z-10">
        <Link href="/admin/dashboard" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0 mt-8 sm:mt-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Add New Car</h2>
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Toyota"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-white mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                          src={URL.createObjectURL(formData.carPhoto)} 
                          alt="Car preview" 
                          className="mx-auto h-32 w-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <div className="flex justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, carPhoto: null }))}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
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
                        <label
                          htmlFor="carPhoto"
                          className="cursor-pointer"
                        >
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400 hover:text-red-500 transition-colors"
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
                          <input
                            id="carPhoto"
                            name="carPhoto"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
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
              <div className="flex justify-end space-x-4">
                <Link href="/admin/dashboard" className="bg-black/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base font-medium border border-white/30 transition-all duration-200 cursor-pointer">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-black/30 hover:text-red-500 disabled:bg-black/10 disabled:cursor-not-allowed text-base font-medium border border-white/30 transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? "Adding..." : "Add Car"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
