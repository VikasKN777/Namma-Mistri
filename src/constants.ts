/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculationResult } from './types.ts';

// Standard Brick Size in India (Modular): 190 x 90 x 90 mm
// With Mortar (10mm): 200 x 100 x 100 mm 
// Non-modular (Traditional): 9" x 4.5" x 3" (230 x 115 x 75 mm)
// With Mortar: 9.5" x 5" x 3.5" (240 x 125 x 85 mm)

export const calcMasonry = (
  length: number, // in meters
  height: number, // in meters
  thickness: number, // in meters (usually 0.115 or 0.23)
  ratio: number = 6 // 1:6 ratio
): CalculationResult => {
  const wallVolume = length * height * thickness;
  
  // Using standard modular brick with mortar: 0.2 * 0.1 * 0.1 = 0.002 m3
  const brickVolumeWithMortar = 0.2 * 0.1 * 0.1;
  const brickCount = Math.ceil(wallVolume / brickVolumeWithMortar);
  
  // Real brick volume (without mortar): 0.19 * 0.09 * 0.09 = 0.001539 m3
  const totalBrickVolume = brickCount * (0.19 * 0.09 * 0.09);
  
  // Mortar Volume = Total Volume - Brick Volume
  let mortarVolume = wallVolume - totalBrickVolume;
  
  // Wastage (approx 15%)
  mortarVolume *= 1.15;
  
  // For 1:6 ratio (Sum of parts = 7)
  const cementInCubicMeters = (mortarVolume * 1) / (1 + ratio);
  const sandInCubicMeters = (mortarVolume * ratio) / (1 + ratio);
  
  // Density of cement = 1440 kg/m3. 1 bag = 50kg.
  // Cubic meter to bags approx factor: 28.8
  const cementBagsCount = Math.ceil(cementInCubicMeters * 28.8);
  
  // 1 m3 = approx 35.31 cubic feet
  const sandInCubicFeet = sandInCubicMeters * 35.31;

  return {
    bricks: brickCount,
    cementBags: cementBagsCount,
    sandCubicFeet: Number(sandInCubicFeet.toFixed(2)),
    concreteVolume: Number(wallVolume.toFixed(2)),
  };
};

export const KANNADA_TRANSLATIONS = {
  app_name: "ನಮ್ಮ ಮಿಸ್ತ್ರಿ",
  calculator: "ಲೆಕ್ಕಾಚಾರ",
  team: "ತಂಡ",
  photos: "ಫೋಟೋಗಳು",
  add_site: "ಹೊಸ ಸೈಟ್ ಸೇರಿಸಿ",
  labor_diary: "ಲೇಬರ್ ಡೈರಿ",
  bricks: "ಇಟ್ಟಿಗೆಗಳು",
  cement: "ಸಿಮೆಂಟ್",
  sand: "ಮರಳು",
  length: "ಉದ್ದ (ಮೀ)",
  height: "ಎತ್ತರ (ಮೀ)",
  width: "ಅಗಲ (ಮೀ)",
  calculate: "ಲೆಕ್ಕ ಹಾಕಿ",
  advance: "ಅಡ್ವಾನ್ಸ್",
  payment: "ಪಾವತಿ",
  attendance: "ಹಾಜರಾತಿ",
  present: "ಹಾಜರ್",
  absent: "ಗೈರು",
  half_day: "ಅರ್ಧ ದಿನ",
};
