/**
 * Simple Planet in Sign Interpretations
 * Basic meanings for the UI
 */

import type { PlanetId, ZodiacSign } from '../../types';

const PLANET_MEANINGS: Record<string, string> = {
  sun: 'Your core identity, ego, and conscious will.',
  moon: 'Your emotional nature, instincts, and subconscious needs.',
  mercury: 'Your thinking style, communication, and learning.',
  venus: 'Your approach to love, beauty, and relationships.',
  mars: 'Your drive, ambition, and how you take action.',
  jupiter: 'Your growth, expansion, and life philosophy.',
  saturn: 'Your responsibilities, limitations, and life lessons.',
  uranus: 'Your uniqueness, rebellion, and innovative spirit.',
  neptune: 'Your imagination, spirituality, and dreams.',
  pluto: 'Your transformation, power, and deepest drives.',
  chiron: 'Your wounds and healing path.',
  north_node: 'Your soul\'s growth direction in this life.',
  south_node: 'Your past life skills and comfort zone.',
  lilith: 'Your primal instincts and shadow side.',
};

const SIGN_QUALITIES: Record<string, string> = {
  aries: 'bold, pioneering, and energetic',
  taurus: 'stable, sensual, and determined',
  gemini: 'curious, adaptable, and communicative',
  cancer: 'nurturing, protective, and emotional',
  leo: 'creative, confident, and dramatic',
  virgo: 'analytical, practical, and detail-oriented',
  libra: 'diplomatic, charming, and relationship-focused',
  scorpio: 'intense, transformative, and perceptive',
  sagittarius: 'adventurous, philosophical, and freedom-loving',
  capricorn: 'ambitious, disciplined, and practical',
  aquarius: 'innovative, independent, and humanitarian',
  pisces: 'intuitive, compassionate, and imaginative',
};

export function getPlanetInSignMeaning(planet: PlanetId, sign: ZodiacSign): string {
  const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1);
  const signQuality = SIGN_QUALITIES[sign] || 'unique';
  const planetMeaning = PLANET_MEANINGS[planet] || 'expresses';
  
  return `${planetName} in ${signName} makes you ${signQuality} in how you ${planetMeaning.toLowerCase()}. This placement colors your approach with ${sign.split('').slice(0, 3).join('')} energy—${signQuality}.`;
}

export default getPlanetInSignMeaning;
