# HEKA Astrology System - Supreme Architecture

## Core Philosophy
> "Architecture is the art of how to waste space." - Philip Johnson

We waste no space. Every line has purpose.

## Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Components │  │    Hooks     │  │  Higher-Order    │  │
│  │   (Dumb UI)  │  │ (Business    │  │   Components     │  │
│  │              │  │   Logic)     │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    STATE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    Redux     │  │   Selectors  │  │    Thunks/       │  │
│  │    Store     │  │   (Memoized) │  │    Async Actions │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   SERVICE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Swiss      │  │  Calculation │  │   Validation     │  │
│  │  Ephemeris   │  │   Engines    │  │    & Guards      │  │
│  │   Engine     │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   TypeScript │  │  Constants/  │  │   Persistence    │  │
│  │    Types     │  │  Config      │  │   (localStorage) │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Type System (Foundation)

### Core Entities
```typescript
// Immutable, strict, self-documenting
interface CelestialBody {
  id: PlanetId;
  longitude: Degree;        // 0-360, validated
  latitude: Degree;         // -90 to 90
  distance: AstronomicalUnit;
  speed: DegreesPerDay;     // For retrograde detection
  isRetrograde: boolean;
}

interface HouseSystem {
  type: 'placidus' | 'whole-sign' | 'equal' | 'koch' | 'campanus';
  cusps: readonly HouseCusp[];  // Immutable array
  ascendant: Degree;
  mc: Degree;                   // Midheaven
  ic: Degree;                   // Imum Coeli
  dsc: Degree;                  // Descendant
}

interface NatalChart {
  readonly id: string;
  readonly subject: Person;
  readonly moment: Moment;
  readonly location: GeoLocation;
  readonly bodies: readonly CelestialBody[];
  readonly houses: HouseSystem;
  readonly aspects: readonly Aspect[];
  readonly patterns: readonly Pattern[];
  readonly elements: ElementalBalance;
  readonly modalities: ModalBalance;
  readonly calculatedAt: Timestamp;
  readonly version: '2.0';
}
```

## 2. Swiss Ephemeris Service Architecture

### WASM Integration Pattern
```typescript
class SwissEphemerisService {
  private wasm: SwissEphWASM | null = null;
  private ready: Promise<void>;
  private cache: LRUCache<CalculationKey, CalculationResult>;
  private fallback: KeplerianFallback;
  
  // Lazy initialization with retry
  async initialize(): Promise<void>
  
  // Main calculation methods
  async calculatePlanet(moment: Moment, planet: PlanetId): Promise<CelestialBody>
  async calculateHouses(moment: Moment, location: GeoLocation, system: HouseType): Promise<HouseSystem>
  
  // Batch calculations for performance
  async calculateChart(params: ChartParams): Promise<NatalChart>
  
  // Error handling with fallback
  private handleCalculationError(error: Error): never | FallbackResult
}
```

### Worker Thread Pattern
For heavy calculations (chart generation, transit searches):
```typescript
// astro-worker.ts
self.onmessage = async (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'GENERATE_CHART':
      const chart = await generateChartInWorker(payload);
      self.postMessage({ type: 'CHART_RESULT', chart });
      break;
      
    case 'SEARCH_TRANSITS':
      const transits = await searchTransitsInWorker(payload);
      self.postMessage({ type: 'TRANSIT_RESULT', transits });
      break;
  }
};
```

## 3. State Architecture (Redux + TypeScript)

### Normalized State Shape
```typescript
interface AstrologyState {
  // Entities (normalized)
  entities: {
    profiles: Record<ProfileId, AstroProfile>;
    charts: Record<ChartId, NatalChart>;
    transits: Record<TransitId, DailyTransit>;
  };
  
  // UI State
  ui: {
    selectedProfileId: ProfileId | null;
    activeView: 'profiles' | 'chart' | 'houses' | 'planets' | 'transits';
    expandedSections: Set<string>;
    loading: Set<LoadingKey>;
    errors: Record<ErrorKey, ErrorInfo>;
  };
  
  // Preferences (persisted)
  preferences: {
    defaultZodiac: 'tropical' | 'sidereal';
    defaultHouseSystem: HouseType;
    showAspects: boolean;
    showMinorAspects: boolean;
  };
  
  // Derived data (calculated, not persisted)
  currentPlanetaryPositions: CelestialBody[] | null;
  todayTransits: Transit[] | null;
}
```

### Action Design
```typescript
// Actions are typed, validated, and documented
const createChart = createAsyncThunk(
  'astrology/createChart',
  async (params: ChartParams, { rejectWithValue }) => {
    try {
      // Validation
      const validated = ChartParamsSchema.parse(params);
      
      // Calculation
      const chart = await swissService.calculateChart(validated);
      
      // Persistence
      await persistence.saveChart(chart);
      
      return chart;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);
```

## 4. Component Architecture

### Container/Presentational Pattern
```typescript
// Container: Smart, knows about state
const ChartContainer: React.FC = () => {
  const selectedProfile = useSelector(selectSelectedProfile);
  const chart = useSelector(selectChartForProfile(selectedProfile?.id));
  const dispatch = useDispatch();
  
  const handleHouseClick = useCallback((house: number) => {
    dispatch(setSelectedHouse(house));
  }, [dispatch]);
  
  if (!chart) return <NoChartView />;
  
  return <ChartPresentation chart={chart} onHouseClick={handleHouseClick} />;
};

// Presentational: Dumb, only props
const ChartPresentation: React.FC<{
  chart: NatalChart;
  onHouseClick: (house: number) => void;
}> = ({ chart, onHouseClick }) => {
  return (
    <div className="chart-container">
      <ChartWheel chart={chart} />
      <HouseGrid houses={chart.houses} onClick={onHouseClick} />
    </div>
  );
};
```

### Custom Hooks for Logic
```typescript
// useChartCalculations.ts
export const useChartCalculations = (profileId: string) => {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const calculate = async () => {
      setLoading(true);
      try {
        const result = await calculateChartInWorker(profileId);
        if (!cancelled) setChart(result);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    calculate();
    return () => { cancelled = true; };
  }, [profileId]);
  
  return { chart, loading, error, recalculate: calculate };
};

// useTransitWatcher.ts - Real-time updates
export const useTransitWatcher = (profileId: string) => {
  const [currentTransits, setCurrentTransits] = useState<Transit[]>([]);
  
  useEffect(() => {
    // Update every minute for moon movement
    const interval = setInterval(() => {
      calculateCurrentTransits(profileId).then(setCurrentTransits);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [profileId]);
  
  return currentTransits;
};
```

## 5. Calculation Engine Architecture

### Aspect Calculation
```typescript
class AspectCalculator {
  private orbs: Record<AspectType, Degree> = {
    conjunction: 8,
    opposition: 8,
    trine: 6,
    square: 6,
    sextile: 4,
    quincunx: 2,
    semisextile: 1,
  };
  
  calculateAspects(bodies: CelestialBody[]): Aspect[] {
    const aspects: Aspect[] = [];
    
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const aspect = this.calculateAspect(bodies[i], bodies[j]);
        if (aspect) aspects.push(aspect);
      }
    }
    
    return aspects.sort((a, b) => a.orb - b.orb);
  }
  
  private calculateAspect(body1: CelestialBody, body2: CelestialBody): Aspect | null {
    const separation = Math.abs(body1.longitude - body2.longitude);
    const shortestSep = Math.min(separation, 360 - separation);
    
    for (const [type, angle] of Object.entries(ASPECT_ANGLES)) {
      const orb = Math.abs(shortestSep - angle);
      if (orb <= this.orbs[type as AspectType]) {
        return {
          type: type as AspectType,
          body1: body1.id,
          body2: body2.id,
          angle: shortestSep,
          orb,
          isApplying: this.isApplying(body1, body2, angle),
        };
      }
    }
    
    return null;
  }
}
```

### Pattern Detection (Grand Trines, T-Squares, etc.)
```typescript
class PatternDetector {
  detectPatterns(aspects: Aspect[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    patterns.push(...this.findGrandTrines(aspects));
    patterns.push(...this.findTSquares(aspects));
    patterns.push(...this.findGrandCrosses(aspects));
    patterns.push(...this.findYods(aspects));
    patterns.push(...this.findStelliums(aspects));
    
    return patterns;
  }
  
  private findGrandTrines(aspects: Aspect[]): GrandTrine[] {
    // Algorithm to find 3 planets with 3 trine aspects forming triangle
    const trines = aspects.filter(a => a.type === 'trine');
    const grandTrines: GrandTrine[] = [];
    
    for (const trine1 of trines) {
      for (const trine2 of trines) {
        if (trine1.body2 === trine2.body1) {
          // Find closing trine
          const closing = trines.find(t => 
            t.body1 === trine2.body2 && t.body2 === trine1.body1
          );
          if (closing) {
            grandTrines.push({
              type: 'grand-trine',
              planets: [trine1.body1, trine1.body2, trine2.body2],
              element: this.determineElement(trine1.body1, trine1.body2, trine2.body2),
            });
          }
        }
      }
    }
    
    return grandTrines;
  }
}
```

## 6. Persistence Architecture

### Layered Storage
```typescript
interface PersistenceLayer {
  // Profiles - always local, encrypted
  saveProfile(profile: AstroProfile): Promise<void>;
  loadProfiles(): Promise<AstroProfile[]>;
  deleteProfile(id: string): Promise<void>;
  
  // Charts - can be recalculated, cache only
  saveChart(chart: NatalChart): Promise<void>;
  loadChart(id: string): Promise<NatalChart | null>;
  
  // Preferences - sync across devices
  savePreferences(prefs: AstrologyPreferences): Promise<void>;
  loadPreferences(): Promise<AstroPreferences>;
}

// Implementation with encryption for sensitive data
class SecurePersistence implements PersistenceLayer {
  private db: IDBDatabase;
  private encryption: EncryptionService;
  
  async saveProfile(profile: AstroProfile): Promise<void> {
    const encrypted = await this.encryption.encrypt(JSON.stringify(profile));
    await this.db.put('profiles', { id: profile.id, data: encrypted });
  }
}
```

## 7. Error Handling Strategy

### Error Types
```typescript
type AstroError = 
  | { type: 'CALCULATION_FAILED'; planet?: PlanetId; originalError: Error }
  | { type: 'WASM_LOAD_FAILED'; retryable: boolean }
  | { type: 'INVALID_BIRTH_DATA'; field: string; message: string }
  | { type: 'EPHEMERIS_DATA_MISSING'; date: Date }
  | { type: 'HOUSE_CALCULATION_FAILED'; latitude: number; reason: string };

// Error boundary for UI
class AstroErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <AstroErrorView error={this.state.error} onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

## 8. Performance Optimizations

### Memoization Strategy
```typescript
// Selectors are memoized
const selectChartWithDetails = createSelector(
  [selectChart, selectPlanets, selectAspects],
  (chart, planets, aspects) => ({
    ...chart,
    planetDetails: planets,
    aspectDetails: aspects,
  })
);

// Components memoized
const ChartWheel = React.memo(({ chart }: { chart: NatalChart }) => {
  // Only re-renders when chart reference changes
  return <svg>{/* chart rendering */}</svg>;
}, (prev, next) => prev.chart.id === next.chart.id);
```

### Lazy Loading
```typescript
// Heavy components loaded on demand
const TransitCalendar = lazy(() => import('./TransitCalendar'));
const SynastryCalculator = lazy(() => import('./SynastryCalculator'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/transits" element={<TransitCalendar />} />
        <Route path="/synastry" element={<SynastryCalculator />} />
      </Routes>
    </Suspense>
  );
}
```

## 9. Testing Architecture

### Unit Tests for Calculations
```typescript
describe('SwissEphemerisService', () => {
  it('calculates Sun position for known date', async () => {
    const sun = await service.calculatePlanet(
      new Date('1990-01-01T12:00:00Z'),
      'sun'
    );
    
    // Known value from NASA Horizons
    expect(sun.longitude).toBeCloseTo(280.5, 0);
    expect(sun.isRetrograde).toBe(false);
  });
  
  it('detects Mercury retrograde', async () => {
    const mercury = await service.calculatePlanet(
      new Date('2024-04-01T12:00:00Z'), // Known Rx period
      'mercury'
    );
    
    expect(mercury.isRetrograde).toBe(true);
    expect(mercury.speed).toBeLessThan(0);
  });
});
```

### Integration Tests
```typescript
describe('Chart Generation Flow', () => {
  it('generates complete natal chart', async () => {
    const store = createTestStore();
    
    await store.dispatch(createChart({
      name: 'Test',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      location: { lat: 40.7, lng: -74.0 },
    }));
    
    const state = store.getState();
    expect(state.astrology.entities.charts).toHaveLength(1);
    expect(state.astrology.ui.selectedProfileId).toBeDefined();
  });
});
```

## 10. Directory Structure

```
src/
├── astrology/
│   ├── index.ts                 # Public API
│   ├── types/
│   │   ├── core.ts              # CelestialBody, House, etc.
│   │   ├── chart.ts             # NatalChart, ChartParams
│   │   ├── profile.ts           # AstroProfile
│   │   └── index.ts             # Type exports
│   ├── services/
│   │   ├── swiss-ephemeris/
│   │   │   ├── engine.ts        # SwissEphemerisService
│   │   │   ├── wasm-loader.ts   # WASM initialization
│   │   │   ├── cache.ts         # Calculation cache
│   │   │   └── fallback.ts      # Keplerian fallback
│   │   ├── calculations/
│   │   │   ├── aspects.ts       # AspectCalculator
│   │   │   ├── houses.ts        # HouseCalculator
│   │   │   ├── patterns.ts      # PatternDetector
│   │   │   └── dignities.ts     # DignityCalculator
│   │   └── persistence/
│   │       ├── index.ts         # Persistence interface
│   │       ├── local-storage.ts # localStorage impl
│   │       └── indexed-db.ts    # IndexedDB impl
│   ├── store/
│   │   ├── slice.ts             # Redux slice
│   │   ├── selectors.ts         # Memoized selectors
│   │   ├── thunks.ts            # Async actions
│   │   └── middleware.ts        # Persistence middleware
│   ├── hooks/
│   │   ├── use-chart.ts         # Chart calculations
│   │   ├── use-transits.ts      # Transit watching
│   │   ├── use-swiss.ts         # WASM status
│   │   └── use-profile.ts       # Profile management
│   ├── components/
│   │   ├── containers/          # Smart components
│   │   │   ├── AstrologyHub.tsx
│   │   │   └── ChartContainer.tsx
│   │   ├── presentation/        # Dumb components
│   │   │   ├── ChartWheel.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── PlanetList.tsx
│   │   │   └── AspectChart.tsx
│   │   └── forms/
│   │       └── BirthChartForm.tsx
│   └── workers/
│       ├── chart-calculator.ts  # Web Worker
│       └── transit-searcher.ts  # Web Worker
```

## Implementation Plan

### Phase 1: Foundation (Week 1)
1. Type system implementation
2. Swiss Ephemeris WASM integration
3. Basic calculation services

### Phase 2: State Management (Week 2)
1. Redux store with proper types
2. Persistence layer
3. Error handling

### Phase 3: UI Architecture (Week 3)
1. Container components
2. Presentation components
3. Custom hooks

### Phase 4: Advanced Features (Week 4)
1. Pattern detection
2. Transit calculations
3. Educational content

### Phase 5: Polish (Week 5)
1. Performance optimization
2. Testing
3. Documentation

This architecture ensures:
- ✅ Type safety throughout
- ✅ Testability at all layers
- ✅ Performance with caching and workers
- ✅ Reliability with fallbacks
- ✅ Maintainability with clear separation
- ✅ Extensibility for future features
