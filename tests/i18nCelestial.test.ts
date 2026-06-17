import { describe, it, expect } from 'vitest';
import enCelestial from '../src/i18n/locales/en/celestial.json';

// Spanish words that are unmistakable — they don't appear in normal English text.
// We avoid short words like "el", "la", "las", "ir" because they are substrings of English words.
const SPANISH_WORDS = [
  'Vitalidad',
  'Reconocimiento',
  'Evita',
  'decisiones',
  'importantes',
  'Ahorra',
  'energía',
  'sueño',
  'perturbado',
  'Mitad',
  'permanece',
  'debe',
  'irse',
  'llevarás',
  'adelante',
  'dejarás',
  'atrás',
  'elección',
  'tuya',
  'sola',
  'Liberación',
  'Dejar',
  'Soltar',
  'apego',
  'Limpiar',
  'espacio',
  'Perdonar',
  'comiences',
  'nuevos',
  'proyectos',
  'Completa',
  'puedas',
  'Encrucijadas',
  'caminos',
  'decisión',
  'cuelga',
  'equilibrio',
  'camino',
  'requiere',
  'acción',
  'Elige',
  'universo',
  'conspira',
  'Tomar',
  'acción',
  'Superar',
  'obstáculos',
  'Comprometerse',
  'hesitación',
  'mires',
  'Reunión',
  'lleno',
  'completo',
  'impulso',
  'construye',
  'ola',
  'llega',
  'cresta',
  'Refina',
  'ajusta',
  'prepárate',
  'revelación',
  'Refinar',
  'proyectos',
  'Ajustar',
  'planes',
  'Prepararse',
  'lanzamiento',
  'Reunir',
  'recursos',
  'apresurarse',
  'finalización',
  'paciencia',
  'recompensa',
  'Compartición',
  'luz',
  'comienza',
  'retirada',
  'gentil',
  'sabiduría',
  'permanece',
  'Comparte',
  'aprendido',
  'Enséñale',
  'otros',
  'plenitud',
  'enseñó',
  'Compartir',
  'conocimientos',
  'Enseñar',
  'Dar',
  'vuelta',
  'aferrarte',
  'pico',
  'Deja',
  'ciclo',
  'complete',
  'susurro',
  'plateado',
  'desvanecido',
  'negrura',
  'Descansa',
  'ahora',
  'trabajo',
  'hecho',
  'Rendir',
  'oscuridad',
  'sabiendo',
  'volverá',
  'Descanso',
  'profundo',
  'Rendirse',
  'Meditación',
  'Preparación',
  'Trabajo',
];

function collectStringValues(obj: unknown, path = ''): { path: string; value: string }[] {
  const results: { path: string; value: string }[] = [];
  if (typeof obj === 'string') {
    results.push({ path, value: obj });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => results.push(...collectStringValues(item, `${path}[${i}]`)));
  } else if (obj !== null && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, val]) => results.push(...collectStringValues(val, `${path}.${key}`)));
  }
  return results;
}

function containsSpanish(text: string): boolean {
  // Spanish accented characters are a strong signal
  if (/[áéíóúñüÁÉÍÓÚÑÜ]/.test(text)) return true;
  for (const word of SPANISH_WORDS) {
    // Whole-word match to avoid false positives
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) return true;
  }
  return false;
}

describe('celestial.json English locale regression tests', () => {
  it('planetaryGuidance entries do not contain Spanish words or accents', () => {
    const guidance = (enCelestial as any).dictionaries?.planetaryGuidance;
    expect(guidance).toBeDefined();
    const strings = collectStringValues(guidance, 'dictionaries.planetaryGuidance');
    const offenders: string[] = [];
    for (const { path, value } of strings) {
      if (containsSpanish(value)) {
        offenders.push(`${path}: "${value}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('planetInSign sun and moon entries do not contain Spanish words or accents', () => {
    const planetInSign = (enCelestial as any).dictionaries?.planetInSign;
    expect(planetInSign).toBeDefined();
    const strings = collectStringValues(
      { sun: planetInSign.sun, moon: planetInSign.moon },
      'dictionaries.planetInSign'
    );
    const offenders: string[] = [];
    for (const { path, value } of strings) {
      if (containsSpanish(value)) {
        offenders.push(`${path}: "${value}"`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
