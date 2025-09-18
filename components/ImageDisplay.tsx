
import React from 'react';
// FIX: Import Loader from './Loader' instead of './Icons'
import { ImageIcon } from './Icons';
import { Loader } from './Loader';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null | undefined;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading, children }) => {
  return (
    <div className="w-full flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-3 text-center text-gray-300">{title}</h3>
        <div className="w-full aspect-square bg-base-300 rounded-xl border-2 border-base-300 flex items-center justify-center overflow-hidden shadow-lg">
        {isLoading ? (
            <div className="flex flex-col items-center text-gray-400">
                <Loader large={true} />
                <p className="mt-2 text-sm">AI is thinking...</p>
            </div>
        ) : imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
            <div className="text-gray-500">
                <ImageIcon />
            </div>
        )}
        </div>
        {children}
    </div>
  );
};
