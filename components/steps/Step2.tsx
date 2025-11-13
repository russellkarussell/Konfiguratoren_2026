
import React from 'react';
import type { FormData, Optimization, SolarthermieType, TranslationSet } from '../../types';
import Card from '../ui/Card';
import SliderInput from '../ui/SliderInput';
import IconSelect from '../ui/IconSelect';
import { optimizationDefinitions, getOptimizationSvg, solarthermieTypeDefinitions, getSolarthermieTypeSvg, config } from '../../constants';

interface Step2Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  t: TranslationSet;
}

const Step2: React.FC<Step2Props> = ({ formData, updateFormData, t }) => {
  const toggleOptimization = (opt: Optimization) => {
    const newOpts = formData.optimizations.includes(opt)
      ? formData.optimizations.filter(o => o !== opt)
      : [...formData.optimizations, opt];
    updateFormData({ optimizations: newOpts });
  };
  
  const pvErtrag = formData.pvLeistung * config.pvYieldFactor;
  const solarErtrag = formData.solarthermieFlaeche * config.solarYieldFactors[formData.solarthermieTyp];
  const basisSCOP = 4.8 + ((formData.vorlauftemperatur - 35) / (55 - 35)) * (3.2 - 4.8);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">{t.step2Title}</h2>

      <Card>
        <h3 className="text-lg font-semibold text-cyan-700">{t.heatpumpDataTitle}</h3>
        <div className="mt-4 space-y-6">
          <SliderInput
            id="strompreis"
            label={t.gridPriceLabel}
            min={0.15} max={0.60} step={0.01}
            value={formData.strompreis}
            onChange={(value) => updateFormData({ strompreis: value })}
            unit="€/kWh"
            decimals={2}
            disclaimer={t.gridPriceDisclaimer}
          />
          <SliderInput
            id="anteilFussbodenheizung"
            label={t.floorHeatingShareLabel}
            min={0} max={100} step={1}
            value={formData.anteilFussbodenheizung}
            onChange={(value) => updateFormData({ anteilFussbodenheizung: value })}
            unit="%"
            disclaimer={t.floorHeatingShareDisclaimer}
          />
          <SliderInput
            id="vorlauftemperatur"
            label={t.flowTempLabel}
            min={30} max={75} step={1}
            value={formData.vorlauftemperatur}
            onChange={(value) => updateFormData({ vorlauftemperatur: value })}
            unit="°C"
          />
           <p className="text-sm text-slate-600">{t.baseScopInfo} <span className="font-bold text-orange-600">{Math.max(2.0, basisSCOP).toFixed(1)}</span></p>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-cyan-700">{t.optimizationsTitle}</h3>
        <p className="mt-1 text-sm text-slate-600 mb-4">{t.optimizationsText}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {optimizationDefinitions[t.nextBtn === 'Next' ? 'en' : t.nextBtn === 'Următorul' ? 'ro' : 'de'].map(opt => {
            const isActive = formData.optimizations.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOptimization(opt.id)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${isActive ? 'bg-cyan-50 border-cyan-500' : 'bg-white border-slate-200 hover:border-cyan-300'}`}
              >
                <div className={`mx-auto h-12 w-12 mb-2 ${isActive ? '[&>svg]:fill-cyan-600' : '[&>svg]:fill-slate-500'}`}
                    dangerouslySetInnerHTML={{ __html: getOptimizationSvg(opt.id) }}
                />
                <span className={`font-semibold ${isActive ? 'text-cyan-700' : 'text-slate-700'}`}>{opt.text}</span>
              </button>
            )
          })}
        </div>

        {formData.optimizations.includes('pv') && (
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
            <SliderInput
              id="pvLeistung"
              label={t.pvCapacityLabel}
              min={1} max={20} step={0.5}
              value={formData.pvLeistung}
              onChange={(value) => updateFormData({ pvLeistung: value })}
              unit="kWp"
              decimals={1}
            />
             <p className="text-sm text-slate-600 text-center">{t.pvYieldInfo}: <span className="font-bold text-orange-600">{pvErtrag.toFixed(0)} kWh</span></p>
            <SliderInput
              id="pvAnteil"
              label={t.pvShareLabel}
              min={0} max={100} step={1}
              value={formData.pvAnteil}
              onChange={(value) => updateFormData({ pvAnteil: value })}
              unit="%"
            />
            <div>
              <label htmlFor="pvStrompreisInput" className="block text-sm font-medium text-slate-700">{t.pvPriceLabel}</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="number"
                    id="pvStrompreisInput"
                    step="0.01"
                    value={formData.pvStrompreis}
                    onChange={(e) => updateFormData({ pvStrompreis: parseFloat(e.target.value) })}
                    className="block w-full flex-1 rounded-none rounded-l-md border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                    €/kWh
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{t.pvDisclaimer}</p>
            </div>
          </div>
        )}

        {formData.optimizations.includes('solarthermie') && (
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
             <label className="block text-sm font-medium text-slate-700 mb-2">{t.solarTypeLabel}</label>
             <IconSelect
                options={solarthermieTypeDefinitions[t.nextBtn === 'Next' ? 'en' : t.nextBtn === 'Următorul' ? 'ro' : 'de'].map(d => ({...d, svg: getSolarthermieTypeSvg(d.value as SolarthermieType)}))}
                selectedValue={formData.solarthermieTyp}
                onSelect={(value) => updateFormData({ solarthermieTyp: value })}
                columns={2}
             />
            <SliderInput
              id="solarthermieFlaeche"
              label={t.solarAreaLabel}
              min={0} max={30} step={1}
              value={formData.solarthermieFlaeche}
              onChange={(value) => updateFormData({ solarthermieFlaeche: value })}
              unit="m²"
            />
            <p className="text-sm text-slate-600 text-center">{t.solarYieldInfo}: <span className="font-bold text-orange-600">{solarErtrag.toFixed(0)} kWh</span></p>
            <p className="mt-2 text-xs text-slate-500">{t.solarDisclaimer}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Step2;
