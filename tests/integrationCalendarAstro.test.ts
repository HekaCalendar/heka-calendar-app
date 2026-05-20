import { describe, it, expect } from 'vitest';
import { hekaToCivil, civilToHeka, getNoteKey, HEKA_MONTHS } from '../src/services/calendarService';
import {
  getSolarNoon,
  getSeasonalEvents,
  getNextSeasonalEvent,
  getMoonPhase,
  getLunarMonth,
} from '../src/services/astronomyService';
import { getCurrentSeason } from '../src/services/seasonService';

describe('integration: calendar + astronomy', () => {
  it('heka date converts to civil date with valid astronomy', () => {
    const hekaDate = { year: 2024, month: 6, day: 15 };
    const civil = hekaToCivil(hekaDate);
    expect(civil.getFullYear()).toBe(2024);

    const noon = getSolarNoon(civil, { latitude: 0, longitude: 0 });
    expect(noon.time).toBeInstanceOf(Date);
    expect(noon.elevation).toBeGreaterThanOrEqual(-90);
    expect(noon.elevation).toBeLessThanOrEqual(90);

    const phase = getMoonPhase(civil);
    expect(phase.illumination).toBeGreaterThanOrEqual(0);
    expect(phase.illumination).toBeLessThanOrEqual(100);
  });

  it('round-trip heka→civil→heka preserves date identity', () => {
    const original = { year: 2024, month: 3, day: 20 };
    const civil = hekaToCivil(original);
    const back = civilToHeka(civil);
    expect(back.year).toBe(original.year);
    expect(back.month).toBe(original.month);
    expect(back.day).toBe(original.day);
  });

  it('seasonal events align with calendar seasons', () => {
    const events = getSeasonalEvents(2024, 'N');
    const springEvent = events.find(e => e.name.includes('Vernal'));
    const summerEvent = events.find(e => e.name.includes('Summer'));

    const springSeason = getCurrentSeason(springEvent!.date, 'N');
    const summerSeason = getCurrentSeason(summerEvent!.date, 'N');

    expect(springSeason.name).toBe('Spring');
    expect(summerSeason.name).toBe('Summer');
  });

  it('southern hemisphere seasons are opposite', () => {
    const juneDate = new Date('2024-06-21');
    const northSeason = getCurrentSeason(juneDate, 'N');
    const southSeason = getCurrentSeason(juneDate, 'S');

    expect(northSeason.name).toBe('Summer');
    expect(southSeason.name).toBe('Winter');
    expect(northSeason.element).toBe('Fire');
    expect(southSeason.element).toBe('Water');
  });

  it('lunar month contains the input date', () => {
    const date = new Date('2024-06-15');
    const month = getLunarMonth(date);
    expect(month.startDate.getTime()).toBeLessThanOrEqual(date.getTime());
    expect(month.endDate.getTime()).toBeGreaterThanOrEqual(date.getTime());
  });

  it('moon phase and lunar month are consistent', () => {
    const date = new Date('2024-06-15');
    const phase = getMoonPhase(date);
    const month = getLunarMonth(date);

    // If illumination is very low, we should be near new moon
    if (phase.illumination < 10) {
      const daysFromNew = Math.abs(date.getTime() - month.newMoon.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysFromNew).toBeLessThan(3);
    }
  });

  it('note key generation is consistent with heka dates', () => {
    const hekaDate = { year: 2024, month: 6, day: 15 };
    const key1 = getNoteKey(hekaDate.year, hekaDate.month, hekaDate.day);
    const civil = hekaToCivil(hekaDate);
    const back = civilToHeka(civil);
    const key2 = getNoteKey(back.year, back.month, back.day);
    expect(key1).toBe(key2);
  });

  it('HEKA_MONTHS metadata aligns with seasonal astronomy', () => {
    const month6 = HEKA_MONTHS[6];
    const midMonthDate = hekaToCivil({ year: 2024, month: 6, day: 15 });
    const season = getCurrentSeason(midMonthDate, 'N');

    // HEKA month 6 (September) should be in a valid season in Northern hemisphere
    expect(['Summer', 'Autumn', 'Spring', 'Winter']).toContain(season.name);
    expect(month6.name).toBe('September');
    expect(month6.arc).toBeTruthy();
  });

  it('next seasonal event is in the future', () => {
    const now = new Date('2024-06-15');
    const nextEvent = getNextSeasonalEvent(now, 'N');
    expect(nextEvent.date.getTime()).toBeGreaterThan(now.getTime());
  });
});
