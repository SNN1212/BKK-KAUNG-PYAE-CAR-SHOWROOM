
# Admin Dashboard Styles Documentation

## Navigation Bar Structure

### Top Navigation Bar (All Pages)
```jsx
<nav className="bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-14 sm:h-16">
      <h1 className="text-xl sm:text-2xl font-semibold text-white">Admin Dashboard</h1>
      <button 
        onClick={handleLogout}
        className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer"
      >
        Logout
      </button>
    </div>
  </div>
</nav>
```

### Secondary Navigation Bar (All Pages)
```jsx
<nav className="bg-black/70 backdrop-blur-md shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-nowrap space-x-4 sm:space-x-8 h-12 sm:h-14 overflow-x-auto scrollbar-hide">
      {/* Active Link */}
      <Link href="/admin/dashboard" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0">
        Car List
      </Link>
      
      {/* Inactive Links */}
      <Link href="/admin/installments" className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0">
        Installments
      </Link>
    </div>
  </div>
</nav>
```

## Page Background
```jsx
<div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/View.png')" }}>
```

## Main Content Container
```jsx
<div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
  <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0">
```

## Page Headers
```jsx
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Page Title</h2>
  <Link href="/admin/add-car" className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium w-full sm:w-auto border border-white/30 transition-all duration-200 cursor-pointer">
    Action Button
  </Link>
</div>
```

## Standard Button Styles

### Primary Action Buttons (Glass-morphism)
```jsx
className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer"
```

### Secondary Action Buttons (Gray)
```jsx
className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 hover:text-red-500 text-base font-medium cursor-pointer"
```

### Submit Buttons (Red)
```jsx
className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 hover:text-red-200 disabled:bg-red-400 disabled:cursor-not-allowed text-base font-medium cursor-pointer"
```

## Table Styles

### Table Container
```jsx
<div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-md">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-600">
```

### Table Header
```jsx
<thead className="bg-black/20 backdrop-blur-2xl">
  <tr>
    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-bold text-white uppercase tracking-wider">
      Column Header
    </th>
  </tr>
</thead>
```

### Table Body
```jsx
<tbody className="bg-black/10 backdrop-blur-2xl divide-y divide-gray-600">
  <tr className="hover:bg-black/30 backdrop-blur-2xl">
    <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base text-white">
      Cell Content
    </td>
  </tr>
</tbody>
```

### Table Action Buttons
```jsx
<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
  <Link href={`/admin/car-details/${car.id}`} className="bg-black/20 backdrop-blur-md text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-black/30 hover:text-red-500 font-medium border border-white/30 transition-all duration-200 cursor-pointer">
    View
  </Link>
</div>
```

## Form Styles

### Form Container
```jsx
<div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg p-6">
  <form className="space-y-6">
```

### Form Input Fields
```jsx
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
  placeholder="Placeholder text"
/>
```

### Form Labels
```jsx
<label className="block text-base font-medium text-white mb-2">
  Field Label
</label>
```

## Modal Styles

### Modal Overlay
```jsx
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
```

### Modal Header
```jsx
<div className="flex justify-between items-center p-6 border-b border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900">Modal Title</h3>
  <button
    onClick={() => setShowModal(false)}
    className="text-gray-400 hover:text-gray-600 cursor-pointer"
  >
    ×
  </button>
</div>
```

### Modal Body
```jsx
<div className="p-6">
  <form className="space-y-4">
    {/* Form content */}
  </form>
</div>
```

### Modal Footer
```jsx
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
    Submit
  </button>
</div>
```

## Card Styles

### Card Container
```jsx
<div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-lg">
  <div className="px-4 py-5 sm:p-6">
```

### Card Header
```jsx
<h3 className="text-lg font-semibold text-white mb-4">Card Title</h3>
```

### Card Content
```jsx
<div className="space-y-3">
  <div>
    <p className="text-sm text-gray-300">Label</p>
    <p className="text-white text-lg font-medium">Value</p>
  </div>
</div>
```

## Responsive Design Classes

### Container Responsive
- `max-w-7xl mx-auto` - Maximum width container
- `px-2 sm:px-6 lg:px-8` - Responsive horizontal padding
- `py-4 sm:py-6` - Responsive vertical padding

### Text Responsive
- `text-sm sm:text-base` - Responsive text size
- `text-2xl sm:text-3xl lg:text-4xl` - Responsive heading size
- `text-xs sm:text-sm` - Responsive small text

### Button Responsive
- `px-4 sm:px-6` - Responsive horizontal padding
- `py-2 sm:py-3` - Responsive vertical padding
- `w-full sm:w-auto` - Full width on mobile, auto on desktop

### Table Responsive
- `px-3 sm:px-6` - Responsive cell padding
- `py-3 sm:py-4` - Responsive cell padding
- `py-3 sm:py-5` - Responsive row padding

## Color Scheme

### Primary Colors
- Background: `bg-black/20` (20% opacity black)
- Text: `text-white`
- Accent: `text-red-500` (hover states)
- Borders: `border-white/30` (30% opacity white)

### Secondary Colors
- Gray backgrounds: `bg-gray-600`, `bg-gray-700`
- Red backgrounds: `bg-red-600`, `bg-red-700`
- Disabled states: `bg-red-400`, `bg-black/10`

### Hover States
- Primary buttons: `hover:bg-black/30 hover:text-red-500`
- Secondary buttons: `hover:bg-gray-700 hover:text-red-500`
- Submit buttons: `hover:bg-red-700 hover:text-red-200`

## Animation Classes
- `transition-all duration-200` - Smooth transitions
- `backdrop-blur-md` - Glass effect
- `backdrop-blur-2xl` - Stronger glass effect

## Utility Classes
- `cursor-pointer` - Hand cursor on hover
- `whitespace-nowrap` - Prevent text wrapping
- `flex-shrink-0` - Prevent flex item shrinking
- `overflow-x-auto` - Horizontal scroll
- `scrollbar-hide` - Hide scrollbar
- `z-50` - High z-index for modals
- `fixed inset-0` - Full screen overlay
