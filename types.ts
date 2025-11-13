export type Language = 'de' | 'en' | 'ro';
export type CalculationMethod = 'flaeche' | 'verbrauch';
export type Gebaeudeklasse = 'alt_unsaniert' | 'alt_teilsaniert' | 'alt_saniert' | 'neubau' | 'niedrigenergie';
export type Heizsystem = 'heizoel' | 'erdgas_h' | 'erdgas_l' | 'fluessiggas' | 'pellets' | 'strom' | 'keine';
export type SolarthermieType = 'flach' | 'roehren';
export type Optimization = 'pv' | 'solarthermie' | 'fans';

export interface FormData {
  method: CalculationMethod;
  verbrauch: number;
  flaeche: number;
  gebaeudeklasse: Gebaeudeklasse;
  heizsystem: Heizsystem;
  wirkungsgradAlt: number;
  preis: number;
  strompreis: number;
  anteilFussbodenheizung: number;
  vorlauftemperatur: number;
  optimizations: Optimization[];
  pvLeistung: number;
  pvAnteil: number;
  pvStrompreis: number;
  solarthermieFlaeche: number;
  solarthermieTyp: SolarthermieType;
  investition: number;
  foerderungen: number;
  wartungskostenAlt: number;
  wartungskostenWP: number;
}

export interface Results {
  nutzwaermeBedarf: number;
  kostenAktuell: number;
  co2Altanlage: number;
  wpLeistung: number;
  jazEffektiv: number;
  fanEffect: number | null;
  kostenWP: number;
  co2WP: number;
  ersparnis: number;
  co2Ersparnis: number;
  co2Fussballfelder: number;
  amortisation: number | string;
}

export interface TranslationSet {
  step1Title: string;
  basisTitle: string;
  basisText: string;
  basisArea: string;
  basisConsumption: string;
  yourConsumptionTitle: string;
  annualConsumptionLabel: string;
  yourPropertyTitle: string;
  buildingClassLabel: string;
  areaLabel: string;
  currentSystemTitle: string;
  efficiencyOldLabel: string;
  efficiencyOldDisclaimer: string;
  priceOldLabel: string;
  step2Title: string;
  heatpumpDataTitle: string;
  gridPriceLabel: string;
  gridPriceDisclaimer: string;
  floorHeatingShareLabel: string;
  floorHeatingShareDisclaimer: string;
  flowTempLabel: string;
  baseScopInfo: string;
  optimizationsTitle: string;
  optimizationsText: string;
  fanEffectText: string;
  fanEffectScopText: string;
  pvCapacityLabel: string;
  pvYieldInfo: string;
  pvShareLabel: string;
  pvPriceLabel: string;
  pvDisclaimer: string;
  solarTypeLabel: string;
  solarAreaLabel: string;
  solarYieldInfo: string;
  solarDisclaimer: string;
  step3Title: string;
  investmentTitle: string;
  investmentLabel: string;
  investmentDisclaimer: string;
  fundingLabel: string;
  fundingDisclaimer: string;
  runningCostsTitle: string;
  maintenanceOldLabel: string;
  maintenanceNewLabel: string;
  step4Title: string;
  resultHeatDemand: string;
  resultCostsOld: string;
  resultCo2Old: string;
  resultHpPower: string;
  resultCop: string;
  resultCostsNew: string;
  resultCostsNewBuild: string;
  resultCo2New: string;
  resultSavingsAnnual: string;
  resultSavingsCo2: string;
  resultSavingsCo2Eq: string;
  resultAmortization: string;
  unitYear: string;
  unitYears: string;
  fanResultLabel: string;
  resultDisclaimer: string;
  exportPdfButton: string;
  priceUpdateInfo: string;
  prevBtn: string;
  nextBtn: string;
  pdfExports: string;
  configId: string;
  amortizationNone: string;
  amortizationImmediate: string;
  amortizationNotApplicable: string;
  commentaryTitle: string;
  generatingCommentary: string;
  commentaryError: string;
  pdfTitle: string,
  pdfInputsTitle: string,
  pdfResultsTitle: string,
  pdfFooter: string,
  recommendedProductTitle: string,
  uspEhpa: string,
  uspEfficiency: string,
  uspQuiet: string,
  uspEco: string,
  productLinkButton: string,
}

export type Translations = Record<Language, TranslationSet>;

export interface IconDefinition {
  value: string;
  text: string;
  kWhText?: string;
  wText?: string;
  svg: string;
}

export interface OptimizationDefinition {
  id: Optimization;
  text: string;
  svg: string;
}

export interface HeatPumpProduct {
  id: string;
  name: string;
  power: number;
  refrigerant: 'R290' | 'R32';
  imageUrl: string;
  productUrl: string;
  usps: (keyof Pick<TranslationSet, 'uspEhpa' | 'uspEfficiency' | 'uspQuiet' | 'uspEco'>)[];
}