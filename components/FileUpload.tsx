
import React, { useState, useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
      onFileSelect(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div
        onClick={handleClick}
        className="w-full p-6 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-base-300 hover:border-brand-primary transition duration-300 flex flex-col items-center justify-center text-center"
      >
        <UploadIcon />
        {fileName ? (
          <p className="mt-2 text-sm font-medium text-gray-300">{fileName}</p>
        ) : (
          <p className="mt-2 text-sm text-gray-400">Click to browse or drag & drop a file</p>
        )}
        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
      </div>
    </div>
  );
};
