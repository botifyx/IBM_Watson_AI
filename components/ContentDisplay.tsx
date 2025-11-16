import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Timeline from './Timeline';
import WatsonJeopardyImage from './WatsonJeopardyImage';
import WatsonxPlatformImage from './WatsonxPlatformImage';
import VideoShowcase from './VideoShowcase';
import CodeSnippet from './CodeSnippet';
import { timelineData } from '../data/timelineData';

interface ContentDisplayProps {
  content: string;
  title: string;
}

// --- Icon Components ---
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.62A6.01 6.01 0 0012 1.25a6.01 6.01 0 00-1.5 11.62m1.5 5.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9.75 16.5h4.5a2.25 2.25 0 012.25 2.25h-9a2.25 2.25 0 012.25-2.25z" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.502L16.5 21.75l-.398-1.248a3.375 3.375 0 00-2.455-2.456L12.75 18l1.248-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.248a3.375 3.375 0 002.456 2.456L20.25 18l-1.248.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, title }) => {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -100px 0px', // Animate when element is 100px into view
      }
    );

    const articleElement = articleRef.current;
    if (!articleElement) return;

    const headings = articleElement.querySelectorAll('h2');
    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      if (articleElement) {
        observer.disconnect();
      }
    };
  }, [content]);

  // --- Custom Markdown Renderers ---
  const renderers = {
      h2: ({ node, ...props }) => <h2 className="section-title-animate text-2xl md:text-3xl font-bold text-blue-300/90 border-b-2 border-blue-500/30 pb-3 mt-12 mb-6 tracking-tight" {...props} />,
      h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-semibold text-slate-100 mt-8 mb-4" {...props} />,
      p: ({ node, ...props }) => {
          const nodeText = node?.children[0]?.type === 'text' ? node.children[0].value : '';
          if (nodeText === '[TIMELINE_COMPONENT]') {
              return <Timeline events={timelineData} />;
          }
          if (nodeText === '[WATSON_JEOPARDY_IMAGE]') {
              return <WatsonJeopardyImage />;
          }
          if (nodeText === '[WATSONX_PLATFORM_IMAGE]') {
              return <WatsonxPlatformImage />;
          }
          if (nodeText === '[VIDEO_SHOWCASE]') {
              return <VideoShowcase />;
          }
          if (nodeText === '[CODE_SNIPPET]') {
              return <CodeSnippet />;
          }
          return <p {...props} />;
      },
      a: ({ node, ...props }) => <a className="text-blue-400 font-medium underline decoration-blue-500/50 hover:decoration-blue-400 hover:bg-blue-500/10 rounded-sm px-1 -mx-1 py-0.5 -my-0.5 underline-offset-2 transition-all duration-200" {...props} />,
      ul: ({ node, ...props }) => <ul className="list-none pl-2 my-4" {...props} />,
      li: ({ node, ...props }) => (
          <li className="flex items-start my-3">
              <span className="flex-shrink-0 mr-4 mt-1">
                  <CheckCircleIcon className="w-6 h-6 text-blue-400" />
              </span>
              <div className="prose-p:my-0">{props.children}</div>
          </li>
      ),
      blockquote: ({ node, ...props }) => {
          const pNode = node?.children.find(child => child.tagName === 'p');
          const strongNode = pNode?.children.find(child => child.tagName === 'strong');
          const label = strongNode?.children[0]?.value || '';

          let Icon = InfoIcon;
          if (label.toLowerCase().includes('takeaway')) {
              Icon = LightbulbIcon;
          } else if (label.toLowerCase().includes('did you know') || label.toLowerCase().includes('fact')) {
              Icon = SparklesIcon;
          }

          return (
              <blockquote className="my-8 border-l-0 bg-slate-900/50 p-6 rounded-lg ring-1 ring-slate-700/50 flex items-start space-x-4 not-prose transition-all duration-300 hover:ring-slate-600 hover:shadow-lg">
                  <div className="flex-shrink-0 pt-1">
                      <Icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="prose prose-invert max-w-none prose-p:text-slate-200 prose-strong:text-blue-300">
                      {props.children}
                  </div>
              </blockquote>
          );
      },
      table: ({ node, ...props }) => (
          <div className="my-6 overflow-x-auto rounded-lg ring-1 ring-slate-700/50">
              <table className="w-full" {...props} />
          </div>
      ),
      thead: ({ node, ...props }) => <thead className="bg-slate-800/70" {...props} />,
      tr: ({ node, ...props }) => <tr className="transition-colors duration-200 hover:bg-slate-800/40" {...props} />,
      th: ({ node, ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider" {...props} />,
      td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 border-t border-slate-700/50" {...props} />,
  };

  return (
    <article ref={articleRef} className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-6 md:p-10 rounded-lg shadow-xl ring-1 ring-slate-700/50 animate-fade-in">
        <header className="border-b border-slate-700 pb-6 mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-300 tracking-tight">{title}</h1>
        </header>
        <div 
            className="prose prose-invert md:prose-lg max-w-none 
                       prose-p:text-slate-200
                       prose-strong:text-slate-100 
                       prose-code:bg-slate-800 prose-code:rounded prose-code:px-1.5 prose-code:py-1 prose-code:font-mono prose-code:text-amber-300 prose-code:ring-1 prose-code:ring-slate-700
                       prose-pre:bg-slate-900/70 prose-pre:p-3 md:prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:ring-1 prose-pre:ring-slate-700"
        >
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={renderers}
            >
                {content}
            </ReactMarkdown>
        </div>
    </article>
  );
};

export default ContentDisplay;