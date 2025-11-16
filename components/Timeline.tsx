import React from 'react';
import type { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative my-12 animate-fade-in">
      {/* Vertical line */}
      <div className="absolute left-1/2 -ml-0.5 w-1 bg-slate-700 h-full"></div>

      {events.map((event, index) => (
        <div key={index} className="relative mb-12">
          {/* Timeline Item Container */}
          <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            {/* Content Card */}
            <div className="w-5/12">
              <div className={`p-6 rounded-lg shadow-lg ring-1 ring-slate-700/50 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} bg-slate-800/80 animate-slide-in-up`}>
                <h3 className="text-xl font-bold text-blue-300 mb-2">{event.title}</h3>
                <p className="text-slate-300 text-base">{event.description}</p>
              </div>
            </div>

            {/* Spacer */}
            <div className="w-2/12"></div>
          </div>

          {/* Circle and Year */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="z-10 flex items-center justify-center w-24 h-12">
              <div className="absolute w-8 h-8 bg-blue-500 rounded-full ring-4 ring-slate-900"></div>
              <span className="z-20 font-bold text-lg text-white bg-slate-800 px-3 py-1 rounded-full shadow-md">
                {event.year}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
