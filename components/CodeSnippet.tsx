import React, { useState } from 'react';

type Language = 'python' | 'nodejs';

const codeSamples: Record<Language, { raw: string, highlighted: React.ReactNode }> = {
  python: {
    raw: `import os
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

# Authenticate
authenticator = IAMAuthenticator(os.environ.get('YOUR_API_KEY'))
assistant = AssistantV2(
    version='2021-06-14',
    authenticator=authenticator
)
assistant.set_service_url('YOUR_SERVICE_URL')

# Greet Watson
print("Hello, Watson!")`,
    highlighted: (
        <code>
            <span className="text-purple-400">import</span> os<br/>
            <span className="text-purple-400">from</span> ibm_watson <span className="text-purple-400">import</span> AssistantV2<br/>
            <span className="text-purple-400">from</span> ibm_cloud_sdk_core.authenticators <span className="text-purple-400">import</span> IAMAuthenticator<br/>
            <br/>
            <span className="text-slate-500"># Authenticate</span><br/>
            authenticator = <span className="text-yellow-400">IAMAuthenticator</span>(os.environ.<span className="text-yellow-400">get</span>(<span className="text-green-400">'YOUR_API_KEY'</span>))<br/>
            assistant = <span className="text-yellow-400">AssistantV2</span>(<br/>
            {'    '}version=<span className="text-green-400">'2021-06-14'</span>,<br/>
            {'    '}authenticator=authenticator<br/>
            )<br/>
            assistant.<span className="text-yellow-400">set_service_url</span>(<span className="text-green-400">'YOUR_SERVICE_URL'</span>)<br/>
            <br/>
            <span className="text-slate-500"># Greet Watson</span><br/>
            <span className="text-yellow-400">print</span>(<span className="text-green-400">"Hello, Watson!"</span>)<br/>
        </code>
    )
  },
  nodejs: {
    raw: `const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// Authenticate
const assistant = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: process.env.YOUR_API_KEY,
  }),
  serviceUrl: 'YOUR_SERVICE_URL',
});

// Greet Watson
console.log("Hello, Watson!");`,
    highlighted: (
      <code>
          <span className="text-purple-400">const</span> AssistantV2 = <span className="text-yellow-400">require</span>(<span className="text-green-400">'ibm-watson/assistant/v2'</span>);<br/>
          <span className="text-purple-400">const</span> {'{'} IamAuthenticator {'}'} = <span className="text-yellow-400">require</span>(<span className="text-green-400">'ibm-watson/auth'</span>);<br/>
          <br/>
          <span className="text-slate-500">// Authenticate</span><br/>
          <span className="text-purple-400">const</span> assistant = <span className="text-purple-400">new</span> <span className="text-yellow-400">AssistantV2</span>({'{'}<br/>
          {'  '}version: <span className="text-green-400">'2021-06-14'</span>,<br/>
          {'  '}authenticator: <span className="text-purple-400">new</span> <span className="text-yellow-400">IamAuthenticator</span>({'{'}<br/>
          {'    '}apikey: process.env.YOUR_API_KEY,<br/>
          {'  '} C4_}),<br/>
          {'  '}serviceUrl: <span className="text-green-400">'YOUR_SERVICE_URL'</span>,<br/>
          {'}'});<br/>
          <br/>
          <span className="text-slate-500">// Greet Watson</span><br/>
          console.<span className="text-yellow-400">log</span>(<span className="text-green-400">"Hello, Watson!"</span>);<br/>
      </code>
    )
  }
};

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625a2.625 2.625 0 11-5.25 0v-2.625m0 0V15.75m0 0v-2.625A2.625 2.625 0 0112 10.5h.375a2.625 2.625 0 012.625 2.625v2.625" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);


const CodeSnippet: React.FC = () => {
    const [activeLanguage, setActiveLanguage] = useState<Language>('python');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSamples[activeLanguage].raw);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="my-8 bg-slate-900/70 rounded-lg ring-1 ring-slate-700/50 not-prose animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700/50">
                <div className="relative">
                    <select
                        value={activeLanguage}
                        onChange={(e) => setActiveLanguage(e.target.value as Language)}
                        className="appearance-none bg-slate-700/50 text-slate-300 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors hover:bg-slate-700 cursor-pointer"
                        aria-label="Select a programming language"
                    >
                        <option value="python">Python</option>
                        <option value="nodejs">Node.js</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium bg-slate-700/50 text-slate-300 rounded-md hover:bg-slate-700 transition-colors"
                >
                    {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>

            {/* Code */}
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                    {codeSamples[activeLanguage].highlighted}
                </pre>
            </div>
        </div>
    );
};

export default CodeSnippet;