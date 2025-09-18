
import React from 'react';

export const Loader: React.FC<{ large?: boolean }> = ({ large = false }) => {
  const sizeClass = large ? 'h-10 w-10' : 'h-5 w-5';
  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-4 border-t-transparent border-brand-secondary mr-3`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
