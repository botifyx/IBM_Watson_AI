import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Section } from './types';
import { SECTIONS } from './constants';
import { generateContent } from './services/geminiService';
import Header from './components/Header';
import AnimatedHero from './components/AnimatedHero';
import ContentDisplay from './components/ContentDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import Chatbot from './components/Chatbot';
import ScrollToTopButton from './components/ScrollToTopButton';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);

  // Use a ref to track the latest initiated content request.
  // This prevents race conditions where an old, slower request overwrites
  // the state set by a newer, faster request.
  const latestRequestId = useRef<string | null>(null);

  const fetchContent = useCallback(async (sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return;

    // Set this request as the latest one.
    latestRequestId.current = sectionId;

    setIsLoading(true);
    setError(null);
    setContent('');
    setIsHeroVisible(false);

    try {
      const generatedText = await generateContent(section.prompt);
      
      // *** CRITICAL CHECK ***
      // Only update the state if this request is still the latest one.
      if (latestRequestId.current === sectionId) {
        setContent(generatedText);
      }
    } catch (err) {
      // Also check here, so we don't show an error for an old, irrelevant request.
      if (latestRequestId.current === sectionId) {
        setError('Failed to generate content. Please try again later.');
        console.error(err);
      }
    } finally {
      // And check here, to ensure the loading spinner isn't turned off prematurely by an old request.
      if (latestRequestId.current === sectionId) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    fetchContent(sectionId);
  };
  
  const handleShowHome = () => {
      setActiveSectionId(null);
      latestRequestId.current = null; // Clear request tracker on home navigation
      setIsHeroVisible(true);
      setContent('');
      setError(null);
      setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header 
        sections={SECTIONS} 
        activeSectionId={activeSectionId} 
        onSelectSection={handleSelectSection}
        onShowHome={handleShowHome}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {isHeroVisible ? (
          <AnimatedHero onExplore={() => handleSelectSection('what-is-watson')} />
        ) : (
          <>
            <Breadcrumb 
              activeSectionTitle={SECTIONS.find(s => s.id === activeSectionId)?.title || null}
              onHomeClick={handleShowHome}
            />

            {isLoading && <LoadingSpinner />}
            
            {error && (
              <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg animate-fade-in">
                <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
                <p>{error}</p>
              </div>
            )}

            {content && !isLoading && (
              <ContentDisplay 
                key={activeSectionId}
                content={content} 
                title={SECTIONS.find(s => s.id === activeSectionId)?.title || ''} 
              />
            )}
          </>
        )}
      </main>
      
      <Footer />
      <Chatbot />
      <ScrollToTopButton />
    </div>
  );
};

export default App;
