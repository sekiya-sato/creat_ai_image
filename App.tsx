
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { editImage } from './services/geminiService';
import type { EditedImageResponse } from './types';
import { ArrowRightIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<EditedImageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setOriginalImage(file);
    setEditedImage(null);
    setError(null);
    if (file) {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
      setOriginalImageUrl(URL.createObjectURL(file));
    } else {
      setOriginalImageUrl(null);
    }
  };

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const imagePart = await fileToGenerativePart(originalImage);
      const result = await editImage(imagePart.inlineData.data, imagePart.inlineData.mimeType, prompt);
      setEditedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-base-100 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-base-200 p-6 md:p-8 rounded-2xl shadow-2xl border border-base-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Control Panel */}
            <div className="flex flex-col space-y-6">
              <div>
                <label className="text-lg font-semibold text-gray-300 mb-2 block">1. Upload Your Photo</label>
                <FileUpload onFileSelect={handleFileChange} />
              </div>
              <div>
                <label htmlFor="prompt-input" className="text-lg font-semibold text-gray-300 mb-2 block">2. Describe Your Edit</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'add a birthday hat on the dog' or 'make the background a cyberpunk city'"
                  className="w-full h-32 p-3 bg-base-300 border-2 border-base-300 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-300"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !originalImage || !prompt}
                className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    <span>Generate Edit</span>
                  </>
                )}
              </button>
              {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
            </div>

            {/* Image Displays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
              <ImageDisplay title="Original" imageUrl={originalImageUrl} />
              <div className="hidden lg:flex items-center justify-center h-full">
                <ArrowRightIcon />
              </div>
              <ImageDisplay 
                title="Edited" 
                imageUrl={editedImage?.imageUrl}
                isLoading={isLoading}
              >
                 {editedImage?.text && <p className="mt-2 text-sm text-center text-gray-400 italic p-2 bg-base-300 rounded-md">AI: "{editedImage.text}"</p>}
              </ImageDisplay>
            </div>
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini Nano Banana Model</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
