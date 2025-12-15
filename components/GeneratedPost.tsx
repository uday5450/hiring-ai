import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface GeneratedPostProps {
  imageData: string;
  onStartOver: () => void;
  onRegenerate: () => void;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const GeneratedPost: React.FC<GeneratedPostProps> = ({ imageData, onStartOver, onRegenerate }) => {
  // Determine if the image data is a URL or base64
  const isUrl = imageData.startsWith('http');
  const imageSrc = isUrl ? imageData : `data:image/png;base64,${imageData}`;

  // #region agent log
  React.useEffect(() => { fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'GeneratedPost.tsx:16', message: 'GeneratedPost mounted', data: { hasImageData: !!imageData, isUrl, imageDataLength: imageData?.length || 0, imageDataPrefix: imageData?.substring(0, 50) || 'none' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { }); }, [imageData, isUrl]);
  // #endregion

  const handleDownload = async () => {
    try {
      const link = document.createElement('a');

      if (isUrl) {
        // For URLs, we need to fetch the blob to force download instead of just opening
        const response = await fetch(imageData);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = 'hiring-post.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        // Base64 handling
        link.href = imageSrc;
        link.download = 'hiring-post.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download image. You can try right-clicking the image and selecting 'Save Image As'.");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Your Hiring Image is Ready!</h2>
        <p className="text-md text-slate-500 mt-1">Download the image or generate a new variation.</p>
      </div>

      <div className="mb-6 rounded-lg overflow-hidden border border-slate-200">
        {/* #region agent log */}
        {(() => { const imgSrc = imageSrc; fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'GeneratedPost.tsx:34', message: 'Image src constructed', data: { isUrl, imgSrcLength: imgSrc.length, imgSrcPrefix: imgSrc.substring(0, 60) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { }); return null; })()}
        {/* #endregion */}
        <img
          src={imageSrc}
          alt="AI-generated hiring post"
          className="w-full h-auto object-contain"
          onError={(e) => {
            // #region agent log
            // fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'GeneratedPost.tsx:38', message: 'Image load error', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
            // #endregion
          }}
          onLoad={() => {
            // #region agent log
            // fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'GeneratedPost.tsx:44', message: 'Image loaded successfully', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
            // #endregion
          }}
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-5 py-3 transition-all duration-300 ease-in-out"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download Image
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onRegenerate}
            className="w-full flex items-center justify-center text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-medium rounded-lg text-md px-5 py-3 transition-all duration-300 ease-in-out"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Regenerate
          </button>
          <button
            onClick={onStartOver}
            className="w-full text-slate-700 bg-slate-100 border border-slate-300 hover:bg-slate-200 font-medium rounded-lg text-md px-5 py-3 transition-all duration-300 ease-in-out"
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedPost;