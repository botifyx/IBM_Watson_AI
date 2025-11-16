import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';

const WatsyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const CHAT_HISTORY_KEY = 'watsy-chat-history';

const getInitialMessages = (): ChatMessage[] => {
    try {
        const storedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedMessages) {
            const parsedMessages = JSON.parse(storedMessages);
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                return parsedMessages;
            }
        }
    } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
    }
    
    // Create a dynamic greeting based on the time of day.
    const hour = new Date().getHours();
    let timeOfDayGreeting = 'Hello!';
    if (hour >= 5 && hour < 12) {
        timeOfDayGreeting = 'Good morning!';
    } else if (hour >= 12 && hour < 18) {
        timeOfDayGreeting = 'Good afternoon!';
    } else {
        timeOfDayGreeting = 'Good evening!';
    }

    // Return default message with dynamic greeting if nothing in storage or parsing fails
    return [{ role: 'model', text: `${timeOfDayGreeting} I'm Watsy, your AI guide for this site. How can I help you explore the world of IBM Watson?` }];
};


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat history to localStorage", error);
        }
    }, [messages]);
    
    useEffect(() => {
        if (isOpen && !location) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(position.coords);
                },
                (error) => {
                    console.warn("Could not get user location:", error.message);
                    setMessages(prev => [...prev, { role: 'model', text: "I can't access your location, but I'm still here to help with any general questions you have!"}]);
                }
            );
        }
    }, [isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const responseText = await generateChatResponse(inputValue, messages, location);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className={`fixed bottom-0 right-0 m-6 md:m-8 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-90 invisible' : 'opacity-100 scale-100 visible'}`}>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-500 flex items-center justify-center transition-transform duration-200 transform hover:scale-110"
                    aria-label="Open Chat"
                >
                    <WatsyIcon className="w-8 h-8"/>
                </button>
            </div>
            
            <div className={`fixed bottom-0 right-0 md:m-8 z-50 w-full h-full md:w-96 md:h-auto md:max-h-[70vh] flex flex-col bg-slate-800/80 backdrop-blur-xl md:rounded-xl shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                         <WatsyIcon className="w-7 h-7 text-blue-400"/>
                        <h2 className="text-lg font-bold text-white">Watsy Assistant</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close chat">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-end space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-0">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-end space-x-2 justify-start">
                                <div className="max-w-xs lg:max-w-sm px-4 py-3 rounded-xl bg-slate-700 text-slate-200 rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <footer className="p-4 border-t border-slate-700/50 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about Watson..."
                            className="w-full bg-slate-900/50 text-slate-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition" disabled={isLoading || !inputValue.trim()}>
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;