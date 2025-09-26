"use client";
import { useState, useEffect } from "react";

export default function PhotoViewer({ src, alt, className = "" }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      console.log('ESC key pressed!'); // Debug log
      closeFullScreen();
    }
  };

  const openFullScreen = () => {
    console.log('Opening full screen with src:', src);
    setIsFullScreen(true);
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Add global keyboard listener
    document.addEventListener('keydown', handleKeyDown);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    
    // Restore scrolling
    document.body.style.overflow = 'unset';
    
    // Remove global keyboard listener
    document.removeEventListener('keydown', handleKeyDown);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up event listener when component unmounts
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Clickable thumbnail */}
      <img 
        src={src} 
        alt={alt}
        className={`${className} cursor-pointer transition-transform hover:scale-105`}
        onClick={openFullScreen}
        onError={(e) => {
          e.target.src = '/admin.png'; // Fallback image
        }}
      />

      {/* Full-screen overlay */}
      {isFullScreen && (
        <div 
          className="photo-viewer-fullscreen fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onClick={closeFullScreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
            aria-label="Close full-screen view"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Photo container */}
          <div 
            className="w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={src} 
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                console.log('Image failed to load:', src);
                e.target.src = '/admin.png';
              }}
              onLoad={(e) => {
                console.log('Image loaded successfully:', src);
              }}
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
            <div className="bg-black/50 px-3 py-2 rounded-lg">
              <p>Click outside or use close button</p>
              <p className="text-xs mt-1">ESC key works on desktop</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
