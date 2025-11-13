
import React from 'react';

interface Option {
  value: string;
  text: string;
  svg: string;
  kWhText?: string;
  wText?: string;
}

interface IconSelectProps<T extends string> {
  options: Option[];
  selectedValue: T;
  onSelect: (value: T) => void;
  columns?: number;
}

const IconSelect = <T extends string>({ options, selectedValue, onSelect, columns = 3 }: IconSelectProps<T>) => {
  const gridClasses: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }
  
  return (
    <div className={`grid ${gridClasses[columns] || 'grid-cols-2 md:grid-cols-3'} gap-3 sm:gap-4`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value as T)}
          className={`p-4 border-2 rounded-lg text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
            ${selectedValue === option.value
              ? 'bg-cyan-50 border-cyan-500 shadow-md'
              : 'bg-white border-slate-200 hover:border-cyan-400 hover:bg-cyan-50'
            }`}
        >
          <div
            className={`mx-auto h-12 w-12 mb-2 ${selectedValue === option.value ? '[&>svg]:fill-cyan-600' : '[&>svg]:fill-slate-500'}`}
            dangerouslySetInnerHTML={{ __html: option.svg }}
          />
          <span className={`block font-semibold text-sm ${selectedValue === option.value ? 'text-cyan-700' : 'text-slate-700'}`}>
            {option.text}
          </span>
          {option.kWhText && (
            <span className="block text-xs text-slate-500 mt-1">
                {option.kWhText}<br/>{option.wText}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default IconSelect;
