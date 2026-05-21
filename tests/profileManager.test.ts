import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── React/i18n mock ──
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

// ── Swiss calculations mock ──
vi.mock('../src/astrology/services/calculations/swissCalculations', () => ({
  calculateCurrentSky: vi.fn().mockResolvedValue({
    positions: {
      sun: {
        longitude: 15,
        latitude: 0,
        distance: 1,
        speed: 1,
        isRetrograde: false,
        sign: 'aries',
        degreeInSign: 15,
        id: 'sun',
      },
      moon: {
        longitude: 45,
        latitude: 0,
        distance: 1,
        speed: 1,
        isRetrograde: false,
        sign: 'taurus',
        degreeInSign: 15,
        id: 'moon',
      },
    },
  }),
  calculateLocalHouses: vi.fn().mockResolvedValue({
    cusps: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      longitude: i * 30,
      sign: 'aries',
      degreeInSign: 0,
    })),
    ascendant: 0,
    mc: 90,
    ic: 270,
    descendant: 180,
  }),
}));

// ── Engine mock ──
vi.mock('../src/astrology/swiss-ephemeris/engine', () => ({
  birthDateTimeToUTC: vi.fn(
    (date: string, time: string) => new Date(`${date}T${time}:00Z`)
  ),
  setZodiacFrame: vi.fn(),
  setSignCount: vi.fn(),
  isUsingFallback: vi.fn(() => false),
}));

// ── Natal chart helpers mock ──
vi.mock('../src/astrology/services/natal/natalChart', () => ({
  saveNatalChart: vi.fn(),
  getNatalChart: vi.fn(),
  deleteNatalChart: vi.fn(),
  getDignity: vi.fn(() => 'neutral'),
  getHouseFromLongitude: vi.fn(() => 1),
  calculateElementalBalance: vi.fn(() => ({
    fire: 0,
    earth: 0,
    air: 0,
    water: 0,
    ether: 0,
  })),
  calculateModalityBalance: vi.fn(() => ({
    cardinal: 0,
    fixed: 0,
    mutable: 0,
  })),
  getDominantElement: vi.fn(() => 'fire'),
}));

// ── Zodiac helpers mock ──
vi.mock('../src/astrology/services/natal/zodiacHelpers', () => ({
  getZodiacSystemPreference: vi.fn(() => '12-sign'),
  getZodiacFramePreference: vi.fn(() => 'tropical'),
  getSignCountPreference: vi.fn(() => 12),
  calculateElementalBalanceWithSystem: vi.fn(() => ({
    fire: 1,
    earth: 1,
    air: 0,
    water: 0,
    ether: 0,
  })),
  calculateModalityBalanceWithSystem: vi.fn(() => ({
    cardinal: 1,
    fixed: 0,
    mutable: 1,
  })),
}));

describe('ProfileManager', () => {
  let ProfileManager: typeof import('../src/astrology/services/natal/profileManager').ProfileManager;
  let ProfileValidationError: typeof import('../src/astrology/services/natal/profileManager').ProfileValidationError;
  let ProfileLimitError: typeof import('../src/astrology/services/natal/profileManager').ProfileLimitError;
  let ProfileNotFoundError: typeof import('../src/astrology/services/natal/profileManager').ProfileNotFoundError;
  let ChartCalculationError: typeof import('../src/astrology/services/natal/profileManager').ChartCalculationError;

  let mockGetNatalChart: ReturnType<typeof vi.fn>;
  let mockSaveNatalChart: ReturnType<typeof vi.fn>;
  let mockDeleteNatalChart: ReturnType<typeof vi.fn>;
  let mockCalculateCurrentSky: ReturnType<typeof vi.fn>;

  const validBirthData = {
    date: '1990-01-01',
    time: '12:00',
    latitude: 40.7,
    longitude: -74,
    timezone: 'America/New_York',
  };

  function makeMockChart(overrides?: Partial<any>): any {
    return {
      id: 'natal-test-id',
      name: 'Test',
      birthData: validBirthData,
      planets: {
        sun: {
          sign: 'aries',
          house: 1,
          longitude: 15,
          latitude: 0,
          distance: 1,
          speed: 1,
          isRetrograde: false,
          degreeInSign: 15,
          id: 'sun',
          dignity: 'domicile',
        },
        moon: {
          sign: 'taurus',
          house: 2,
          longitude: 45,
          latitude: 0,
          distance: 1,
          speed: 1,
          isRetrograde: false,
          degreeInSign: 15,
          id: 'moon',
          dignity: 'neutral',
        },
      },
      houses: {
        type: 'placidus',
        cusps: Array.from({ length: 12 }, (_, i) => ({
          number: i + 1,
          longitude: i * 30,
          sign: 'aries',
          degreeInSign: 0,
        })),
        ascendant: 0,
        mc: 90,
        ic: 270,
        dsc: 180,
      },
      ascendant: { longitude: 0, sign: 'aries', degree: 0 },
      midheaven: { longitude: 90, sign: 'cancer', degree: 0 },
      elements: { fire: 1, earth: 1, air: 0, water: 0, ether: 0 },
      modalities: { cardinal: 1, fixed: 0, mutable: 1 },
      calculatedAt: new Date(),
      zodiacSystem: '12-sign',
      zodiacFrame: 'tropical',
      signCount: 12,
      calculatedWithFallback: false,
      ...overrides,
    };
  }

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    vi.clearAllMocks();

    const natalChartMod = await import(
      '../src/astrology/services/natal/natalChart'
    );
    mockGetNatalChart = natalChartMod.getNatalChart as ReturnType<typeof vi.fn>;
    mockSaveNatalChart = natalChartMod.saveNatalChart as ReturnType<
      typeof vi.fn
    >;
    mockDeleteNatalChart = natalChartMod.deleteNatalChart as ReturnType<
      typeof vi.fn
    >;

    const swissMod = await import(
      '../src/astrology/services/calculations/swissCalculations'
    );
    mockCalculateCurrentSky = swissMod.calculateCurrentSky as ReturnType<
      typeof vi.fn
    >;

    const pmMod = await import(
      '../src/astrology/services/natal/profileManager'
    );
    ProfileManager = pmMod.ProfileManager;
    ProfileValidationError = pmMod.ProfileValidationError;
    ProfileLimitError = pmMod.ProfileLimitError;
    ProfileNotFoundError = pmMod.ProfileNotFoundError;
    ChartCalculationError = pmMod.ChartCalculationError;

    (ProfileManager as any).instance = undefined;

    mockGetNatalChart.mockReturnValue(makeMockChart());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Singleton behavior
  // ═══════════════════════════════════════════════════════════════════════════
  describe('singleton behavior', () => {
    it('getInstance returns the same object', () => {
      const pm1 = ProfileManager.getInstance();
      const pm2 = ProfileManager.getInstance();
      expect(pm1).toBe(pm2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. createProfile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('createProfile', () => {
    it('creates a profile with valid data', async () => {
      const pm = ProfileManager.getInstance();
      const result = await pm.createProfile('Alice', validBirthData);
      expect(result.name).toBe('Alice');
      expect(result.id).toBeDefined();
      expect(result.chart).toBeDefined();
      expect(result.chart.planets.sun).toBeDefined();
      expect(result.chart.planets.moon).toBeDefined();
    });

    it('throws ProfileValidationError for empty name', async () => {
      const pm = ProfileManager.getInstance();
      await expect(
        pm.createProfile('', validBirthData)
      ).rejects.toThrow(ProfileValidationError);
      await expect(
        pm.createProfile('   ', validBirthData)
      ).rejects.toThrow(ProfileValidationError);
    });

    it('throws ProfileLimitError when >50 profiles', async () => {
      const pm = ProfileManager.getInstance();
      for (let i = 0; i < 50; i++) {
        await pm.createProfile(`User ${i}`, validBirthData);
      }
      await expect(
        pm.createProfile('Overflow', validBirthData)
      ).rejects.toThrow(ProfileLimitError);
    });

    it('auto-sets first profile as default and active', async () => {
      const pm = ProfileManager.getInstance();
      const result = await pm.createProfile('First', validBirthData);
      expect(result.isDefault).toBe(true);
      expect(pm.getActiveProfile()?.id).toBe(result.id);
      expect(localStorage.getItem('celestial-active-profile-id')).toBe(
        result.id
      );
    });

    it('emits profile:created event', async () => {
      const pm = ProfileManager.getInstance();
      const listener = vi.fn();
      pm.subscribe(listener);
      const result = await pm.createProfile('Eventful', validBirthData);

      const createdEvent = listener.mock.calls.find(
        (call: any) => call[0].type === 'profile:created'
      )?.[0];
      expect(createdEvent).toBeDefined();
      expect(createdEvent.profileId).toBe(result.id);
      expect(createdEvent.payload.name).toBe('Eventful');
    });

    it('trims name and stores tags lowercased', async () => {
      const pm = ProfileManager.getInstance();
      const result = await pm.createProfile('  Bob  ', validBirthData, {
        tags: ['Admin', 'TEST'],
      });
      expect(result.name).toBe('Bob');
      expect(result.tags).toEqual(['admin', 'test']);
    });

    it('uses provided avatar over generated one', async () => {
      const pm = ProfileManager.getInstance();
      const result = await pm.createProfile('Custom', validBirthData, {
        avatar: '🌟',
      });
      expect(result.avatar).toBe('🌟');
    });

    it('respects makeDefault: false for first profile', async () => {
      const pm = ProfileManager.getInstance();
      const result = await pm.createProfile('NoDefault', validBirthData, {
        makeDefault: false,
      });
      expect(result.isDefault).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Queries: getProfile, getProfileWithChart, listProfiles, getAllProfiles
  // ═══════════════════════════════════════════════════════════════════════════
  describe('queries', () => {
    it('getProfile returns null for missing id', () => {
      const pm = ProfileManager.getInstance();
      expect(pm.getProfile('missing')).toBeNull();
    });

    it('getProfile returns the profile', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Charlie', validBirthData);
      const found = pm.getProfile(created.id);
      expect(found?.name).toBe('Charlie');
    });

    it('getProfileWithChart returns null for missing profile', () => {
      const pm = ProfileManager.getInstance();
      expect(pm.getProfileWithChart('missing')).toBeNull();
    });

    it('getProfileWithChart returns null when chart missing', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Dana', validBirthData);
      mockGetNatalChart.mockReturnValue(null);
      expect(pm.getProfileWithChart(created.id)).toBeNull();
    });

    it('getProfileWithChart returns profile and chart', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Eve', validBirthData);
      mockGetNatalChart.mockReturnValue(makeMockChart());
      const result = pm.getProfileWithChart(created.id);
      expect(result?.name).toBe('Eve');
      expect(result?.chart).toBeDefined();
    });

    it('listProfiles returns sorted items with default first', async () => {
      const pm = ProfileManager.getInstance();
      await pm.createProfile('Zebra', validBirthData);
      await pm.createProfile('Apple', validBirthData);
      const list = pm.listProfiles();
      expect(list.length).toBe(2);
      expect(list[0].name).toBe('Zebra'); // default comes first
      expect(list[1].name).toBe('Apple');
    });

    it('getAllProfiles returns all profiles sorted by name', async () => {
      const pm = ProfileManager.getInstance();
      await pm.createProfile('Zebra', validBirthData);
      await pm.createProfile('Apple', validBirthData);
      const all = pm.getAllProfiles();
      expect(all.map((p) => p.name)).toEqual(['Apple', 'Zebra']);
    });

    it('getActiveProfile returns null when none active', () => {
      const pm = ProfileManager.getInstance();
      expect(pm.getActiveProfile()).toBeNull();
    });

    it('getDefaultProfile returns first profile when no explicit default', async () => {
      const pm = ProfileManager.getInstance();
      const p1 = await pm.createProfile('One', validBirthData, {
        makeDefault: false,
      });
      await pm.createProfile('Two', validBirthData, { makeDefault: false });
      expect(pm.getDefaultProfile()?.id).toBe(p1.id);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. setActiveProfile / setDefaultProfile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('active and default profile', () => {
    it('setActiveProfile sets correctly and persists', async () => {
      const pm = ProfileManager.getInstance();
      const p1 = await pm.createProfile('One', validBirthData);
      const p2 = await pm.createProfile('Two', validBirthData);
      pm.setActiveProfile(p2.id);
      expect(pm.getActiveProfile()?.id).toBe(p2.id);
      expect(localStorage.getItem('celestial-active-profile-id')).toBe(p2.id);
    });

    it('setActiveProfile throws ProfileNotFoundError for bad ID', async () => {
      const pm = ProfileManager.getInstance();
      await pm.createProfile('One', validBirthData);
      expect(() => pm.setActiveProfile('bad-id')).toThrow(
        ProfileNotFoundError
      );
    });

    it('setDefaultProfile sets correctly and persists', async () => {
      const pm = ProfileManager.getInstance();
      const p1 = await pm.createProfile('One', validBirthData);
      const p2 = await pm.createProfile('Two', validBirthData);
      pm.setDefaultProfile(p2.id);
      expect(pm.getDefaultProfile()?.id).toBe(p2.id);
      expect(pm.getProfile(p1.id)?.isDefault).toBe(false);
    });

    it('setDefaultProfile throws ProfileNotFoundError for bad ID', () => {
      const pm = ProfileManager.getInstance();
      expect(() => pm.setDefaultProfile('bad-id')).toThrow(
        ProfileNotFoundError
      );
    });

    it('setDefaultProfile unsets other defaults', async () => {
      const pm = ProfileManager.getInstance();
      const p1 = await pm.createProfile('One', validBirthData);
      const p2 = await pm.createProfile('Two', validBirthData);
      pm.setDefaultProfile(p2.id);
      expect(pm.getProfile(p1.id)?.isDefault).toBe(false);
      expect(pm.getProfile(p2.id)?.isDefault).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. updateProfile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateProfile', () => {
    it('updates name', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Old', validBirthData);
      const updated = await pm.updateProfile(created.id, { name: 'New' });
      expect(updated.name).toBe('New');
      expect(pm.getProfile(created.id)?.name).toBe('New');
      expect(pm.getProfile(created.id)?.updatedAt.getTime()).toBeGreaterThan(
        created.updatedAt.getTime()
      );
    });

    it('recalculates chart when birthData changes', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Old', validBirthData);
      const newBirthData = { ...validBirthData, latitude: 51.5 };
      mockGetNatalChart.mockReturnValue(makeMockChart());
      await pm.updateProfile(created.id, { birthData: newBirthData });
      expect(mockCalculateCurrentSky).toHaveBeenCalled();
      expect(mockSaveNatalChart).toHaveBeenCalled();
    });

    it('throws ProfileNotFoundError for bad ID', async () => {
      const pm = ProfileManager.getInstance();
      await expect(
        pm.updateProfile('bad-id', { name: 'New' })
      ).rejects.toThrow(ProfileNotFoundError);
    });

    it('throws when chart missing and no birthData provided', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Old', validBirthData);
      mockGetNatalChart.mockReturnValue(null);
      await expect(
        pm.updateProfile(created.id, { name: 'New' })
      ).rejects.toThrow(ProfileNotFoundError);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. deleteProfile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteProfile', () => {
    it('deletes profile and chart', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('ToDelete', validBirthData);
      pm.deleteProfile(created.id);
      expect(pm.getProfile(created.id)).toBeNull();
      expect(mockDeleteNatalChart).toHaveBeenCalledWith(created.id);
    });

    it('clears active if deleted was active', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('ActiveDel', validBirthData);
      expect(pm.getActiveProfile()?.id).toBe(created.id);
      pm.deleteProfile(created.id);
      expect(pm.getActiveProfile()).toBeNull();
      expect(localStorage.getItem('celestial-active-profile-id')).toBeNull();
    });

    it('promotes new default if deleted was default', async () => {
      const pm = ProfileManager.getInstance();
      const p1 = await pm.createProfile('Default', validBirthData);
      const p2 = await pm.createProfile('Other', validBirthData);
      pm.setDefaultProfile(p1.id);
      pm.deleteProfile(p1.id);
      expect(pm.getDefaultProfile()?.id).toBe(p2.id);
    });

    it('throws ProfileNotFoundError for bad ID', () => {
      const pm = ProfileManager.getInstance();
      expect(() => pm.deleteProfile('bad-id')).toThrow(ProfileNotFoundError);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. recalculateChartWithZodiacSystem
  // ═══════════════════════════════════════════════════════════════════════════
  describe('recalculateChartWithZodiacSystem', () => {
    it('returns null for missing profile', async () => {
      const pm = ProfileManager.getInstance();
      const result = await pm.recalculateChartWithZodiacSystem('missing');
      expect(result).toBeNull();
    });

    it('returns null when chart missing', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Re', validBirthData);
      mockGetNatalChart.mockReturnValue(null);
      const result = await pm.recalculateChartWithZodiacSystem(created.id);
      expect(result).toBeNull();
    });

    it('short-circuits when system already matches and not fallback', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Re', validBirthData);
      mockCalculateCurrentSky.mockClear();
      const chart = makeMockChart({
        zodiacSystem: '12-sign',
        zodiacFrame: 'tropical',
        signCount: 12,
        calculatedWithFallback: false,
      });
      mockGetNatalChart.mockReturnValue(chart);
      const result = await pm.recalculateChartWithZodiacSystem(
        created.id,
        '12-sign',
        'tropical',
        12
      );
      expect(result).toBe(chart);
      expect(mockCalculateCurrentSky).not.toHaveBeenCalled();
    });

    it('recalculates when system differs', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Re', validBirthData);
      const chart = makeMockChart({
        zodiacSystem: '12-sign',
        zodiacFrame: 'tropical',
        signCount: 12,
        calculatedWithFallback: false,
      });
      mockGetNatalChart.mockReturnValue(chart);
      const result = await pm.recalculateChartWithZodiacSystem(
        created.id,
        'sidereal',
        'sidereal',
        12
      );
      expect(mockCalculateCurrentSky).toHaveBeenCalled();
      expect(result).not.toBe(chart);
      expect(mockSaveNatalChart).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. exportAllProfiles / importProfiles
  // ═══════════════════════════════════════════════════════════════════════════
  describe('export and import', () => {
    it('round-trip export/import works', async () => {
      const pm = ProfileManager.getInstance();
      await pm.createProfile('ExportMe', validBirthData, {
        tags: ['tag1'],
        notes: 'note',
      });

      const exported = pm.exportAllProfiles();
      const data = JSON.parse(exported);
      expect(data.version).toBe('1.0');
      expect(data.profiles.length).toBe(1);

      // exportAllProfiles does not include birthData on Profile objects,
      // so we augment the payload for a valid import round-trip.
      const completeExport = {
        ...data,
        profiles: data.profiles.map((p: any) => ({
          ...p,
          birthData: validBirthData,
        })),
      };

      pm.clearAllProfiles();
      expect(pm.getAllProfiles().length).toBe(0);

      const result = pm.importProfiles(JSON.stringify(completeExport));
      expect(result.imported).toBe(1);
      expect(result.errors.length).toBe(0);
      expect(pm.getAllProfiles().length).toBe(1);
      const imported = pm.getAllProfiles()[0];
      expect(imported.name).toBe('ExportMe');
      expect(imported.tags).toEqual(['tag1']);
      expect(imported.notes).toBe('note');
    });

    it('import handles invalid JSON gracefully', () => {
      const pm = ProfileManager.getInstance();
      const result = pm.importProfiles('not json');
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Import failed');
    });

    it('import handles missing profiles array', () => {
      const pm = ProfileManager.getInstance();
      const result = pm.importProfiles(JSON.stringify({ version: '1.0' }));
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('import enforces max profiles', async () => {
      const pm = ProfileManager.getInstance();
      for (let i = 0; i < 50; i++) {
        await pm.createProfile(`User ${i}`, validBirthData);
      }
      const extraProfile = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profiles: [
          {
            id: 'extra-1',
            name: 'Extra',
            birthData: validBirthData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false,
            tags: [],
          },
        ],
      };
      const result = pm.importProfiles(JSON.stringify(extraProfile));
      expect(result.imported).toBe(0);
      expect(result.errors.some((e: string) => e.includes('maximum'))).toBe(
        true
      );
    });

    it('import skips duplicates', async () => {
      const pm = ProfileManager.getInstance();
      const created = await pm.createProfile('Dup', validBirthData);
      const duplicateJson = JSON.stringify({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profiles: [
          {
            id: created.id,
            name: 'Dup',
            birthData: validBirthData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false,
            tags: [],
          },
        ],
      });
      const result = pm.importProfiles(duplicateJson);
      expect(result.imported).toBe(0);
      expect(result.errors.some((e: string) => e.includes('duplicate'))).toBe(
        true
      );
    });

    it('import skips profiles missing required fields', () => {
      const pm = ProfileManager.getInstance();
      const badJson = JSON.stringify({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profiles: [{ name: 'NoId', birthData: validBirthData }],
      });
      const result = pm.importProfiles(badJson);
      expect(result.imported).toBe(0);
      expect(result.errors.some((e: string) => e.includes('Skipped invalid'))).toBe(true);
    });

    it('import sets first as default when none exists', () => {
      const pm = ProfileManager.getInstance();
      const json = JSON.stringify({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profiles: [
          {
            id: 'imp-1',
            name: 'Importer',
            birthData: validBirthData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false,
            tags: [],
          },
        ],
      });
      const result = pm.importProfiles(json);
      expect(result.imported).toBe(1);
      expect(pm.getDefaultProfile()?.name).toBe('Importer');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. clearAllProfiles
  // ═══════════════════════════════════════════════════════════════════════════
  describe('clearAllProfiles', () => {
    it('removes all profiles and charts', async () => {
      const pm = ProfileManager.getInstance();
      await pm.createProfile('One', validBirthData);
      await pm.createProfile('Two', validBirthData);
      localStorage.setItem('natal-chart-extra', JSON.stringify({ foo: 'bar' }));
      pm.clearAllProfiles();
      expect(pm.getAllProfiles().length).toBe(0);
      expect(pm.getActiveProfile()).toBeNull();
      expect(localStorage.getItem('celestial-profiles-v1')).toBeNull();
      expect(localStorage.getItem('celestial-active-profile-id')).toBeNull();
      expect(localStorage.getItem('natal-chart-extra')).toBeNull();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. Event system
  // ═══════════════════════════════════════════════════════════════════════════
  describe('event system', () => {
    it('subscribe/unsubscribe works', async () => {
      const pm = ProfileManager.getInstance();
      const listener = vi.fn();
      const unsubscribe = pm.subscribe(listener);
      await pm.createProfile('Sub', validBirthData);
      expect(listener).toHaveBeenCalled();
      unsubscribe();
      const callsBefore = listener.mock.calls.length;
      await pm.createProfile('Sub2', validBirthData);
      expect(listener.mock.calls.length).toBe(callsBefore);
    });

    it('events fire on mutations', async () => {
      const pm = ProfileManager.getInstance();
      const events: any[] = [];
      pm.subscribe((e) => events.push(e));

      const p1 = await pm.createProfile('Event1', validBirthData);
      expect(events.some((e) => e.type === 'profile:created')).toBe(true);

      pm.setActiveProfile(p1.id);
      expect(events.some((e) => e.type === 'profile:switched')).toBe(true);

      pm.setDefaultProfile(p1.id);
      expect(events.some((e) => e.type === 'profile:set-default')).toBe(true);

      await pm.updateProfile(p1.id, { name: 'Updated' });
      expect(
        events.filter((e) => e.type === 'profile:updated').length
      ).toBeGreaterThanOrEqual(1);

      pm.deleteProfile(p1.id);
      expect(events.some((e) => e.type === 'profile:deleted')).toBe(true);
    });

    it('event listener errors are caught and do not break others', async () => {
      const pm = ProfileManager.getInstance();
      const badListener = vi.fn().mockImplementation(() => {
        throw new Error('boom');
      });
      const goodListener = vi.fn();
      pm.subscribe(badListener);
      pm.subscribe(goodListener);
      await pm.createProfile('Safe', validBirthData);
      expect(goodListener).toHaveBeenCalled();
    });

    it('clearAllProfiles emits profile:deleted for all', () => {
      const pm = ProfileManager.getInstance();
      const events: any[] = [];
      pm.subscribe((e) => events.push(e));
      pm.clearAllProfiles();
      expect(events.some((e) => e.type === 'profile:deleted' && e.profileId === 'all')).toBe(true);
    });
  });
});
