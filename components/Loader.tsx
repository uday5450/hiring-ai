
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200 h-full min-h-[400px]">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <h2 className="mt-6 text-xl font-semibold text-slate-700">Generating Your Image...</h2>
      <p className="mt-2 text-slate-500 text-center">Our AI is designing the perfect hiring post.</p>
    </div>
  );
};

export default Loader;
