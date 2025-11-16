
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-slate-300 font-medium tracking-wide">Generating Content with AI...</p>
    </div>
  );
};

export default LoadingSpinner;
