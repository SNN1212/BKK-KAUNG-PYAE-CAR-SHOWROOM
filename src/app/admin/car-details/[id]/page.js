"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PhotoViewer from "../../../components/PhotoViewer";

export default function CarDetails() {
  const params = useParams();
  const carId = params.id;
  
  // Mock car data - in a real app, this would come from an API or database
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldPrice, setSoldPrice] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    phoneNumber: "",
    passportNumber: ""
  });
  const [isSoldCar, setIsSoldCar] = useState(false);

  useEffect(() => {
    // Load car data from localStorage - check both regular cars and sold cars
    const savedCars = localStorage.getItem('cars');
    const savedSoldCars = localStorage.getItem('soldCars');
    
    let foundCar = null;
    let carIsSold = false;

    // First check regular cars
    if (savedCars) {
      const cars = JSON.parse(savedCars);
      foundCar = cars.find(car => car.id.toString() === carId);
    }

    // If not found in regular cars, check sold cars
    if (!foundCar && savedSoldCars) {
      const soldCars = JSON.parse(savedSoldCars);
      foundCar = soldCars.find(car => car.id.toString() === carId);
      if (foundCar) {
        carIsSold = true;
      }
    }

    if (foundCar) {
      setCar(foundCar);
      setIsSoldCar(carIsSold);
    }
    
    setLoading(false);
  }, [carId]);

  const handleMarkAsSold = () => {
    if (!car) return;
    
    // Set default sold price to original price
    setSoldPrice(car.price.replace('฿', '').replace(',', ''));
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
      ...car,
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
    const updatedCars = savedCars.filter(c => c.id !== car.id);
    localStorage.setItem('cars', JSON.stringify(updatedCars));

    alert(`"${car.brand} ${car.model}" has been marked as sold for ${soldCar.soldPrice} and moved to the sold list!`);
    
    // Close modal and redirect
    setShowSoldModal(false);
    setSoldPrice("");
    setCustomerInfo({ customerName: "", phoneNumber: "", passportNumber: "" });
    window.location.href = '/admin/dashboard';
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

  if (!car) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-xl">Car not found</div>
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
        <Link 
          href={isSoldCar ? "/admin/sold-list" : "/admin/dashboard"} 
          className="text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          ← Back to {isSoldCar ? "Sold List" : "Dashboard"}
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0 mt-8 sm:mt-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {isSoldCar ? "Sold Car Details" : "Car Details"}
              </h2>
              {isSoldCar && (
                <p className="text-green-400 text-sm mt-1">✓ This car has been sold</p>
              )}
            </div>
            {!isSoldCar && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href={`/admin/edit-car/${carId}`} className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium w-full sm:w-auto border border-white/30 transition-all duration-200 cursor-pointer text-center">
                  Edit Car
                </Link>
                <button
                  onClick={handleMarkAsSold}
                  className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 hover:text-red-200 text-base sm:text-lg font-medium w-full sm:w-auto transition-all duration-200 cursor-pointer"
                >
                  Mark as Sold
                </button>
              </div>
            )}
          </div>

          {/* Car Details Card */}
          <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
            <div className="p-6">
              {/* Car Photo and Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Car Photo */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Car Photo</h3>
                  <div className="bg-black/30 rounded-lg p-4">
                    <PhotoViewer 
                      src={car.carPhoto || "/admin.png"} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    {/* Debug info */}
                    <div className="text-xs text-gray-400 mt-2">
                      Image source: {car.carPhoto || "/admin.png"}
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Car List No.</label>
                        <p className="text-white text-lg font-semibold">{car.carList}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">License No.</label>
                        <p className="text-white text-lg font-semibold">{car.licenseNo}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                        <p className="text-white text-lg font-semibold">{car.brand}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                        <p className="text-white text-lg font-semibold">{car.model}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                        <p className="text-white text-lg font-semibold">{car.year || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                        <p className="text-white text-lg font-semibold">{car.color || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Purchased Kilo</label>
                        <p className="text-white text-lg font-semibold">{car.purchasedKilo || 'N/A'} {car.purchasedKilo ? 'km' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Engine Power</label>
                    <p className="text-white text-lg font-semibold">{car.engine || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Wheel Drive (WD)</label>
                    <p className="text-white text-lg font-semibold">{car.wd || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Gear Type</label>
                    <p className="text-white text-lg font-semibold">{car.gear || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Original Price</label>
                    <p className="text-white text-lg font-semibold">{car.price || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Selling Price</label>
                    <p className="text-white text-lg font-semibold">{car.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Finance Fee</label>
                    <p className="text-white text-lg font-semibold">{car.financeFee}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information - Only show for sold cars */}
              {isSoldCar && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Sale Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Sold Date</label>
                      <p className="text-white text-lg font-semibold">{car.soldDate || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Sold Price</label>
                      <p className="text-green-400 text-lg font-semibold">
                        {car.soldPrice 
                          ? (typeof car.soldPrice === 'number' 
                              ? `฿${car.soldPrice.toLocaleString()}` 
                              : car.soldPrice)
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
                      <p className="text-white text-lg font-semibold">{car.customerName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                      <p className="text-white text-lg font-semibold">{car.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Passport Number</label>
                      <p className="text-white text-lg font-semibold">{car.passportNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Original Price</label>
                      <p className="text-white text-lg font-semibold">{car.price}</p>
                    </div>
                    {car.transferCompleted && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Transfer Status</label>
                        <p className="text-green-400 text-lg font-semibold">✓ Completed</p>
                      </div>
                    )}
                    {car.transferDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Transfer Date</label>
                        <p className="text-white text-lg font-semibold">{car.transferDate}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Profit/Loss Calculation */}
                  {car.soldPrice && car.price && (
                    <div className="mt-6 p-4 bg-black/30 rounded-lg">
                      <h4 className="text-md font-semibold text-white mb-3">Profit Analysis</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Original Price</label>
                          <p className="text-white text-lg font-semibold">{car.price}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Sold Price</label>
                          <p className="text-green-400 text-lg font-semibold">
                            {car.soldPrice 
                              ? (typeof car.soldPrice === 'number' 
                                  ? `฿${car.soldPrice.toLocaleString()}` 
                                  : car.soldPrice)
                              : 'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Profit/Loss</label>
                          {(() => {
                            const originalPrice = parseFloat(car.price?.replace('฿', '').replace(',', '') || 0);
                            const soldPrice = typeof car.soldPrice === 'number' 
                              ? car.soldPrice 
                              : parseFloat(car.soldPrice?.replace('฿', '').replace(',', '') || 0);
                            const profit = soldPrice - originalPrice;
                            const profitFormatted = profit >= 0 ? `฿${profit.toLocaleString()}` : `-฿${Math.abs(profit).toLocaleString()}`;
                            const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';
                            return <p className={`${profitColor} text-lg font-bold`}>{profitFormatted}</p>;
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Repair History */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Repair History</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  {car.repairHistory ? (
                    <p className="text-white text-base leading-relaxed">{car.repairHistory}</p>
                  ) : (
                    <p className="text-gray-400 text-base italic">No repair history recorded</p>
                  )}
                </div>
              </div>
            </div>
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
                    Car: {car?.brand} {car?.model} ({car?.licenseNo})
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price: {car?.price}
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
