import React from 'react';
import type { JobDetails, AspectRatio } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

type InputMode = 'form' | 'prompt';

interface JobFormProps {
  jobDetails: JobDetails;
  setJobDetails: React.Dispatch<React.SetStateAction<JobDetails>>;
  mode: InputMode;
  setMode: (mode: InputMode) => void;
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  referenceImage: string | null;
  setReferenceImage: (image: string | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasResult: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ 
  jobDetails, setJobDetails, 
  mode, setMode, 
  userPrompt, setUserPrompt,
  logo, setLogo, 
  referenceImage, setReferenceImage, 
  onSubmit, isLoading, hasResult 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAspectRatioChange = (value: AspectRatio) => {
    setJobDetails(prev => ({ ...prev, aspectRatio: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (hasResult) {
      return null;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Job Details</h2>
      <p className="text-slate-500 mb-6">Provide the details below to generate a post.</p>
      
      <ModeSwitcher mode={mode} setMode={setMode} />

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5">
        
        {mode === 'form' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Job Title" name="jobTitle" value={jobDetails.jobTitle} onChange={handleChange} placeholder="e.g., Senior React Developer" />
              <InputField label="Department / Area" name="department" value={jobDetails.department} onChange={handleChange} placeholder="e.g., Engineering" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Company Name" name="companyName" value={jobDetails.companyName} onChange={handleChange} placeholder="e.g., Tech Solutions Inc." />
                <InputField label="Location" name="location" value={jobDetails.location} onChange={handleChange} placeholder="e.g., San Francisco, CA or Remote" />
            </div>
            <InputField label="Experience Level" name="experience" value={jobDetails.experience} onChange={handleChange} placeholder="e.g., 5+ years of experience" />
            
            <TextareaField label="Key Responsibilities" name="responsibilities" value={jobDetails.responsibilities} onChange={handleChange} placeholder="- Develop new user-facing features..." rows={4} />
            <TextareaField label="Required Skills" name="skills" value={jobDetails.skills} onChange={handleChange} placeholder="- Proficiency in React, TypeScript..." rows={4} />
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Contact Email" name="email" value={jobDetails.email || ''} onChange={handleChange} placeholder="e.g., careers@example.com" />
                <InputField label="Contact Mobile" name="mobileNo" value={jobDetails.mobileNo || ''} onChange={handleChange} placeholder="e.g., +1 123-456-7890" />
            </div>
          </div>
        )}

        {mode === 'prompt' && (
          <div className="animate-fade-in">
            <TextareaField 
              label="Your Custom Prompt" 
              name="prompt" 
              value={userPrompt} 
              onChange={(e) => setUserPrompt(e.target.value)} 
              placeholder="Describe the hiring post you want the AI to create. Be as descriptive as possible! Mention job title, key responsibilities, desired style, and any text you want to include." 
              rows={12} 
            />
          </div>
        )}
        
        <div className="space-y-5 pt-4 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-700">Design & Layout</h3>
          <div>
            <label className="block mb-2 text-sm font-bold text-slate-700">Layout</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <AspectRatioButton label="Square" value="1:1" current={jobDetails.aspectRatio} onChange={handleAspectRatioChange} />
                <AspectRatioButton label="Portrait" value="9:16" current={jobDetails.aspectRatio} onChange={handleAspectRatioChange} />
                <AspectRatioButton label="Landscape" value="16:9" current={jobDetails.aspectRatio} onChange={handleAspectRatioChange} />
                <AspectRatioButton label="Tall" value="3:4" current={jobDetails.aspectRatio} onChange={handleAspectRatioChange} />
              </div>
          </div>

          <h3 className="text-xl font-bold text-slate-700 pt-2">Customization (Optional)</h3>
          
          <FileUploadField 
            id="logo"
            label="Company Logo"
            previewSrc={logo}
            onChange={(e) => handleFileChange(e, setLogo)}
          />
          
          <FileUploadField 
            id="referenceImage"
            label="Design Reference Image"
            description="Upload an image for style, layout, and theme inspiration."
            previewSrc={referenceImage}
            onChange={(e) => handleFileChange(e, setReferenceImage)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Primary Color" name="primaryColor" value={jobDetails.primaryColor || ''} onChange={handleChange} placeholder="#4338CA (Indigo)" />
            <InputField label="Secondary Color" name="secondaryColor" value={jobDetails.secondaryColor || ''} onChange={handleChange} placeholder="#334155 (Slate)" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-md px-5 py-3 transition-all duration-300 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>
    </div>
  );
};

const ModeSwitcher: React.FC<{ mode: InputMode, setMode: (mode: InputMode) => void }> = ({ mode, setMode }) => (
  <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
    <button
      type="button"
      onClick={() => setMode('form')}
      className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${mode === 'form' ? 'bg-white text-indigo-700 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'}`}
    >
      Structured Form
    </button>
    <button
      type="button"
      onClick={() => setMode('prompt')}
      className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${mode === 'prompt' ? 'bg-white text-indigo-700 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'}`}
    >
      Custom Prompt
    </button>
  </div>
);


interface FileUploadFieldProps {
  id: string;
  label: string;
  description?: string;
  previewSrc: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ id, label, description, previewSrc, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600">{label}</label>
    {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
    <div className="flex items-center space-x-4">
      {previewSrc && <img src={previewSrc} alt="preview" className="w-16 h-16 rounded-lg object-contain border bg-slate-50 border-slate-300 p-1" />}
      <input 
        type="file" 
        id={id} 
        name={id}
        onChange={onChange}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
      />
    </div>
  </div>
);


interface AspectRatioButtonProps {
  label: string;
  value: AspectRatio;
  current: AspectRatio | undefined;
  onChange: (value: AspectRatio) => void;
}

const AspectRatioButton: React.FC<AspectRatioButtonProps> = ({ label, value, current, onChange }) => {
  const isSelected = value === current;
  const dimensions = {
    '1:1': { iconClass: 'w-10 h-10', text: '1:1' },
    '9:16': { iconClass: 'w-6 h-10', text: '9:16' },
    '16:9': { iconClass: 'w-12 h-6', text: '16:9' },
    '3:4': { iconClass: 'w-8 h-10', text: '3:4' },
  };
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400'}`}
    >
      <div className={`bg-slate-300 rounded-sm ${dimensions[value].iconClass}`}></div>
      <div className="text-center">
        <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>{label}</span>
        <span className={`block text-xs ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>{dimensions[value].text}</span>
      </div>
    </button>
  );
};

interface InputFieldProps {
  label: string;
  name: keyof JobDetails | 'prompt';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-600">{label}</label>
    <input 
      type="text" 
      id={name} 
      name={name} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
    />
  </div>
);

interface TextareaFieldProps {
  label: string;
  name: keyof JobDetails | 'prompt';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-600">{label}</label>
    <textarea 
      id={name} 
      name={name} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
    ></textarea>
  </div>
);

export default JobForm;