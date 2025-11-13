import { GoogleGenAI } from "@google/genai";
import type { FormData, Language, Results } from '../types';
import { heatPumpProducts } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

const generatePrompt = (formData: FormData, results: Results, language: Language): string => {
  const langMap: Record<Language, string> = {
    de: "Deutsch",
    en: "Englisch",
    ro: "Rumänisch"
  };

  const inputSummary = JSON.stringify({
    calculationMethod: formData.method,
    area: formData.flaeche,
    buildingClass: formData.gebaeudeklasse,
    oldSystem: formData.heizsystem,
    optimizations: formData.optimizations,
    investment: formData.investition
  }, null, 2);

  const resultsSummary = JSON.stringify({
    recommendedHeatPumpPowerKW: results.wpLeistung.toFixed(1),
    annualSavingsEuro: results.ersparnis.toFixed(0),
    annualCO2SavingsKg: results.co2Ersparnis.toFixed(0),
    amortizationYears: typeof results.amortisation === 'number' ? results.amortisation.toFixed(1) : results.amortisation
  }, null, 2);

  const productList = heatPumpProducts.map(p =>
    `- **${p.power}kW (${p.refrigerant}):** ${p.name} (${p.productUrl})`
  ).join('\n');


  return `
    Du bist ein Experte für Heizungssanierung und Energieberatung für den Onlineshop "Westech Solar". Deine Aufgabe ist es, eine kurze, prägnante und hilfreiche Interpretation der Ergebnisse eines Heizkostenrechners zu liefern und dabei ein passendes Produkt aus unserem Sortiment zu empfehlen.
    Antworte in der Zielsprache: ${langMap[language]}.
    Der Ton sollte ermutigend, professionell und leicht verständlich sein. Strukturiere die Antwort in 3-4 Absätzen im Markdown-Format.

    **Kontext:**
    Ein Benutzer hat seine Daten in einen Rechner eingegeben, um die Vorteile eines Wechsels von einem alten Heizsystem zu einer Wärmepumpe zu bewerten.

    **Eingabedaten des Benutzers (Zusammenfassung):**
    ${inputSummary}

    **Berechnungsergebnisse:**
    ${resultsSummary}

    **Verfügbare Wärmepumpenmodelle (zur Empfehlung):**
    ${productList}
    
    **Deine Aufgabe:**
    Basierend auf den Eingaben und Ergebnissen, generiere eine kurze Interpretation. Gehe auf folgende Punkte ein:
    1.  **Produktempfehlung (WICHTIGSTER PUNKT):** Beginne mit einer direkten Produktempfehlung. Basierend auf der \`recommendedHeatPumpPowerKW\`, schlage eines der oben aufgeführten Modelle vor, das am besten passt. **Priorisiere R290-Modelle, wenn sie passend sind.** Begründe kurz, warum (z.B. 'Für Ihre berechnete Heizlast von 5.5 kW ist unsere 6-kW-Wärmepumpe die ideale Wahl. Sie deckt Ihren Bedarf sicher ab, ohne überdimensioniert zu sein, was einen effizienten Betrieb gewährleistet.'). Füge den Link zum Produkt hinzu. Wenn die benötigte Leistung sehr hoch ist und nur ein R32-Modell passt, stelle dessen Vorteile heraus.
    2.  **Finanzielle Bewertung:** Kommentiere die jährliche Ersparnis und die Amortisationszeit. Ist es eine gute Investition?
    3.  **Technische Bewertung:** Ergänze die Produktempfehlung mit einem kurzen Hinweis, warum die richtige Dimensionierung wichtig ist (Vermeidung von Takten, Effizienz).
    4.  **Ökologische Bewertung:** Hebe die CO2-Einsparung hervor.
    5.  **Gesamtfazit:** Gib eine abschließende Empfehlung oder einen positiven Ausblick.

    **Wichtige Regeln:**
    -   Verwende Markdown für die Formatierung (z.B. **fett** für wichtige Begriffe, Absätze, Links).
    -   Fasse dich kurz (maximal 180 Wörter).
    -   Sei nicht zu technisch.
    -   Wenn die Ersparnis negativ ist, sei trotzdem positiv und weise auf andere Vorteile hin (Wertsteigerung, Unabhängigkeit).
    -   Wenn die Amortisationszeit sehr lang ist, erkläre, warum es trotzdem eine sinnvolle Zukunftsinvestition ist.
    -   Wenn das alte System 'keine' war (Neubau), interpretiere die Ergebnisse als Prognose für ein zukunftssicheres System und empfiehl eine passende Pumpe.
    -   Beginne direkt mit der Interpretation und der Produktempfehlung, ohne Einleitungssätze wie "Hier ist die Interpretation".
  `;
};

export const generateInterpretation = async (formData: FormData, results: Results, language: Language): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = generatePrompt(formData, results, language);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if(error.message.includes("API_KEY")) return "API Key not configured. Please contact the administrator.";
        return `An error occurred while generating the analysis: ${error.message}`;
    }
    return "An unknown error occurred while generating the analysis.";
  }
};