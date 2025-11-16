
import React from 'react';

interface BreadcrumbProps {
  activeSectionTitle: string | null;
  onHomeClick: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ activeSectionTitle, onHomeClick }) => {
  if (!activeSectionTitle) {
    return null;
  }

  return (
    <nav className="mb-6 text-sm text-slate-400 animate-fade-in" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center space-x-2">
        <li>
          <button 
            onClick={onHomeClick} 
            className="hover:text-white transition-colors duration-200"
            aria-label="Back to Homepage"
          >
            Home
          </button>
        </li>
        <li>
          <svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li aria-current="page">
          <span className="font-medium text-slate-200">{activeSectionTitle}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
