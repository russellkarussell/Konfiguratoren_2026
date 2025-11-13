
import React from 'react';

interface SliderInputProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  decimals?: number;
  disclaimer?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ id, label, min, max, step, value, onChange, unit, decimals = 0, disclaimer }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center space-x-4 mt-2">
        <input
          type="range"
          id={id}
          name={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <span className="text-sm font-bold text-orange-600 bg-orange-100 py-1 px-3 rounded-md w-28 text-center">
          {value.toFixed(decimals)} {unit}
        </span>
      </div>
      {disclaimer && <p className="text-xs text-slate-500 mt-2">{disclaimer}</p>}
    </div>
  );
};

export default SliderInput;
