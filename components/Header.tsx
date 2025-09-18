
import React from 'react';
import { BananaIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm border-b border-base-300 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <BananaIcon />
        <h1 className="text-2xl md:text-3xl font-bold text-white ml-3">
          AI Photo Editor <span className="text-yellow-300">Nano</span>
        </h1>
      </div>
    </header>
  );
};
