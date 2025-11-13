
import React from 'react';
import type { FormData, TranslationSet, CalculationMethod, Heizsystem, Gebaeudeklasse } from '../../types';
import { config, gebaeudeklasseDefinitions, getGebaeudeklasseSvg, heizsystemDefinitions, getHeizsystemSvg } from '../../constants';
import Card from '../ui/Card';
import SliderInput from '../ui/SliderInput';
import IconSelect from '../ui/IconSelect';

interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onMethodChange: (method: CalculationMethod) => void;
  t: TranslationSet;
}

const Step1: React.FC<Step1Props> = ({ formData, updateFormData, onMethodChange, t }) => {
  const selectedHeizsystemConfig = config.priceSliderConfigs[formData.heizsystem];
  const isNewBuild = formData.heizsystem === 'keine';

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">{t.step1Title}</h2>

      {!isNewBuild && (
        <Card>
          <h3 className="text-lg font-semibold text-cyan-700">{t.basisTitle}</h3>
          <p className="mt-1 text-sm text-slate-600 mb-4">{t.basisText}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onMethodChange('flaeche')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${formData.method === 'flaeche' ? 'bg-cyan-50 border-cyan-500' : 'bg-white border-slate-200 hover:border-cyan-300'}`}
              >
                <h4 className="font-bold text-slate-800">{t.basisArea}</h4>
              </button>
              <button
                type="button"
                onClick={() => onMethodChange('verbrauch')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${formData.method === 'verbrauch' ? 'bg-cyan-50 border-cyan-500' : 'bg-white border-slate-200 hover:border-cyan-300'}`}
              >
                <h4 className="font-bold text-slate-800">{t.basisConsumption}</h4>
              </button>
          </div>
        </Card>
      )}

      {formData.method === 'verbrauch' && !isNewBuild && (
        <Card>
          <h3 className="text-lg font-semibold text-cyan-700">{t.yourConsumptionTitle}</h3>
          <div className="mt-4">
             <label htmlFor="verbrauch" className="block text-sm font-medium text-slate-700">{t.annualConsumptionLabel}</label>
             <div className="mt-1 flex rounded-md shadow-sm">
                 <input
                     type="number"
                     id="verbrauch"
                     value={formData.verbrauch}
                     onChange={(e) => updateFormData({ verbrauch: parseFloat(e.target.value) })}
                     className="block w-full flex-1 rounded-none rounded-l-md border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                     placeholder="2000"
                 />
                 <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                     {config.priceSliderConfigs[formData.heizsystem].unit.split('/')[1] || 'Einheiten'}
                 </span>
             </div>
          </div>
        </Card>
      )}

      {(formData.method === 'flaeche' || isNewBuild) && (
        <Card>
          <h3 className="text-lg font-semibold text-cyan-700">{t.yourPropertyTitle}</h3>
          <div className="mt-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t.buildingClassLabel}</label>
              <IconSelect
                options={gebaeudeklasseDefinitions[t.nextBtn === 'Next' ? 'en' : t.nextBtn === 'Următorul' ? 'ro' : 'de'].map(d => ({...d, svg: getGebaeudeklasseSvg(d.value as Gebaeudeklasse)}))}
                selectedValue={formData.gebaeudeklasse}
                onSelect={(value) => updateFormData({ gebaeudeklasse: value })}
                columns={5}
              />
            </div>
            <SliderInput
              id="flaeche"
              label={t.areaLabel}
              min={50} max={400} step={1}
              value={formData.flaeche}
              onChange={(value) => updateFormData({ flaeche: value })}
              unit="m²"
            />
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-cyan-700">{t.currentSystemTitle}</h3>
        <div className="mt-4 space-y-6">
            <IconSelect
              options={heizsystemDefinitions[t.nextBtn === 'Next' ? 'en' : t.nextBtn === 'Următorul' ? 'ro' : 'de'].map(d => ({ ...d, svg: getHeizsystemSvg(d.value as Heizsystem) }))}
              selectedValue={formData.heizsystem}
              onSelect={(value) => updateFormData({ heizsystem: value, wirkungsgradAlt: config.defaultWirkungsgrade[value], preis: config.defaultPrices[value] })}
            />
          <div className={`${isNewBuild ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="space-y-6 pointer-events-none">
              <SliderInput
                id="wirkungsgradAlt"
                label={t.efficiencyOldLabel}
                min={50} max={100} step={1}
                value={formData.wirkungsgradAlt}
                onChange={(value) => updateFormData({ wirkungsgradAlt: value })}
                unit="%"
                disclaimer={t.efficiencyOldDisclaimer}
              />
              <SliderInput
                id="preis"
                label={t.priceOldLabel}
                min={selectedHeizsystemConfig.min}
                max={selectedHeizsystemConfig.max}
                step={selectedHeizsystemConfig.step}
                value={formData.preis}
                onChange={(value) => updateFormData({ preis: value })}
                unit={selectedHeizsystemConfig.unit}
                decimals={2}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step1;
