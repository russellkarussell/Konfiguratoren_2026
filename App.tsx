
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { FormData, Language, Results, CalculationMethod } from './types';
import { initialFormData, translations } from './constants';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step3 from './components/steps/Step3';
import Step4 from './components/steps/Step4';
import ProgressBar from './components/ProgressBar';
import { useCalculator } from './hooks/useCalculator';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [results, setResults] = useState<Results | null>(null);
  const [language, setLanguage] = useState<Language>('de');

  const containerRef = useRef<HTMLDivElement>(null);

  const calculate = useCalculator();

  const handleNext = useCallback(() => {
    if (currentPage < 4) {
      setCurrentPage(prev => prev + 1);
    }
    if (currentPage === 3) {
      const calculatedResults = calculate(formData);
      setResults(calculatedResults);
    }
  }, [currentPage, formData, calculate]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const t = useMemo(() => translations[language], [language]);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prev => {
        const newState = { ...prev, ...data };
        // Logic from original code to handle dependencies
        if (data.heizsystem === 'keine' && newState.method !== 'flaeche') {
            newState.method = 'flaeche';
        }
        if (data.gebaeudeklasse) {
             let fbhAnteil = 50, defaultVorlauf = 55;
            switch(data.gebaeudeklasse) {
                case "alt_unsaniert":   fbhAnteil = 0;   defaultVorlauf = 60; break;
                case "alt_teilsaniert": fbhAnteil = 10;  defaultVorlauf = 55; break;
                case "alt_saniert":     fbhAnteil = 30;  defaultVorlauf = 48; break;
                case "neubau":          fbhAnteil = 90;  defaultVorlauf = 40; break;
                case "niedrigenergie":  fbhAnteil = 100; defaultVorlauf = 35; break;
            }
            newState.anteilFussbodenheizung = fbhAnteil;
            newState.vorlauftemperatur = defaultVorlauf;
        }
        return newState;
    });
  }, []);

  const handleMethodChange = (method: CalculationMethod) => {
    updateFormData({ method });
  };

  const steps = [
    <Step1 formData={formData} updateFormData={updateFormData} t={t} onMethodChange={handleMethodChange} />,
    <Step2 formData={formData} updateFormData={updateFormData} t={t} />,
    <Step3 formData={formData} updateFormData={updateFormData} t={t} />,
    <Step4 results={results} formData={formData} t={t} language={language} />,
  ];

  // iFrame resize logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sendHeight = () => {
        const newHeight = container.scrollHeight;
        if (window.parent) {
            window.parent.postMessage({ iframeHeight: newHeight }, '*');
        }
    };

    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(container);
    sendHeight();

    return () => {
        resizeObserver.disconnect();
    };
  }, [currentPage]);


  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <div ref={containerRef} className="container mx-auto max-w-4xl p-4 sm:p-8">
        <div className="relative bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-full">
              {(['de', 'en', 'ro'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === lang ? 'bg-cyan-500 text-white shadow' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <ProgressBar currentPage={currentPage} totalPages={4} />

          <div className="mt-8">
            {steps[currentPage - 1]}
          </div>

          <div className={`mt-10 flex ${currentPage === 1 ? 'justify-end' : 'justify-between'} items-center`}>
            {currentPage > 1 && (
              <button
                onClick={handlePrev}
                className="px-6 py-3 bg-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-400 transition-colors shadow"
              >
                {t.prevBtn}
              </button>
            )}
            {currentPage < 4 && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-md"
              >
                {t.nextBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
