
import React, { useState, useCallback } from 'react';
import { JobDetails } from './types';
import { generateHiringPost } from './services/geminiService';
import Header from './components/Header';
import JobForm from './components/JobForm';
import GeneratedPost from './components/GeneratedPost';
import Loader from './components/Loader';

type InputMode = 'form' | 'prompt';

const App: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    jobTitle: '',
    department: '',
    experience: '',
    responsibilities: '',
    skills: '',
    companyName: '',
    location: '',
    email: '',
    mobileNo: '',
    primaryColor: '',
    secondaryColor: '',
    aspectRatio: '1:1',
  });
  
  const [mode, setMode] = useState<InputMode>('form');
  const [userPrompt, setUserPrompt] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneration = useCallback(async (isRegeneration: boolean) => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:36',message:'handleGeneration entry',data:{isRegeneration},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageData = await generateHiringPost(jobDetails, logo, referenceImage, mode, userPrompt, isRegeneration);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:42',message:'Image data received',data:{hasImageData:!!imageData,imageDataLength:imageData?.length||0,imageDataPrefix:imageData?.substring(0,50)||'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setGeneratedImage(imageData);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:43',message:'setGeneratedImage called',data:{imageDataLength:imageData?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
    // Fix: Added curly braces to the catch block to correctly handle errors. This resolves all reported issues.
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:45',message:'Error in handleGeneration',data:{errorMessage:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      setError('Failed to generate hiring post image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [jobDetails, logo, referenceImage, mode, userPrompt]);

  const handleSubmit = useCallback(() => handleGeneration(false), [handleGeneration]);
  const handleRegenerate = useCallback(() => handleGeneration(true), [handleGeneration]);
  
  const handleStartOver = () => {
      setGeneratedImage(null);
      setError(null);
      setLogo(null);
      setReferenceImage(null);
      setUserPrompt('');
      setMode('form');
      setJobDetails({
        jobTitle: '',
        department: '',
        experience: '',
        responsibilities: '',
        skills: '',
        companyName: '',
        location: '',
        email: '',
        mobileNo: '',
        primaryColor: '',
        secondaryColor: '',
        aspectRatio: '1:1',
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <JobForm 
            jobDetails={jobDetails} 
            setJobDetails={setJobDetails}
            mode={mode}
            setMode={setMode}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            logo={logo}
            setLogo={setLogo}
            referenceImage={referenceImage}
            setReferenceImage={setReferenceImage}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            hasResult={!!generatedImage}
          />
          <div className="lg:sticky lg:top-8">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}
            {generatedImage && (
              <>
                {/* #region agent log */}
                {(()=>{fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:107',message:'Rendering GeneratedPost',data:{hasGeneratedImage:!!generatedImage,imageDataLength:generatedImage?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});return null;})()}
                {/* #endregion */}
                <GeneratedPost 
                  imageData={generatedImage} 
                  onStartOver={handleStartOver} 
                  onRegenerate={handleRegenerate} 
                />
              </>
            )}
            {!isLoading && !error && !generatedImage && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center h-full min-h-[400px]">
                    <div className="text-indigo-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-2">Your AI-Generated Hiring Image</h2>
                    <p className="text-slate-500 text-center max-w-sm">Fill out the form, and your professionally designed hiring post image will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 bg-slate-100 text-slate-500 border-t border-slate-200">
        App By Om Jasoliya
      </footer>
    </div>
  );
};

export default App;
