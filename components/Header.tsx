
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800">
            Hiring Post <span className="text-indigo-600">AI</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
