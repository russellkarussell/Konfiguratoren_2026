
import React from 'react';

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages }) => {
  const progress = ((currentPage - 1) / (totalPages - 1)) * 100;

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
