import type { FormData, Gebaeudeklasse, Heizsystem, SolarthermieType, TranslationSet, Translations, IconDefinition, OptimizationDefinition, Optimization, HeatPumpProduct } from './types';

export const initialFormData: FormData = {
  method: 'flaeche',
  verbrauch: 2000,
  flaeche: 150,
  gebaeudeklasse: 'alt_unsaniert',
  heizsystem: 'heizoel',
  wirkungsgradAlt: 80,
  preis: 1.03,
  strompreis: 0.19,
  anteilFussbodenheizung: 50,
  vorlauftemperatur: 55,
  optimizations: [],
  pvLeistung: 5,
  pvAnteil: 30,
  pvStrompreis: 0.08,
  solarthermieFlaeche: 4,
  solarthermieTyp: 'flach',
  investition: 20000,
  foerderungen: 5000,
  wartungskostenAlt: 150,
  wartungskostenWP: 250,
};

export const config = {
  energyFactors: { heizoel: 9.9, erdgas_h: 10.6, erdgas_l: 9.2, fluessiggas: 6.7, pellets: 4.9, strom: 1.0, keine: 0 } as Record<Heizsystem, number>,
  defaultPrices: {
    heizoel: 1.03, erdgas_h: (0.11 * 10.6), erdgas_l: (0.11 * 9.2),
    fluessiggas: 0.70, pellets: 0.30, strom: 0.19, keine: 0
  } as Record<Heizsystem, number>,
  priceSliderConfigs: {
    heizoel: { min: 0.50, max: 2.50, step: 0.01, unit: "€/Liter" },
    erdgas_h: { min: 0.50, max: 3.00, step: 0.01, unit: "€/m³" },
    erdgas_l: { min: 0.50, max: 3.00, step: 0.01, unit: "€/m³" },
    fluessiggas: { min: 0.40, max: 2.00, step: 0.01, unit: "€/Liter" },
    pellets: { min: 0.15, max: 0.80, step: 0.01, unit: "€/kg" },
    strom: { min: 0.15, max: 0.60, step: 0.01, unit: "€/kWh" },
    keine: { min: 0, max: 0, step: 0.01, unit: "" }
  } as Record<Heizsystem, { min: number, max: number, step: number, unit: string }>,
  defaultWirkungsgrade: {
    heizoel: 80, erdgas_h: 82, erdgas_l: 82, fluessiggas: 85, pellets: 88, strom: 100, keine: 100
  } as Record<Heizsystem, number>,
  co2FactorsKwhInput: {
    heizoel: 0.269, erdgas_h: 0.202, erdgas_l: 0.202, fluessiggas: 0.230,
    pellets: 0.02, strom: 0.12, keine: 0
  } as Record<Heizsystem, number>,
  stromCo2Faktor: 0.12,
  kgCo2ProFussballfeldWaldProJahr: 5600,
  // RESEARCH-BASED VALUES for annual heat demand (kWh/m²·a)
  klasseFactors: { alt_unsaniert: 200, alt_teilsaniert: 150, alt_saniert: 100, neubau: 70, niedrigenergie: 30 } as Record<Gebaeudeklasse, number>,
  // RESEARCH-BASED VALUES for specific heat load (W/m²)
  specificHeatLoad: { alt_unsaniert: 100, alt_teilsaniert: 70, alt_saniert: 50, neubau: 40, niedrigenergie: 25 } as Record<Gebaeudeklasse, number>,
  // RESEARCH-BASED VALUES for full load hours (h)
  fullLoadHours: { alt_unsaniert: 2200, alt_teilsaniert: 2000, alt_saniert: 2000, neubau: 1800, niedrigenergie: 1800 } as Record<Gebaeudeklasse, number>,
  heizkoerperventilatorEffekt: 5, // Temperature reduction in °C
  solarYieldFactors: { flach: 350, roehren: 450 } as Record<SolarthermieType, number>, // kWh per m² per year
  pvYieldFactor: 1000, // kWh per kWp per year
  pvRealismFactor: 0.4, // Realistic share of PV yield that can directly supply the heat pump
  warmwasserPauschaleProPersonKw: 0.25, // For future use
};

const deTranslations: TranslationSet = {
    step1Title: "Schritt 1: Daten zur Altanlage", basisTitle: "Berechnungsgrundlage",
    basisText: "Bitte wählen Sie, ob die Berechnung auf Basis Ihrer beheizbaren Fläche oder Ihres bisherigen Verbrauchs erfolgen soll.",
    basisArea: "Flächenbasierte Berechnung", basisConsumption: "Verbrauchsbasierte Berechnung",
    yourConsumptionTitle: "Ihr Verbrauch", annualConsumptionLabel: "Jährlicher Verbrauch",
    yourPropertyTitle: "Ihre Immobilie", buildingClassLabel: "Gebäudeklasse", areaLabel: "Beheizbare Fläche (m²)",
    currentSystemTitle: "Ihr aktuelles Heizsystem", efficiencyOldLabel: "Wirkungsgrad Altanlage (%)",
    efficiencyOldDisclaimer: "Typischer Wert wird je nach Heizsystem vorausgewählt.", priceOldLabel: "Aktueller Preis je Einheit",
    step2Title: "Schritt 2: Neues System & Optimierung", heatpumpDataTitle: "Daten für Wärmepumpe",
    gridPriceLabel: "Netz-Strompreis für Wärmepumpe (€/kWh)", gridPriceDisclaimer: "Dieser Preis gilt auch für \"Altanlage Strom\".",
    floorHeatingShareLabel: "Anteil Fußbodenheizung an Wärmeabgabe (%)", floorHeatingShareDisclaimer: "Wird automatisch basierend auf Gebäudeklasse angepasst.",
    flowTempLabel: "Vorlauftemperatur (°C)", baseScopInfo: "Abgeleiteter Basis-SCOP:",
    optimizationsTitle: "Zusätzliche Optimierungen", optimizationsText: "Wählen Sie optionale Komponenten aus, um die Berechnung zu verfeinern.",
    fanEffectText: "Durch die Lüfter sinkt die benötigte Vorlauftemperatur auf", fanEffectScopText: "Der SCOP verbessert sich dadurch auf",
    pvCapacityLabel: "Installierte PV-Leistung (kWp)", pvYieldInfo: "Geschätzter Jahresertrag",
    pvShareLabel: "Anteil des WP-Stroms durch PV gedeckt (%)", pvPriceLabel: "Kosten für PV-Strom (€/kWh)",
    pvDisclaimer: "Geben Sie hier Ihre Gestehungskosten an. Passen Sie den Deckungsgrad an, falls Sie z.B. einen Batteriespeicher haben.",
    solarTypeLabel: "Kollektortyp", solarAreaLabel: "Kollektorfläche der Solaranlage (m²)",
    solarYieldInfo: "Geschätzter Jahresertrag", solarDisclaimer: "Der Ertrag reduziert den Wärmebedarf, den die Heizung decken muss.",
    step3Title: "Schritt 3: Investition & Kosten", investmentTitle: "Investitionskosten & Förderung Wärmepumpe",
    investmentLabel: "Investitionskosten Wärmepumpe (inkl. Einbau) in €", investmentDisclaimer: "Durchschnitt: 15.000–30.000 €. Addieren Sie Kosten für Zusatz-Optimierungen.",
    fundingLabel: "Erwartete Förderungen (einmalig) in €", fundingDisclaimer: "Reduziert die effektiven Investitionskosten.",
    runningCostsTitle: "Laufende Kosten", maintenanceOldLabel: "Jährliche Wartungskosten Altanlage (€)",
    maintenanceNewLabel: "Jährliche Wartungskosten Wärmepumpe (€)", step4Title: "Schritt 4: Ihr Ergebnis",
    resultHeatDemand: "Nutzwärmebedarf (Altanlage)", resultCostsOld: "Aktuelle Heizkosten (Altanlage)",
    resultCo2Old: "CO₂-Emissionen (Altanlage)", resultHpPower: "Empfohlene Heizleistung Wärmepumpe",
    resultCop: "Angepasste JAZ/SCOP für WP", resultCostsNew: "Heizkosten mit Wärmepumpe",
    resultCostsNewBuild: "Voraussichtliche jährliche Betriebskosten",
    resultCo2New: "CO₂-Emissionen (Wärmepumpe)", resultSavingsAnnual: "Jährliche Ersparnis (Betriebskosten)",
    resultSavingsCo2: "Jährliche CO₂-Einsparung", resultSavingsCo2Eq: "entspricht ca. {value} Fußballfeldern Waldfläche pro Jahr.",
    resultAmortization: "Amortisationszeit (nach Förderung)", unitYear: "Jahr", unitYears: "Jahre",
    fanResultLabel: "Effekt durch Heizkörperlüfter",
    resultDisclaimer: "* Alle Werte sind ungefähre Richtwerte. Die empfohlene Heizleistung ist eine Schätzung basierend auf aktuellen Faustformeln zur Vermeidung von Takten; eine detaillierte Heizlastberechnung durch einen Fachbetrieb ist für die korrekte Dimensionierung unerlässlich.",
    exportPdfButton: "PDF Exportieren", priceUpdateInfo: "Die Standard-Energiepreise im Rechner sind Richtwerte (Stand: Juni 2025) und sollten für eine genaue Berechnung mit Ihren aktuellen Tarifen abgeglichen werden.",
    prevBtn: "Zurück", nextBtn: "Weiter", pdfExports: "PDF Exporte", configId: "Konfigurations-Nr.",
    amortizationNone: "Keine Amortisation", amortizationImmediate: "Sofort", amortizationNotApplicable: "Nicht anwendbar",
    commentaryTitle: "KI-basierte Interpretation der Ergebnisse",
    generatingCommentary: "Persönliche Analyse wird generiert...",
    commentaryError: "Fehler bei der Analyse. Bitte versuchen Sie es später erneut.",
    pdfTitle: "Analyse Ihrer Heizkostenersparnis", pdfInputsTitle: "Ihre Eingaben",
    pdfResultsTitle: "Ihr Ergebnis", pdfFooter: "Berechnung erstellt am {date}. Konfigurations-Nr.: {id}. Alle Angaben sind Schätzungen ohne Gewähr.",
    recommendedProductTitle: "Unsere Produktempfehlung für Sie",
    uspEhpa: "EHPA zertifiziert (in AT förderfähig)",
    uspEfficiency: "Hohe Effizienz",
    uspQuiet: "Extrem leiser Betrieb",
    uspEco: "Umweltfreundliches Kältemittel R290",
    productLinkButton: "Zum Produkt",
};

const enTranslations: TranslationSet = {
    step1Title: "Step 1: Old System Data", basisTitle: "Calculation Basis",
    basisText: "Please choose whether the calculation should be based on your heatable area or your previous consumption.",
    basisArea: "Area-Based Calculation", basisConsumption: "Consumption-Based Calculation",
    yourConsumptionTitle: "Your Consumption", annualConsumptionLabel: "Annual Consumption",
    yourPropertyTitle: "Your Property", buildingClassLabel: "Building Class", areaLabel: "Heatable Area (m²)",
    currentSystemTitle: "Your Current Heating System", efficiencyOldLabel: "Efficiency of Old System (%)",
    efficiencyOldDisclaimer: "A typical value is pre-selected based on the heating system.", priceOldLabel: "Current Price per Unit",
    step2Title: "Step 2: New System & Optimization", heatpumpDataTitle: "Heat Pump Data",
    gridPriceLabel: "Grid Electricity Price for Heat Pump (€/kWh)", gridPriceDisclaimer: "This price also applies to \"Old System Electricity\".",
    floorHeatingShareLabel: "Share of Underfloor Heating in Heat Distribution (%)", floorHeatingShareDisclaimer: "Adjusted automatically based on building class.",
    flowTempLabel: "Flow Temperature (°C)", baseScopInfo: "Derived Base SCOP:",
    optimizationsTitle: "Additional Optimizations", optimizationsText: "Select optional components to refine the calculation.",
    fanEffectText: "With fans, the required flow temperature drops to", fanEffectScopText: "The SCOP thereby improves to",
    pvCapacityLabel: "Installed PV Capacity (kWp)", pvYieldInfo: "Estimated Annual Yield",
    pvShareLabel: "Share of HP electricity covered by PV (%)", pvPriceLabel: "Cost for PV Electricity (€/kWh)",
    pvDisclaimer: "Enter your generation costs here. Adjust the coverage rate if you have a battery storage, for example.",
    solarTypeLabel: "Collector Type", solarAreaLabel: "Collector Area of Solar System (m²)",
    solarYieldInfo: "Estimated Annual Yield", solarDisclaimer: "The yield reduces the heat demand the heating system must cover.",
    step3Title: "Step 3: Investment & Costs", investmentTitle: "Investment Costs & Funding for Heat Pump",
    investmentLabel: "Investment Costs for Heat Pump (incl. installation) in €", investmentDisclaimer: "Average: €15,000–€30,000. Add costs for additional optimizations.",
    fundingLabel: "Expected Subsidies (one-time) in €", fundingDisclaimer: "Reduces the effective investment costs.",
    runningCostsTitle: "Running Costs", maintenanceOldLabel: "Annual Maintenance Costs Old System (€)",
    maintenanceNewLabel: "Annual Maintenance Costs Heat Pump (€)", step4Title: "Step 4: Your Result",
    resultHeatDemand: "Usable Heat Demand (Old System)", resultCostsOld: "Current Heating Costs (Old System)",
    resultCo2Old: "CO₂ Emissions (Old System)", resultHpPower: "Recommended Heat Pump Power",
    resultCop: "Adjusted SPF/SCOP for HP", resultCostsNew: "Heating Costs with Heat Pump",
    resultCostsNewBuild: "Projected Annual Operating Costs",
    resultCo2New: "CO₂ Emissions (Heat Pump)", resultSavingsAnnual: "Annual Savings (Operating Costs)",
    resultSavingsCo2: "Annual CO₂ Savings", resultSavingsCo2Eq: "equals approx. {value} football fields of forest area per year.",
    resultAmortization: "Amortization Period (after funding)", unitYear: "year", unitYears: "years",
    fanResultLabel: "Effect of radiator fans",
    resultDisclaimer: "* All values are approximate guidelines. The recommended heating output is an estimate based on current rules of thumb to avoid cycling; a detailed heat load calculation by a specialist is essential for correct sizing.",
    exportPdfButton: "Export PDF", priceUpdateInfo: "The default energy prices in the calculator are estimates (as of June 2025) and should be checked against your current rates for an accurate calculation.",
    prevBtn: "Back", nextBtn: "Next", pdfExports: "PDF Exports", configId: "Configuration No.",
    amortizationNone: "No amortization", amortizationImmediate: "Immediately", amortizationNotApplicable: "Not applicable",
    commentaryTitle: "AI-Powered Interpretation of Results",
    generatingCommentary: "Generating personalized analysis...",
    commentaryError: "Error during analysis. Please try again later.",
    pdfTitle: "Analysis of Your Heating Cost Savings", pdfInputsTitle: "Your Inputs",
    pdfResultsTitle: "Your Result", pdfFooter: "Calculation created on {date}. Configuration No.: {id}. All figures are estimates without guarantee.",
    recommendedProductTitle: "Our Product Recommendation for You",
    uspEhpa: "EHPA certified (eligible for funding in AT)",
    uspEfficiency: "High efficiency",
    uspQuiet: "Extremely quiet operation",
    uspEco: "Eco-friendly R290 refrigerant",
    productLinkButton: "View Product",
};

const roTranslations: TranslationSet = {
    step1Title: "Pasul 1: Datele sistemului vechi", basisTitle: "Baza de calcul",
    basisText: "Vă rugăm să alegeți dacă calculul se va baza pe suprafața încălzită sau pe consumul anterior.",
    basisArea: "Calcul bazat pe suprafață", basisConsumption: "Calcul bazat pe consum",
    yourConsumptionTitle: "Consumul dvs.", annualConsumptionLabel: "Consum anual",
    yourPropertyTitle: "Imobilul dvs.", buildingClassLabel: "Clasa clădirii", areaLabel: "Suprafață încălzită (m²)",
    currentSystemTitle: "Sistemul dvs. actual de încălzire", efficiencyOldLabel: "Eficiența sistemului vechi (%)",
    efficiencyOldDisclaimer: "O valoare tipică este preselectată în funcție de sistemul de încălzire.", priceOldLabel: "Prețul actual pe unitate",
    step2Title: "Pasul 2: Sistem nou & Optimizare", heatpumpDataTitle: "Date pentru pompa de căldură",
    gridPriceLabel: "Prețul electricității din rețea pentru pompa de căldură (€/kWh)", gridPriceDisclaimer: "Acest preț se aplică și pentru \"Electricitate sistem vechi\".",
    floorHeatingShareLabel: "Procentul de încălzire prin pardoseală în distribuția căldurii (%)", floorHeatingShareDisclaimer: "Ajustat automat în funcție de clasa clădirii.",
    flowTempLabel: "Temperatura pe tur (°C)", baseScopInfo: "SCOP de bază derivat:",
    optimizationsTitle: "Optimizări suplimentare", optimizationsText: "Selectați componente opționale pentru a rafina calculul.",
    fanEffectText: "Cu ventilatoarele, temperatura necesară pe tur scade la", fanEffectScopText: "Astfel, SCOP-ul se îmbunătățește la",
    pvCapacityLabel: "Capacitate PV instalată (kWp)", pvYieldInfo: "Producție anuală estimată",
    pvShareLabel: "Procentul de electricitate pentru PC acoperit de PV (%)", pvPriceLabel: "Costul electricității PV (€/kWh)",
    pvDisclaimer: "Introduceți aici costurile de producție. Ajustați rata de acoperire dacă aveți, de exemplu, un acumulator.",
    solarTypeLabel: "Tip colector", solarAreaLabel: "Suprafața colectorului solar (m²)",
    solarYieldInfo: "Producție anuală estimată", solarDisclaimer: "Producția reduce necesarul de căldură pe care trebuie să-l acopere sistemul de încălzire.",
    step3Title: "Pasul 3: Investiție & Costuri", investmentTitle: "Costuri de investiție & Finanțare pentru pompa de căldură",
    investmentLabel: "Costuri de investiție pentru pompa de căldură (inclusiv instalare) în €", investmentDisclaimer: "Medie: 15.000–30.000 €. Adăugați costurile pentru optimizări suplimentare.",
    fundingLabel: "Subvenții preconizate (unice) în €", fundingDisclaimer: "Reduce costurile efective de investiție.",
    runningCostsTitle: "Costuri de funcționare", maintenanceOldLabel: "Costuri anuale de întreținere sistem vechi (€)",
    maintenanceNewLabel: "Costuri anuale de întreținere pompa de căldură (€)", step4Title: "Pasul 4: Rezultatul dvs.",
    resultHeatDemand: "Necesar de căldură utilă (Sistem vechi)", resultCostsOld: "Costuri actuale de încălzire (Sistem vechi)",
    resultCo2Old: "Emisii de CO₂ (Sistem vechi)", resultHpPower: "Puterea recomandată a pompei de căldură",
    resultCop: "SPF/SCOP ajustat pentru PC", resultCostsNew: "Costuri de încălzire cu pompa de căldură",
    resultCostsNewBuild: "Costuri anuale de operare estimate",
    resultCo2New: "Emisii de CO₂ (Pompa de căldură)", resultSavingsAnnual: "Economii anuale (Costuri de operare)",
    resultSavingsCo2: "Economii anuale de CO₂", resultSavingsCo2Eq: "echivalează cu aprox. {value} terenuri de fotbal de pădure pe an.",
    resultAmortization: "Perioada de amortizare (după subvenție)", unitYear: "an", unitYears: "ani",
    fanResultLabel: "Efectul ventilatoarelor de calorifer",
    resultDisclaimer: "* Toate valorile sunt orientative. Puterea de încălzire recomandată este o estimare brută bazată pe reguli generale actuale pentru a evita ciclarea; un calcul detaliat al sarcinii termice de către un specialist este esențial pentru o dimensionare corectă.",
    exportPdfButton: "Exportă PDF", priceUpdateInfo: "Prețurile implicite ale energiei din calculator sunt estimative (iunie 2025) și ar trebui verificate cu tarifele dvs. curente pentru un calcul precis.",
    prevBtn: "Înapoi", nextBtn: "Următorul", pdfExports: "Exporturi PDF", configId: "Nr. configurație",
    amortizationNone: "Fără amortizare", amortizationImmediate: "Imediat", amortizationNotApplicable: "Nu se aplică",
    commentaryTitle: "Interpretarea rezultatelor bazată pe IA",
    generatingCommentary: "Se generează analiza personalizată...",
    commentaryError: "Eroare la analiză. Vă rugăm să reîncercați mai târziu.",
    pdfTitle: "Analiza economiilor la costurile de încălzire", pdfInputsTitle: "Datele dvs.",
    pdfResultsTitle: "Rezultatul dvs.", pdfFooter: "Calcul realizat la {date}. Nr. Configurație: {id}. Toate datele sunt estimări fără garanție.",
    recommendedProductTitle: "Recomandarea noastră de produs pentru dvs.",
    uspEhpa: "Certificat EHPA (eligibil pentru finanțare în AT)",
    uspEfficiency: "Eficiență ridicată",
    uspQuiet: "Funcționare extrem de silențioasă",
    uspEco: "Agent frigorific ecologic R290",
    productLinkButton: "Vezi produsul",
};

export const translations: Translations = {
  de: deTranslations,
  en: enTranslations,
  ro: roTranslations,
};

// FIX: Changed type to Omit<IconDefinition, 'svg'> to match data shape. The SVG is added dynamically in the component.
export const gebaeudeklasseDefinitions: Record<'de' | 'en' | 'ro', Omit<IconDefinition, 'svg'>[]> = {
    de: [
        { value: "alt_unsaniert", text: "Altbau, unsaniert", kWhText: "(~200 kWh/m²·a)", wText: "(Heizlast: ~100 W/m²)" },
        { value: "alt_teilsaniert", text: "Altbau, teilsaniert", kWhText: "(~150 kWh/m²·a)", wText: "(Heizlast: ~70 W/m²)" },
        { value: "alt_saniert", text: "Altbau, saniert", kWhText: "(~100 kWh/m²·a)", wText: "(Heizlast: ~50 W/m²)" },
        { value: "neubau", text: "Neubau", kWhText: "(~70 kWh/m²·a)", wText: "(Heizlast: ~40 W/m²)" },
        { value: "niedrigenergie", text: "Niedrigenergiehaus", kWhText: "(~30 kWh/m²·a)", wText: "(Heizlast: ~25 W/m²)" }
    ],
    en: [
        { value: "alt_unsaniert", text: "Old, unrenovated", kWhText: "(~200 kWh/m²·a)", wText: "(Heat Load: ~100 W/m²)" },
        { value: "alt_teilsaniert", text: "Old, partially renovated", kWhText: "(~150 kWh/m²·a)", wText: "(Heat Load: ~70 W/m²)" },
        { value: "alt_saniert", text: "Old, renovated", kWhText: "(~100 kWh/m²·a)", wText: "(Heat Load: ~50 W/m²)" },
        { value: "neubau", text: "New building", kWhText: "(~70 kWh/m²·a)", wText: "(Heat Load: ~40 W/m²)" },
        { value: "niedrigenergie", text: "Low-energy house", kWhText: "(~30 kWh/m²·a)", wText: "(Heat Load: ~25 W/m²)" }
    ],
    ro: [
        { value: "alt_unsaniert", text: "Clădire veche, nerenovată", kWhText: "(~200 kWh/m²·an)", wText: "(Sarcină termică: ~100 W/m²)" },
        { value: "alt_teilsaniert", text: "Clădire veche, parțial renovată", kWhText: "(~150 kWh/m²·an)", wText: "(Sarcină termică: ~70 W/m²)" },
        { value: "alt_saniert", text: "Clădire veche, renovată", kWhText: "(~100 kWh/m²·an)", wText: "(Sarcină termică: ~50 W/m²)" },
        { value: "neubau", text: "Clădire nouă", kWhText: "(~70 kWh/m²·an)", wText: "(Sarcină termică: ~40 W/m²)" },
        { value: "niedrigenergie", text: "Casă cu consum redus de energie", kWhText: "(~30 kWh/m²·an)", wText: "(Sarcină termică: ~25 W/m²)" }
    ],
};
export const getGebaeudeklasseSvg = (value: Gebaeudeklasse): string => {
    const svgs: Record<Gebaeudeklasse, string> = {
        alt_unsaniert: `<svg viewBox="0 0 64 64"><path d="M32 4L4 22v30h12V32h8v20h24V22L32 4zm-4 36h-8v-8h8v8zm16 0h-8v-8h8v8z" stroke="#555" stroke-width="1.5" opacity="0.7" fill="#d3a17d"/><path d="M10 20 L10 15 L15 15 M54 20 L54 15 L49 15 M20 10 L15 15 M44 10 L49 15" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.6"/><rect x="26" y="42" width="12" height="10" fill="#a0522d" opacity="0.8"/></svg>`,
        alt_teilsaniert: `<svg viewBox="0 0 64 64"><path d="M32 4L4 22v30h56V22L32 4zM16 50H8V30h8v20zm32 0h-8V30h8v20zM28 34h8v16h-8V34z" stroke="#555" stroke-width="1.5" fill="#e0c9a6"/><rect x="20" y="24" width="24" height="8" fill="#66bb6a" opacity="0.8"/><path d="M32 6 L10 20 M32 6 L54 20" stroke="#a0522d" stroke-width="2.5" fill="none"/></svg>`,
        alt_saniert: `<svg viewBox="0 0 64 64"><path d="M32 2L2 20v34h60V20L32 2zm0 4.5L54.8 20H9.2L32 6.5zM58 50H6V22h52v28z" fill="#f5f5f5" stroke="#555" stroke-width="1.5"/><rect x="16" y="28" width="8" height="12" fill="#b3e5fc" stroke="#333" stroke-width="1.2"/><rect x="40" y="28" width="8" height="12" fill="#b3e5fc" stroke="#333" stroke-width="1.2"/><rect x="28" y="40" width="8" height="10" fill="#ffcc80" stroke="#333" stroke-width="1.2"/></svg>`,
        neubau: `<svg viewBox="0 0 64 64"><rect x="6" y="18" width="52" height="36" fill="#e3f2fd" stroke="#555" stroke-width="1.5"/><polygon points="4,18 32,6 60,18" fill="#cfd8dc" stroke="#555" stroke-width="1.5"/><rect x="16" y="30" width="10" height="18" fill="#ffffff" stroke="#444" stroke-width="1.2"/><rect x="38" y="30" width="10" height="10" fill="#ffffff" stroke="#444" stroke-width="1.2"/><line x1="6" y1="28" x2="58" y2="28" stroke="#90a4ae" stroke-width="2.5"/></svg>`,
        niedrigenergie: `<svg viewBox="0 0 64 64"><path d="M32 4L4 20v30h56V20L32 4z" fill="#dcedc8" stroke="#4caf50" stroke-width="1.5"/><rect x="24" y="32" width="16" height="16" fill="#c8e6c9" stroke="#4caf50" stroke-width="1.2"/><path d="M32 12 A12 12 0 0 1 44 24 A12 12 0 0 1 32 36 A12 12 0 0 1 20 24 A12 12 0 0 1 32 12 M32 16 A4 4 0 0 0 28 20 L36 28 A4 4 0 0 0 32 16" fill="#ffee58" opacity="0.9"/><path d="M28 40 L36 40 L32 48 Z" fill="#66bb6a"/></svg>`
    };
    return svgs[value];
}

// FIX: Changed type to Omit<IconDefinition, 'svg' | 'kWhText' | 'wText'> to match data shape. The SVG is added dynamically in the component.
export const heizsystemDefinitions: Record<'de' | 'en' | 'ro', Omit<IconDefinition, 'svg' | 'kWhText' | 'wText'>[]> = {
    de: [
        { value: "heizoel", text: "Heizöl (EL)" }, { value: "erdgas_h", text: "Erdgas (H-Gas)" },
        { value: "erdgas_l", text: "Erdgas (L-Gas)" }, { value: "fluessiggas", text: "Flüssiggas" },
        { value: "pellets", text: "Holzpellets" }, { value: "strom", text: "Strom" },
        { value: "keine", text: "Keine (Neubau)" }
    ],
    en: [
        { value: "heizoel", text: "Heating Oil" }, { value: "erdgas_h", text: "Natural Gas (H)" },
        { value: "erdgas_l", text: "Natural Gas (L)" }, { value: "fluessiggas", text: "LPG" },
        { value: "pellets", text: "Wood Pellets" }, { value: "strom", text: "Electricity" },
        { value: "keine", text: "None (New Build)" }
    ],
    ro: [
        { value: "heizoel", text: "Motorină (EL)" }, { value: "erdgas_h", text: "Gaz natural (H)" },
        { value: "erdgas_l", text: "Gaz natural (L)" }, { value: "fluessiggas", text: "GPL" },
        { value: "pellets", text: "Peleti din lemn" }, { value: "strom", text: "Electricitate" },
        { value: "keine", text: "Niciunul (Construcție nouă)" }
    ]
};
export const getHeizsystemSvg = (value: Heizsystem): string => {
    const svgs: Record<Heizsystem, string> = {
        heizoel: `<svg viewBox="0 0 64 64"><path d="M32 6C20.9 6 12 14.9 12 26c0 7.8 4.9 14.5 11.9 17.3l-.6 9.3h17.4l-.6-9.3C47.1 40.5 52 33.8 52 26c0-11.1-8.9-20-20-20zm0 32c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" fill="#795548"/><circle cx="32" cy="26" r="8" fill="#a1887f"/></svg>`,
        erdgas_h: `<svg viewBox="0 0 64 64"><path d="M32 2C19.7 2 9.8 10.1 7 21.3c4.6-3.2 10.1-5.3 16-5.3 11.8 0 21.4 8.6 23.7 19.9C51.2 42.8 56 37.2 56 30.6c0-10.3-8.9-18.7-20-19.9V2c-1.3 0-2.6.1-4 .3zm11.1 34.8C40.6 46.2 32.9 52 24 52c-4.4 0-8.5-1.3-12-3.5 3.2 6.7 10 11.5 17.9 11.5 10.5 0 19.1-7.7 20.1-17.9z" fill="#ff9800"/><path d="M27.4 30.1c-2.4-1.2-5.2-1.8-8-1.8-6.5 0-12.3 2.7-16.4 7C7.1 21.9 18.4 12 32 12c.7 0 1.3.1 2 .1-3.6 5.5-5.5 12.1-4.6 18z" fill="#f57c00"/></svg>`,
        erdgas_l: `<svg viewBox="0 0 64 64"><path d="M32 2C19.7 2 9.8 10.1 7 21.3c4.6-3.2 10.1-5.3 16-5.3 11.8 0 21.4 8.6 23.7 19.9C51.2 42.8 56 37.2 56 30.6c0-10.3-8.9-18.7-20-19.9V2c-1.3 0-2.6.1-4 .3zm11.1 34.8C40.6 46.2 32.9 52 24 52c-4.4 0-8.5-1.3-12-3.5 3.2 6.7 10 11.5 17.9 11.5 10.5 0 19.1-7.7 20.1-17.9z" fill="#ffb74d"/><path d="M27.4 30.1c-2.4-1.2-5.2-1.8-8-1.8-6.5 0-12.3 2.7-16.4 7C7.1 21.9 18.4 12 32 12c.7 0 1.3.1 2 .1-3.6 5.5-5.5 12.1-4.6 18z" fill="#ffa726"/></svg>`,
        fluessiggas: `<svg viewBox="0 0 64 64"><rect x="18" y="10" width="28" height="44" rx="8" fill="#bdbdbd" stroke="#757575" stroke-width="1.5"/><rect x="22" y="12" width="20" height="8" fill="#9e9e9e"/><line x1="32" y1="20" x2="32" y2="28" stroke="#757575" stroke-width="2.5"/><path d="M26 32h12l-2 6h-8z" fill="#f44336" /></svg>`,
        pellets: `<svg viewBox="0 0 64 64"><path d="M12 52h40v4H12zM16 48l4-10h24l4 10zM20 34l4-10h16l4 10zM24 20l4-10h8l4 10z" fill="#c8b7a1" stroke="#8d6e63" stroke-width="1"/><circle cx="22" cy="42" r="3" fill="#a1887f"/><circle cx="32" cy="46" r="3" fill="#a1887f"/><circle cx="42" cy="42" r="3" fill="#a1887f"/><circle cx="28" cy="30" r="3" fill="#a1887f"/><circle cx="36" cy="30" r="3" fill="#a1887f"/><circle cx="32" cy="18" r="3" fill="#a1887f"/></svg>`,
        strom: `<svg viewBox="0 0 64 64"><path d="M32 2L12 32h12l-4 20 24-30H32l4-20z" fill="#ffea00" stroke="#fbc02d" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
        keine: `<svg viewBox="0 0 64 64"><path d="M32 6 L50 18 L50 46 L32 58 L14 46 L14 18 Z" fill="#fff" stroke-width="2" stroke="#555"/><path d="M30 22h4v20h-4z M22 30h20v4h-20z" fill="#4DBCE9"/></svg>`
    };
    return svgs[value];
};

// FIX: Changed type to Omit<OptimizationDefinition, 'svg'> to match data shape. The SVG is added dynamically in the component.
export const optimizationDefinitions: Record<'de' | 'en' | 'ro', Omit<OptimizationDefinition, 'svg'>[]> = {
    de: [
        { id: 'pv', text: 'Photovoltaik' }, { id: 'solarthermie', text: 'Solarthermie' },
        { id: 'fans', text: 'Heizkörperlüfter' }
    ],
    en: [
        { id: 'pv', text: 'Photovoltaics' }, { id: 'solarthermie', text: 'Solar Thermal' },
        { id: 'fans', text: 'Radiator Fans' }
    ],
    ro: [
        { id: 'pv', text: 'Fotovoltaice' }, { id: 'solarthermie', text: 'Panouri Solare Termice' },
        { id: 'fans', text: 'Ventilatoare de calorifer' }
    ]
};
export const getOptimizationSvg = (id: Optimization): string => {
    const svgs: Record<Optimization, string> = {
        pv: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="10" fill="#FFEB3B"/><path fill="none" stroke="#FFC107" stroke-width="3" stroke-linecap="round" d="M32 5v6M32 53v6M59 32h-6M11 32H5m40-22l-4 4M13 47l-4 4m0-34l4 4m32 26l4 4"/><path d="M25 44l6 14 6-14h-5l3-8h-7l3 8z" fill="#444"/></svg>`,
        solarthermie: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="10" fill="#FFEB3B"/><path fill="none" stroke="#FFC107" stroke-width="3" stroke-linecap="round" d="M32 5v6M32 53v6M59 32h-6M11 32H5m40-22l-4 4M13 47l-4 4m0-34l4 4m32 26l4 4"/><path d="M22 54s-2-8 10-8 10 8 10 8z" fill="#4FC3F7" opacity="0.8"/><path d="M26 48s-2-8 6-8 6 8 6 8z" fill="#29B6F6" opacity="0.8"/></svg>`,
        fans: `<svg viewBox="0 0 64 64"><rect x="10" y="16" width="44" height="28" rx="2" fill="#CFD8DC"/><path d="M12 18h4v24h-4z m6 0h4v24h-4z m6 0h4v24h-4z m6 0h4v24h-4z m6 0h4v24h-4z m6 0h4v24h-4z" fill="#ECEFF1"/><circle cx="32" cy="46" r="6" fill="#90A4AE"/><path d="M32 40v12m-6-6h12m-8.5-2.5l5 5m-5-5l-5 5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`
    };
    return svgs[id];
};

// FIX: Changed type to Omit<IconDefinition, 'svg' | 'kWhText' | 'wText'> to match data shape. The SVG is added dynamically in the component.
export const solarthermieTypeDefinitions: Record<'de' | 'en' | 'ro', Omit<IconDefinition, 'svg' | 'kWhText' | 'wText'>[]> = {
    de: [{ value: "flach", text: "Flachkollektor" }, { value: "roehren", text: "Röhrenkollektor" }],
    en: [{ value: "flach", text: "Flat-Plate Collector" }, { value: "roehren", text: "Evacuated Tube Collector" }],
    ro: [{ value: "flach", text: "Colector plat" }, { value: "roehren", text: "Colector cu tuburi vidate" }]
};
export const getSolarthermieTypeSvg = (value: SolarthermieType): string => {
    const svgs: Record<SolarthermieType, string> = {
        flach: `<svg viewBox="0 0 64 64"><rect x="10" y="12" width="44" height="40" fill="#37474F"/><rect x="13" y="15" width="38" height="34" fill="#546E7A"/><path d="M17,20 l30,0 M17,26 l30,0 M17,32 l30,0 M17,38 l30,0 M17,44 l30,0" stroke="#78909C" stroke-width="1.5"/></svg>`,
        roehren: `<svg viewBox="0 0 64 64"><rect x="10" y="12" width="44" height="40" fill="#37474F"/><g stroke="#B0BEC5" stroke-width="2.5" fill="#78909C"><rect x="15" y="16" width="6" height="32" rx="3"/><rect x="25" y="16" width="6" height="32" rx="3"/><rect x="35" y="16" width="6" height="32" rx="3"/><rect x="45" y="16" width="6" height="32" rx="3"/></g></svg>`
    };
    return svgs[value];
};

export const heatPumpProducts: HeatPumpProduct[] = [
    // R290 (prioritized)
    {
        id: 'chofu-4kw-r290',
        name: 'CHOFU 4kW R290 Wärmepumpen Komplettpaket',
        power: 4,
        refrigerant: 'R290',
        imageUrl: 'https://www.westech.shop/media/image/a4/09/b3/heizkraft_compact2_300l_R290_freisteller_links_vorne_600x600.png',
        productUrl: 'https://www.westech.shop/chofu-4kw-r290-waermepumpen-komplettpaket-heizkraft-compact2-wp1-300l',
        usps: ['uspEfficiency', 'uspEco', 'uspEhpa']
    },
    {
        id: 'chofu-6kw-r290',
        name: 'CHOFU AEYC-0649ZU-CH1 6kW R290 Luft-Wasser Wärmepumpe',
        power: 6,
        refrigerant: 'R290',
        imageUrl: 'https://www.westech.shop/media/image/a0/a2/29/AEYC-0649_links_vorne_freisteller.png',
        productUrl: 'https://www.westech.shop/chofu-aeyc-0649zu-ch1-6kw-r290-luft-wasser-waermepumpe',
        usps: ['uspEfficiency', 'uspQuiet', 'uspEco', 'uspEhpa']
    },
    {
        id: 'chofu-10kw-r290',
        name: 'CHOFU AEYC-1049ZU-CH1 10kW R290 Luft-Wasser Wärmepumpe',
        power: 10,
        refrigerant: 'R290',
        imageUrl: 'https://www.westech.shop/media/image/f1/e5/22/AEYC-1049_links_vorne_freisteller.png',
        productUrl: 'https://www.westech.shop/chofu-aeyc-1049zu-ch1-10kw-r290-luft-wasser-waermepumpe',
        usps: ['uspEfficiency', 'uspQuiet', 'uspEco', 'uspEhpa']
    },
    // R32 (secondary)
    {
        id: 'chofu-6kw-r32',
        name: 'CHOFU 6kW Inverter Wärmepumpe R32',
        power: 6,
        refrigerant: 'R32',
        imageUrl: 'https://www.westech.shop/media/image/1f/92/7f/wh_6kw_freisteller_links_vorne.png',
        productUrl: 'https://www.westech.shop/6kw-chofu-inverter-waermepumpe',
        usps: ['uspEfficiency', 'uspEhpa']
    },
    {
        id: 'chofu-10kw-r32',
        name: 'CHOFU 10kW Inverter Wärmepumpe R32',
        power: 10,
        refrigerant: 'R32',
        imageUrl: 'https://www.westech.shop/media/image/51/9a/54/wh_10kw_freisteller_links_vorne.png',
        productUrl: 'https://www.westech.shop/10kw-chofu-inverter-waermepumpe',
        usps: ['uspEfficiency', 'uspEhpa']
    },
    {
        id: 'chofu-12kw-r32',
        name: 'CHOFU 12kW Inverter Wärmepumpe R32',
        power: 12,
        refrigerant: 'R32',
        imageUrl: 'https://www.westech.shop/media/image/22/e1/98/wh_12kw_freisteller_links_vorne.png',
        productUrl: 'https://www.westech.shop/12kw-chofu-inverter-waermepumpe',
        usps: ['uspEfficiency', 'uspEhpa']
    },
    {
        id: 'chofu-16kw-r32',
        name: 'CHOFU 16kW Inverter Wärmepumpe R32 380V',
        power: 16,
        refrigerant: 'R32',
        imageUrl: 'https://www.westech.shop/media/image/b8/b8/1d/wh_16kw_freisteller_links_vorne.png',
        productUrl: 'https://www.westech.shop/16kw-chofu-inverter-waermepumpe-380v',
        usps: ['uspEfficiency', 'uspEhpa']
    }
];