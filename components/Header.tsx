
import React, { useState } from 'react';
import type { Section } from '../types';

interface HeaderProps {
  sections: Section[];
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
  onShowHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ sections, activeSectionId, onSelectSection, onShowHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={onShowHome}
          >
            <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="text-xl font-bold text-white">IBM Watson AI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {sections.map(section => (
              <button 
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSectionId === section.id 
                  ? 'text-blue-400' 
                  : 'text-slate-300 hover:text-white'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 animate-fade-in">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            {sections.map(section => (
              <button 
                key={section.id}
                onClick={() => {
                  onSelectSection(section.id);
                  setIsMenuOpen(false);
                }}
                className={`text-left p-2 rounded-md font-medium transition-colors duration-200 ${
                  activeSectionId === section.id 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'text-slate-200 hover:bg-slate-700'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
