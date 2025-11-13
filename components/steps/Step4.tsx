import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Results, FormData, Language, TranslationSet } from '../../types';
import { generateInterpretation } from '../../services/geminiService';
import { heatPumpProducts } from '../../constants';
import Card from '../ui/Card';

interface Step4Props {
  results: Results | null;
  formData: FormData;
  t: TranslationSet;
  language: Language;
}

const ResultRow: React.FC<{ label: string; value: string; unit: string; highlight?: boolean; negative?: boolean; }> = ({ label, value, unit, highlight, negative }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
        <p className="text-slate-600 text-sm">{label}</p>
        <p className={`font-bold text-right text-base ${highlight ? (negative ? 'text-red-500' : 'text-orange-600') : 'text-slate-800'}`}>
            {value} <span className="font-normal text-sm text-slate-500">{unit}</span>
        </p>
    </div>
);

// Helper function to convert simple markdown to HTML
const markdownToHtml = (text: string): string => {
  if (!text) return '';
  
  // Convert links: [text](url) -> <a href="url">text</a>
  let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-600 font-semibold hover:underline">$1</a>');
  
  // Convert bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert paragraphs (split by newlines, wrap in <p> tags)
  html = html
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => `<p>${line}</p>`)
    .join('');
    
  return html;
};


const Step4: React.FC<Step4Props> = ({ results, formData, t, language }) => {
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const recommendedProduct = useMemo(() => {
    if (!results) return null;

    const requiredPower = results.wpLeistung;

    // Find all pumps that meet or exceed the required power
    const suitablePumps = heatPumpProducts.filter(p => p.power >= requiredPower);

    if (suitablePumps.length > 0) {
        // Separate by refrigerant type
        const r290Candidates = suitablePumps.filter(p => p.refrigerant === 'R290');
        const r32Candidates = suitablePumps.filter(p => p.refrigerant === 'R32');
        
        // Sort candidates by power, ascending, to find the one with the least oversizing
        r290Candidates.sort((a, b) => a.power - b.power);
        r32Candidates.sort((a, b) => a.power - b.power);

        // Prioritize R290
        if (r290Candidates.length > 0) {
            return r290Candidates[0];
        }
        // Fallback to R32
        if (r32Candidates.length > 0) {
            return r32Candidates[0];
        }
    }
    
    // Fallback: If no pump is powerful enough, recommend the most powerful one available
    // Sort all products by power descending and pick the first one
    const sortedByPowerDesc = [...heatPumpProducts].sort((a, b) => b.power - a.power);
    return sortedByPowerDesc[0] || null;

  }, [results]);

  useEffect(() => {
    if (results) {
      setIsLoading(true);
      setError(null);
      generateInterpretation(formData, results, language)
        .then(text => {
          setInterpretation(markdownToHtml(text));
        })
        .catch(err => {
          console.error(err);
          setError(t.commentaryError);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [results, formData, language, t.commentaryError]);
  
  const handleExportPdf = async () => {
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;
    const container = pdfExportRef.current;

    if (!container || !jsPDF || !html2canvas) return;

    setIsExporting(true);

    // Create a temporary, fixed-width container for rendering
    const exportContainer = document.createElement('div');
    // Inherit base styles for consistent font and text rendering
    exportContainer.className = 'font-sans text-slate-800';
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '896px'; // Match the app's max-w-4xl for realistic rendering
    exportContainer.style.backgroundColor = 'white';
    
    // Clone the content into the temporary container
    const contentToExport = container.cloneNode(true) as HTMLElement;
    exportContainer.appendChild(contentToExport);
    document.body.appendChild(exportContainer);

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pdfWidth - margin * 2;
        let currentY = margin;

        const addCanvasToPdf = async (canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png', 0.95);
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

            if (currentY + imgHeight > pdfHeight - margin) {
                pdf.addPage();
                currentY = margin;
            }

            pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight);
            currentY += imgHeight + 8; // Margin after element
        };

        pdf.setFontSize(22);
        pdf.setTextColor(40, 40, 40);
        pdf.text(t.pdfTitle, margin, currentY);
        currentY += 15;

        const elementIds = [
            'pdf-stat-cards',
            'pdf-old-system',
            'pdf-new-system',
            'pdf-analysis',
            'pdf-product-recommendation',
            'pdf-interpretation'
        ];

        for (const id of elementIds) {
            const element = contentToExport.querySelector<HTMLElement>(`#${id}`);
            if (element) {
                const buttons = element.querySelectorAll('button, a');
                buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'hidden');

                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: '#f8fafc' 
                });
                await addCanvasToPdf(canvas);
            }
        }

        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            const footerText = t.pdfFooter
                .replace('{date}', new Date().toLocaleDateString())
                .replace('{id}', 'generated-online');
            pdf.text(footerText, margin, pdfHeight - 8);
            pdf.text(`${t.pdfExports} ${i} / ${pageCount}`, pdfWidth - margin, pdfHeight - 8, { align: 'right' });
        }

        pdf.save(`Heizkosten-Analyse-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
        console.error("PDF Export failed", e);
        // Optionally show an error to the user here
    } finally {
        document.body.removeChild(exportContainer);
        setIsExporting(false);
    }
  };


  if (!results) {
    return <div>Loading results...</div>;
  }
  
  const isNewBuild = formData.heizsystem === 'keine';

  let amortizationText = results.amortisation;
  if (typeof results.amortisation === 'number') {
    amortizationText = `${results.amortisation.toFixed(1)}`;
  } else if (results.amortisation === 'immediate') {
    amortizationText = t.amortizationImmediate;
  } else if (results.amortisation === 'none') {
    amortizationText = t.amortizationNone;
  } else {
    amortizationText = t.amortizationNotApplicable;
  }

  return (
    <div ref={pdfExportRef} className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">{t.step4Title}</h2>

      <div id="pdf-stat-cards" className="grid md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-4 sm:p-5 bg-cyan-50 border border-cyan-200 rounded-xl text-center shadow-sm">
            <p className="text-sm text-cyan-800 font-semibold">{t.resultHpPower}</p>
            <p className="text-3xl font-bold text-cyan-700 mt-1">{results.wpLeistung.toFixed(1)} <span className="text-xl font-medium">kW</span></p>
        </div>
        <div className="p-4 sm:p-5 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
            <p className="text-sm text-green-800 font-semibold">{t.resultSavingsAnnual}</p>
            <p className={`text-3xl font-bold mt-1 ${results.ersparnis < 0 ? 'text-red-500' : 'text-green-600'}`}>{results.ersparnis.toFixed(0)} <span className="text-xl font-medium">€/{t.unitYear}</span></p>
        </div>
        <div className="p-4 sm:p-5 bg-slate-100 border border-slate-200 rounded-xl text-center shadow-sm">
            <p className="text-sm text-slate-800 font-semibold">{t.resultSavingsCo2}</p>
            <p className="text-3xl font-bold text-slate-700 mt-1">{results.co2Ersparnis.toFixed(0)} <span className="text-xl font-medium">kg/{t.unitYear}</span></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {!isNewBuild && (
            <div id="pdf-old-system">
              <h3 className="text-lg font-semibold text-cyan-700 mb-2">{t.resultCostsOld}</h3>
              <Card>
                <ResultRow label={t.resultHeatDemand} value={results.nutzwaermeBedarf.toFixed(0)} unit="kWh" />
                <ResultRow label={t.resultCostsOld} value={results.kostenAktuell.toFixed(2)} unit={`€/${t.unitYear}`} />
                <ResultRow label={t.resultCo2Old} value={results.co2Altanlage.toFixed(0)} unit={`kg/${t.unitYear}`} />
              </Card>
            </div>
          )}
          <div id="pdf-new-system">
            <h3 className="text-lg font-semibold text-cyan-700 mb-2">{isNewBuild ? t.resultCostsNewBuild : t.resultCostsNew}</h3>
            <Card>
             <ResultRow label={t.resultCostsNew} value={results.kostenWP.toFixed(2)} unit={`€/${t.unitYear}`} />
             <ResultRow label={t.resultCo2New} value={results.co2WP.toFixed(0)} unit={`kg/${t.unitYear}`} />
            </Card>
          </div>
        </div>

        <div className="space-y-8">
            <div id="pdf-analysis">
              <h3 className="text-lg font-semibold text-cyan-700 mb-2">Analyse</h3>
              <Card>
                <ResultRow label={t.resultCop} value={results.jazEffektiv.toFixed(1)} unit="" />
                {!isNewBuild && (
                  <ResultRow label={t.resultAmortization} value={amortizationText.toString()} unit={typeof results.amortisation === 'number' ? t.unitYears : ''} highlight={true} />
                )}
                 <div className="flex justify-between items-center py-3">
                  <p className="text-slate-600 text-sm">{t.resultSavingsCo2}</p>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-base">{results.co2Ersparnis.toFixed(0)} <span className="font-normal text-sm text-slate-500">kg/{t.unitYear}</span></p>
                    <small className="text-slate-500 text-xs">{t.resultSavingsCo2Eq.replace('{value}', results.co2Fussballfelder.toFixed(1))}</small>
                  </div>
                </div>
              </Card>
            </div>
            
            {recommendedProduct && (
              <div id="pdf-product-recommendation">
                  <h3 className="text-lg font-semibold text-cyan-700 mb-2">{t.recommendedProductTitle}</h3>
                  <Card>
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="flex-shrink-0 w-32 h-32">
                              <img src={recommendedProduct.imageUrl} alt={recommendedProduct.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-grow">
                              <h4 className="font-bold text-slate-800">{recommendedProduct.name}</h4>
                              <ul className="mt-2 space-y-1 text-sm">
                                  {recommendedProduct.usps.map(uspKey => (
                                      <li key={uspKey} className="flex items-center text-slate-600">
                                          <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                          {t[uspKey]}
                                      </li>
                                  ))}
                              </ul>
                              <a href={recommendedProduct.productUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-orange-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                  {t.productLinkButton}
                              </a>
                          </div>
                      </div>
                  </Card>
              </div>
            )}

        </div>
      </div>
      
      <div id="pdf-interpretation">
        <h3 className="text-lg font-semibold text-cyan-700 mb-2">{t.commentaryTitle}</h3>
        <Card>
          {isLoading && <p className="text-slate-500 animate-pulse">{t.generatingCommentary}</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
            <div className="prose prose-sm max-w-none prose-p:my-2 prose-strong:text-slate-900" dangerouslySetInnerHTML={{ __html: interpretation }}></div>
          )}
        </Card>
      </div>

      <div className="text-center mt-8">
        <button onClick={handleExportPdf} disabled={isExporting} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed">
          {isExporting ? 'Exportiere...' : t.exportPdfButton}
        </button>
      </div>
      
      <p className="text-xs text-slate-500 mt-4">{t.resultDisclaimer}</p>
      <p className="text-xs text-slate-500 text-center bg-slate-100 p-2 rounded-md mt-4">{t.priceUpdateInfo}</p>
    </div>
  );
};

export default Step4;