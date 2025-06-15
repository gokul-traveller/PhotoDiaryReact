// components/LoadingPopup.tsx
import React from "react";

const LoadingPopup: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-2">
      <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingPopup;
