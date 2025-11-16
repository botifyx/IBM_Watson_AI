
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
        <p className="font-semibold text-slate-200">IBM Watson AI Guide</p>
        <p className="mt-2 max-w-3xl mx-auto">
          Disclaimer: This is an independent, unofficial resource created by a fan and former employee. This site is in no way connected, affiliated with, or endorsed by IBM and its entities. All information is provided for educational and informational purposes only.
        </p>
        <p className="mt-4">&copy; {new Date().getFullYear()} www.ibmwatsonai.com. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
