
import { useCallback } from 'react';
import type { FormData, Results } from '../types';
import { config } from '../constants';

export const useCalculator = () => {
  const calculate = useCallback((formData: FormData): Results => {
    const {
      method, verbrauch, flaeche, gebaeudeklasse, heizsystem, wirkungsgradAlt,
      preis, strompreis, anteilFussbodenheizung, vorlauftemperatur, optimizations,
      pvLeistung, pvAnteil, pvStrompreis, solarthermieFlaeche, solarthermieTyp,
      investition, foerderungen, wartungskostenAlt, wartungskostenWP,
    } = formData;

    const useFans = optimizations.includes('fans');
    const usePV = optimizations.includes('pv');
    const useSolarthermie = optimizations.includes('solarthermie');

    // 1. Calculate heat demand (Nutzwärmebedarf) from old system
    let energieInputAltanlage_kWh = 0;
    if (heizsystem === 'keine') {
      energieInputAltanlage_kWh = flaeche * config.klasseFactors[gebaeudeklasse];
    } else {
      if (method === 'verbrauch') {
        energieInputAltanlage_kWh = verbrauch * config.energyFactors[heizsystem];
      } else {
        energieInputAltanlage_kWh = flaeche * config.klasseFactors[gebaeudeklasse];
      }
    }
    
    const wirkungsgrad = heizsystem === 'strom' ? 1.0 : wirkungsgradAlt / 100;
    const nutzwaermeBedarf = energieInputAltanlage_kWh * wirkungsgrad;

    // 2. Calculate costs & CO2 of old system
    let kostenAktuell = 0;
    if (heizsystem !== 'keine') {
        let brennstoffkosten = 0;
        if (method === 'verbrauch') {
            brennstoffkosten = verbrauch * preis;
        } else {
            const verbrauchÄquivalent = energieInputAltanlage_kWh / config.energyFactors[heizsystem];
            brennstoffkosten = verbrauchÄquivalent * preis;
        }
        kostenAktuell = brennstoffkosten + wartungskostenAlt;
    }
    const co2Altanlage = energieInputAltanlage_kWh * config.co2FactorsKwhInput[heizsystem];

    // 3. Calculate heat pump power (wpLeistung)
    let wpLeistung = 0;
    if(method === 'flaeche' || heizsystem === 'keine') {
        // Area-based calculation
        wpLeistung = (flaeche * config.specificHeatLoad[gebaeudeklasse]) / 1000;
    } else {
        // Consumption-based calculation
        wpLeistung = nutzwaermeBedarf / config.fullLoadHours[gebaeudeklasse];
    }
     // Add a small buffer for safety, but avoid major oversizing.
    wpLeistung *= 1.1;


    // 4. Calculate effective SCOP (JAZ)
    let effektiveVorlaufTemp = vorlauftemperatur;
    let fanEffect = null;
    if (useFans) {
      effektiveVorlaufTemp -= config.heizkoerperventilatorEffekt;
      fanEffect = config.heizkoerperventilatorEffekt;
    }
    // Linear interpolation for SCOP based on flow temp (35°C -> 4.8, 55°C -> 3.2)
    const jazEffektiv = 4.8 + ((effektiveVorlaufTemp - 35) / (55 - 35)) * (3.2 - 4.8);

    // 5. Calculate heat demand for heat pump (after solar thermal)
    let wpBedarf_kWh = nutzwaermeBedarf;
    if (useSolarthermie) {
      const solarErtrag = solarthermieFlaeche * config.solarYieldFactors[solarthermieTyp];
      wpBedarf_kWh = Math.max(0, nutzwaermeBedarf - solarErtrag);
    }
    
    // 6. Calculate costs & CO2 of new system
    const stromverbrauchWP_kWh = wpBedarf_kWh / jazEffektiv;
    let kostenWPVal = 0;
    if (usePV) {
      const pvStrom_kWh = stromverbrauchWP_kWh * (pvAnteil / 100);
      const netzStrom_kWh = stromverbrauchWP_kWh - pvStrom_kWh;
      kostenWPVal = (netzStrom_kWh * strompreis) + (pvStrom_kWh * pvStrompreis);
    } else {
      kostenWPVal = stromverbrauchWP_kWh * strompreis;
    }
    const kostenWP = kostenWPVal + wartungskostenWP;
    const co2WP = stromverbrauchWP_kWh * config.stromCo2Faktor;

    // 7. Final comparison
    const ersparnis = kostenAktuell - kostenWP;
    const co2Ersparnis = co2Altanlage - co2WP;
    const co2Fussballfelder = co2Ersparnis > 0 ? (co2Ersparnis / config.kgCo2ProFussballfeldWaldProJahr) : 0;
    
    const effektiveInvestition = Math.max(0, investition - foerderungen);
    let amortisation: number | string = "N/A";
    if (heizsystem !== 'keine') {
        if (ersparnis > 0 && effektiveInvestition > 0) {
            amortisation = effektiveInvestition / ersparnis;
        } else if (effektiveInvestition <= 0 && ersparnis > 0) {
            amortisation = "immediate";
        } else {
            amortisation = "none";
        }
    }

    return {
      nutzwaermeBedarf,
      kostenAktuell,
      co2Altanlage,
      wpLeistung,
      jazEffektiv: jazEffektiv,
      fanEffect,
      kostenWP,
      co2WP,
      ersparnis,
      co2Ersparnis,
      co2Fussballfelder,
      amortisation,
    };
  }, []);

  return calculate;
};
