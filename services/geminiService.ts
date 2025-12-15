import { GoogleGenAI, Modality } from "@google/genai";
import type { JobDetails } from '../types';

// Support multiple API keys with fallback
let apiKeys: string[] = [];
let currentKeyIndex = 0;
let aiInstance: GoogleGenAI | null = null;

const getAPIKeys = (): string[] => {
  if (apiKeys.length === 0) {
    // Vite replaces process.env.GEMINI_API_KEY at build time via define in vite.config.ts
    const apiKeyString = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string;

    if (!apiKeyString || apiKeyString === 'undefined' || apiKeyString === 'null' || apiKeyString === '' || apiKeyString.trim() === '') {
      throw new Error('GEMINI_API_KEY is not set. Please:\n1. Ensure .env.local file exists in the project root\n2. Add: GEMINI_API_KEY=your_api_key_here\n3. Restart the dev server (npm run dev)\n\nNote: The dev server must be restarted after creating or modifying .env.local');
    }

    // Parse comma-separated API keys
    apiKeys = apiKeyString.split(',').map(key => key.trim()).filter(key => key.length > 0);

    // Debug: Log API key status (first 10 chars only for security)
    console.log('API Keys loaded:', {
      keyCount: apiKeys.length,
      keys: apiKeys.map(key => key.substring(0, 10) + '...'),
      envKeys: {
        hasAPI_KEY: !!process.env.API_KEY,
        hasGEMINI_API_KEY: !!process.env.GEMINI_API_KEY
      }
    });

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'geminiService.ts:4', message: 'API keys loaded', data: { keyCount: apiKeys.length, apiKeyPrefix: apiKeys[0]?.substring(0, 10) || 'none' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
  }
  return apiKeys;
};

const getAI = (keyIndex: number = 0): GoogleGenAI => {
  const keys = getAPIKeys();
  if (keyIndex >= keys.length) {
    throw new Error(`All API keys exhausted. Tried ${keys.length} key(s).`);
  }

  // Create new instance if needed or if switching keys
  if (!aiInstance || currentKeyIndex !== keyIndex) {
    aiInstance = new GoogleGenAI({ apiKey: keys[keyIndex] });
    currentKeyIndex = keyIndex;
  }

  return aiInstance;
};

const base64ToPart = (base64String: string): { mimeType: string, data: string } => {
  const match = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    console.error("Invalid base64 string format. Expected 'data:[mime-type];base64,[data]'");
    throw new Error("Invalid base64 string format");
  }
  const mimeType = match[1];
  const data = match[2];
  return { mimeType, data };
};

// Create a simple placeholder image when no image is provided
const createPlaceholderImage = (aspectRatio: string): string => {
  // Create a minimal valid PNG (1x1 transparent pixel) as base64
  // This will be transformed by the API into the hiring post
  const minimalPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return `data:image/png;base64,${minimalPNG}`;
};

export const generateHiringPost = async (details: JobDetails, logo: string | null, referenceImage: string | null, mode: 'form' | 'prompt', userPrompt: string, isRegeneration: boolean = false): Promise<string> => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/283580bf-e924-425d-aebb-7c2dc7374e65', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'geminiService.ts:18', message: 'generateHiringPost entry', data: { mode, hasLogo: !!logo, hasReferenceImage: !!referenceImage, hasUserPrompt: !!userPrompt, isRegeneration }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
  // #endregion
  const aspectRatio = details.aspectRatio || '1:1';

  // Build prompt from job details
  let prompt = '';

  if (mode === 'prompt') {
    prompt = userPrompt;
  } else {
    // Build prompt from form data
    prompt = `Create a professional hiring post image with the following details:\n`;

    if (details.jobTitle) {
      prompt += `Job Title: ${details.jobTitle}\n`;
    }
    if (details.companyName) {
      prompt += `Company: ${details.companyName}\n`;
    }
    if (details.location) {
      prompt += `Location: ${details.location}\n`;
    }
    if (details.department) {
      prompt += `Department: ${details.department}\n`;
    }
    if (details.experience) {
      prompt += `Experience Required: ${details.experience}\n`;
    }
    if (details.responsibilities) {
      prompt += `Responsibilities: ${details.responsibilities}\n`;
    }
    if (details.skills) {
      prompt += `Required Skills: ${details.skills}\n`;
    }
    if (details.email || details.mobileNo) {
      prompt += `Contact: ${[details.email, details.mobileNo].filter(Boolean).join(' | ')}\n`;
    }

    prompt += `\nDesign a modern, professional hiring post with clear typography, attractive layout, and include "WE'RE HIRING" as a prominent header.`;

    if (details.primaryColor && details.secondaryColor) {
      prompt += ` Use colors: primary ${details.primaryColor}, secondary ${details.secondaryColor}.`;
    }
  }

  // Use alternative API directly
  return await generateWithAlternativeAPI(prompt, referenceImage, logo, aspectRatio);
};

// Alternative API service using ai.twoblk.workers.dev
const generateWithAlternativeAPI = async (
  prompt: string,
  referenceImage: string | null,
  logo: string | null,
  aspectRatio: string
): Promise<string> => {
  console.log('🔄 Using alternative API: ai.twoblk.workers.dev');

  try {
    const formData = new FormData();

    // Convert aspect ratio to the format expected by the API
    let apiAspectRatio = 'match_input_image';
    if (aspectRatio === '1:1') {
      apiAspectRatio = '1:1';
    } else if (aspectRatio === '9:16') {
      apiAspectRatio = '9:16';
    } else if (aspectRatio === '16:9') {
      apiAspectRatio = '16:9';
    } else if (aspectRatio === '3:4') {
      apiAspectRatio = '3:4';
    }

    // Use reference image if available, otherwise use logo
    let imageToUse = referenceImage || logo;

    // If no image provided, create a simple placeholder image
    if (!imageToUse) {
      console.log('📝 No image provided, creating placeholder...');
      imageToUse = createPlaceholderImage(aspectRatio);
    }

    try {
      const { mimeType, data } = base64ToPart(imageToUse);
      // Convert base64 to blob
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const fileName = referenceImage ? 'reference.jpg' : (logo ? 'logo.jpg' : 'placeholder.png');
      formData.append('image', blob, fileName);
    } catch (e) {
      throw new Error(`Failed to process image for alternative API: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Build the prompt for the alternative API
    // This API transforms images, so we need to describe what transformation we want
    let apiPrompt = prompt;

    // Check if we're using a placeholder (no real image provided)
    const isPlaceholder = !referenceImage && !logo;

    if (isPlaceholder) {
      // When no image is provided, ask the API to create a new image from scratch
      apiPrompt = `Create a professional hiring post image from scratch with the following design: ${prompt}`;
    } else {
      // If we have a reference image or logo, we're transforming it
      apiPrompt = `Transform this image into a professional hiring post design. ${prompt}`;
    }

    formData.append('prompt', apiPrompt);
    // formData.append('model', 'nano');
    formData.append('sub_type', 2);
    formData.append('aspect_ratio', apiAspectRatio);

    console.log('📤 Sending request to alternative API...', {
      hasImage: !!imageToUse,
      aspectRatio: apiAspectRatio,
      promptLength: apiPrompt.length
    });

    // Use proxy to avoid CORS issues
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData
    });

    // Check content type to see if we got an image or an error
    const contentType = response.headers.get('content-type') || '';
    console.log('📥 Response received:', {
      status: response.status,
      contentType: contentType,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Alternative API returned ${response.status}: ${errorText.substring(0, 200)}`);
    }

    // Handle JSON response (which might contain the URL)
    if (contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      console.log('📄 API returned JSON:', jsonResponse);

      if (jsonResponse.success && Array.isArray(jsonResponse.output) && jsonResponse.output.length > 0) {
        // Return the first image URL from the output array
        const imageUrl = jsonResponse.output[0];
        console.log('✅ Found image URL in JSON response:', imageUrl);
        return imageUrl;
      } else {
        console.error('❌ API returned JSON but no valid output found:', jsonResponse);
        throw new Error(`API returned success=true but no output image found. Response: ${JSON.stringify(jsonResponse)}`);
      }
    }

    // The response should be an image (fallback for direct image response)
    // First, clone the response so we can read it multiple times if needed
    const responseClone = response.clone();
    const blob = await response.blob();

    // Validate blob size (images should be at least a few KB)
    if (blob.size < 1000) {
      // Try to read as text to see what we got (using the clone)
      const text = await responseClone.text();
      console.error('❌ Response too small, might be error:', text.substring(0, 500));
      throw new Error(`API returned invalid response (too small: ${blob.size} bytes). Response: ${text.substring(0, 200)}`);
    }

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64Data = base64String.split(',')[1] || base64String;
        console.log('✅ Alternative API success! Image received, size:', blob.size, 'bytes, type:', contentType);
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        reject(new Error('Failed to convert image to base64'));
      };
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error('❌ Alternative API error:', error);
    throw error;
  }
};