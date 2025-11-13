
import React from 'react';
import type { FormData, TranslationSet } from '../../types';
import Card from '../ui/Card';
import SliderInput from '../ui/SliderInput';

interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  t: TranslationSet;
}

const Step3: React.FC<Step3Props> = ({ formData, updateFormData, t }) => {
  const isNewBuild = formData.heizsystem === 'keine';

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">{t.step3Title}</h2>

      <Card>
        <h3 className="text-lg font-semibold text-cyan-700">{t.investmentTitle}</h3>
        <div className="mt-4 space-y-6">
          <SliderInput
            id="investition"
            label={t.investmentLabel}
            min={5000}
            max={50000}
            step={500}
            value={formData.investition}
            onChange={(value) => updateFormData({ investition: value })}
            unit="€"
            disclaimer={t.investmentDisclaimer}
          />
          <SliderInput
            id="foerderungen"
            label={t.fundingLabel}
            min={0}
            max={25000}
            step={100}
            value={formData.foerderungen}
            onChange={(value) => updateFormData({ foerderungen: value })}
            unit="€"
            disclaimer={t.fundingDisclaimer}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-cyan-700">{t.runningCostsTitle}</h3>
        <div className="mt-4 space-y-6">
          {!isNewBuild && (
            <SliderInput
              id="wartungskostenAlt"
              label={t.maintenanceOldLabel}
              min={0}
              max={1000}
              step={10}
              value={formData.wartungskostenAlt}
              onChange={(value) => updateFormData({ wartungskostenAlt: value })}
              unit="€"
            />
          )}
          <SliderInput
            id="wartungskostenWP"
            label={t.maintenanceNewLabel}
            min={0}
            max={1000}
            step={10}
            value={formData.wartungskostenWP}
            onChange={(value) => updateFormData({ wartungskostenWP: value })}
            unit="€"
          />
        </div>
      </Card>
    </div>
  );
};

export default Step3;
