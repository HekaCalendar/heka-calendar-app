/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    CELESTIAL BODY TRACKER - TYPE DEFINITIONS              ║
 * ║                                                                           ║
 * ║  Comprehensive biometrics & lifestyle tracking integrated with celestial  ║
 * ║  cycles. Track menstrual cycles, mood, sleep, medications, and more.     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ═════════════════════════════════════════════════════════════════════════════
// TRACKER ENTRY - Base type for all tracked data
// ═════════════════════════════════════════════════════════════════════════════

export interface TrackerEntry {
  /** Unique identifier */
  id: string;
  
  /** Date string (YYYY-MM-DD) */
  date: string;
  
  /** ISO timestamp when entry was created */
  timestamp: string;
  
  /** Type of tracker entry */
  type: TrackerType;
  
  /** The tracked data - varies by type */
  data: TrackerData;
  
  /** Optional notes */
  notes?: string;
  
  /** Celestial context when entry was recorded */
  celestialContext?: {
    moonPhase: string;
    moonSign: string;
    moonIllumination: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

export type TrackerType = 
  | 'menstrual'
  | 'mood'
  | 'sleep'
  | 'energy'
  | 'medication'
  | 'symptom'
  | 'exercise'
  | 'nutrition'
  | 'custom';

export type TrackerData = 
  | MenstrualData
  | MoodData
  | SleepData
  | EnergyData
  | MedicationData
  | SymptomData
  | ExerciseData
  | NutritionData
  | CustomData;

// ═════════════════════════════════════════════════════════════════════════════
// MENSTRUAL CYCLE TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface MenstrualData {
  /** Flow intensity */
  flow: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  
  /** Cervical mucus quality */
  cervicalMucus?: 'dry' | 'sticky' | 'creamy' | 'watery' | 'eggwhite';
  
  /** Basal body temperature in Celsius */
  temperature?: number;
  
  /** Ovulation test result */
  ovulationTest?: 'negative' | 'low' | 'peak' | 'positive';
  
  /** Pregnancy test result */
  pregnancyTest?: 'negative' | 'positive';
  
  /** Physical symptoms */
  symptoms: MenstrualSymptom[];
  
  /** Cycle day (calculated from previous period start) */
  cycleDay?: number;
  
  /** Whether this marks the start of a new cycle */
  isPeriodStart: boolean;
  
  /** Estimated period end date */
  estimatedEndDate?: string;
}

export type MenstrualSymptom = 
  | 'cramps'
  | 'bloating'
  | 'breast-tenderness'
  | 'headache'
  | 'backache'
  | 'acne'
  | 'fatigue'
  | 'mood-swings'
  | 'food-cravings'
  | 'insomnia'
  | 'nausea'
  | 'constipation'
  | 'diarrhea';

// ═════════════════════════════════════════════════════════════════════════════
// MOOD TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface MoodData {
  /** Primary mood rating (1-10) */
  rating: number;
  
  /** Mood category */
  mood: MoodType;
  
  /** Mood intensity (1-5) */
  intensity: number;
  
  /** Secondary moods (can have multiple) */
  secondaryMoods?: MoodType[];
  
  /** Emotional triggers or context */
  triggers?: string[];
  
  /** Time of day when mood was recorded */
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export type MoodType =
  | 'joyful'
  | 'grateful'
  | 'calm'
  | 'energetic'
  | 'focused'
  | 'content'
  | 'neutral'
  | 'tired'
  | 'anxious'
  | 'sad'
  | 'irritable'
  | 'overwhelmed'
  | 'angry'
  | 'depressed'
  | 'hopeful'
  | 'inspired'
  | 'romantic'
  | 'melancholy'
  | 'restless'
  | 'peaceful';

// ═════════════════════════════════════════════════════════════════════════════
// SLEEP TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface SleepData {
  /** Sleep duration in hours */
  duration: number;
  
  /** Sleep quality (1-5) */
  quality: number;
  
  /** Time went to bed (HH:MM) */
  bedtime?: string;
  
  /** Time woke up (HH:MM) */
  wakeTime?: string;
  
  /** Sleep latency (time to fall asleep in minutes) */
  sleepLatency?: number;
  
  /** Number of awakenings during night */
  awakenings?: number;
  
  /** Sleep phases if tracked via wearable */
  phases?: {
    deep?: number;      // minutes
    light?: number;
    rem?: number;
    awake?: number;
  };
  
  /** Sleep-related symptoms */
  symptoms?: ('insomnia' | 'nightmares' | 'restless-legs' | 'sleep-apnea' | 'snoring')[];
  
  /** Factors affecting sleep */
  factors?: ('caffeine' | 'alcohol' | 'exercise' | 'stress' | 'screen-time' | 'medication')[];
}

// ═════════════════════════════════════════════════════════════════════════════
// ENERGY LEVEL TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface EnergyData {
  /** Energy level (1-10) */
  level: number;
  
  /** Time of day */
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  /** Energy type */
  type: 'physical' | 'mental' | 'emotional' | 'spiritual';
  
  /** Contributing factors */
  factors?: string[];
}

// ═════════════════════════════════════════════════════════════════════════════
// MEDICATION TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface MedicationData {
  /** Medication name */
  name: string;
  
  /** Dosage */
  dosage: string;
  
  /** Time taken (HH:MM) */
  time: string;
  
  /** Whether medication was taken */
  taken: boolean;
  
  /** Reason for medication */
  reason?: string;
  
  /** Side effects experienced */
  sideEffects?: string[];
  
  /** Prescription category */
  category?: 'prescription' | 'supplement' | 'otc' | 'herbal' | 'vitamin';
}

// ═════════════════════════════════════════════════════════════════════════════
// SYMPTOM TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface SymptomData {
  /** Primary symptom */
  symptom: string;
  
  /** Body area affected */
  bodyArea?: BodyArea;
  
  /** Severity (1-10) */
  severity: number;
  
  /** Duration in hours */
  duration?: number;
  
  /** Whether symptom is ongoing */
  isOngoing: boolean;
  
  /** Triggers */
  triggers?: string[];
  
  /** Relief measures taken */
  reliefMeasures?: string[];
}

export type BodyArea =
  | 'head'
  | 'neck'
  | 'chest'
  | 'stomach'
  | 'back'
  | 'abdomen'
  | 'pelvis'
  | 'arms'
  | 'legs'
  | 'skin'
  | 'general';

// ═════════════════════════════════════════════════════════════════════════════
// EXERCISE TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface ExerciseData {
  /** Exercise type */
  type: ExerciseType;
  
  /** Duration in minutes */
  duration: number;
  
  /** Intensity (1-5) */
  intensity: number;
  
  /** Calories burned (if known) */
  calories?: number;
  
  /** Distance (if applicable, in km) */
  distance?: number;
  
  /** Steps (if applicable) */
  steps?: number;
  
  /** Heart rate data */
  heartRate?: {
    average?: number;
    max?: number;
    min?: number;
  };
  
  /** How you felt after */
  perceivedEffort?: number; // 1-10
}

export type ExerciseType =
  | 'walking'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'yoga'
  | 'pilates'
  | 'strength'
  | 'cardio'
  | 'hiit'
  | 'dance'
  | 'sports'
  | 'hiking'
  | 'stretching'
  | 'other';

// ═════════════════════════════════════════════════════════════════════════════
// NUTRITION TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface NutritionData {
  /** Meal type */
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  
  /** Foods consumed */
  foods: string[];
  
  /** Calories (if tracked) */
  calories?: number;
  
  /** Macronutrients (grams) */
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  
  /** Water intake in liters */
  water?: number;
  
  /** How you felt after eating */
  satiety?: number; // 1-5
  
  /** Digestive symptoms */
  digestiveSymptoms?: ('bloating' | 'gas' | 'heartburn' | 'nausea' | 'cramps')[];
}

// ═════════════════════════════════════════════════════════════════════════════
// CUSTOM TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export interface CustomData {
  /** Custom tracker name */
  trackerName: string;
  
  /** Custom value (string, number, or boolean) */
  value: string | number | boolean;
  
  /** Unit of measurement */
  unit?: string;
  
  /** Icon for the custom tracker */
  icon?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// TRACKER STATE
// ═════════════════════════════════════════════════════════════════════════════

export interface TrackerState {
  /** All tracker entries keyed by ID */
  entries: Record<string, TrackerEntry>;
  
  /** Entry IDs grouped by date for quick lookup */
  entriesByDate: Record<string, string[]>; // date -> entryIds[]
  
  /** Currently selected tracker type */
  selectedTracker: TrackerType | 'all';
  
  /** Currently viewing date */
  selectedDate: string;
  
  /** Menstrual cycle configuration */
  menstrualConfig?: MenstrualConfig;
  
  /** Enabled trackers */
  enabledTrackers: TrackerType[];
  
  /** Custom tracker definitions */
  customTrackers: CustomTrackerDefinition[];
  
  /** UI state */
  ui: {
    isLoading: boolean;
    viewMode: 'day' | 'week' | 'month' | 'cycle';
    showPredictions: boolean;
  };
}

export interface MenstrualConfig {
  /** Average cycle length in days */
  averageCycleLength: number;
  /** Average period length in days */
  averagePeriodLength: number;
  /** First day of last period (YYYY-MM-DD) */
  lastPeriodStart: string;
  /** Whether user is tracking fertility */
  trackFertility: boolean;
  /** Whether user is trying to conceive */
  tryingToConceive: boolean;
  /** Birth control method if any */
  birthControl?: string;
}

export interface CustomTrackerDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  dataType: 'number' | 'text' | 'boolean' | 'select' | 'multi-select';
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
}

// ═════════════════════════════════════════════════════════════════════════════
// CYCLE PREDICTIONS & INSIGHTS
// ═════════════════════════════════════════════════════════════════════════════

export interface CyclePrediction {
  /** Next period start date */
  nextPeriodStart: string;
  
  /** Next period end date */
  nextPeriodEnd: string;
  
  /** Fertile window start */
  fertileWindowStart?: string;
  
  /** Fertile window end */
  fertileWindowEnd?: string;
  
  /** Estimated ovulation date */
  estimatedOvulation?: string;
  
  /** PMS window start */
  pmsWindowStart?: string;
  
  /** Confidence level based on data history */
  confidence: 'high' | 'medium' | 'low';
  
  /** Days of data used for prediction */
  cyclesAnalyzed: number;
}

export interface CycleInsight {
  /** Type of insight */
  type: 'pattern' | 'correlation' | 'prediction' | 'suggestion';
  
  /** Insight title */
  title: string;
  
  /** Insight description */
  description: string;
  
  /** Related celestial event if any */
  celestialCorrelation?: {
    event: string;
    strength: number; // 0-1
  };
  
  /** Actionable suggestion */
  suggestion?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

export const TRACKER_CONFIG = {
  // Default cycle length if not enough data
  DEFAULT_CYCLE_LENGTH: 28,
  DEFAULT_PERIOD_LENGTH: 5,
  
  // Luteal phase is typically 14 days
  LUTEAL_PHASE_DAYS: 14,
  
  // Fertile window is typically 6 days (5 days before + day of ovulation)
  FERTILE_WINDOW_DAYS: 6,
  
  // PMS window is typically 7-14 days before period
  PMS_WINDOW_DAYS: 7,
  
  // Minimum cycles for reliable predictions
  MIN_CYCLES_FOR_PREDICTION: 3,
} as const;

export const MOOD_SCALE: { value: number; label: string; emoji: string }[] = [
  { value: 1, label: 'Very Low', emoji: '😢' },
  { value: 2, label: 'Low', emoji: '😔' },
  { value: 3, label: 'Below Average', emoji: '😕' },
  { value: 4, label: 'Slightly Low', emoji: '😐' },
  { value: 5, label: 'Neutral', emoji: '😶' },
  { value: 6, label: 'Okay', emoji: '🙂' },
  { value: 7, label: 'Good', emoji: '😊' },
  { value: 8, label: 'Great', emoji: '😄' },
  { value: 9, label: 'Excellent', emoji: '🤩' },
  { value: 10, label: 'Amazing', emoji: '✨' },
];

export const ENERGY_SCALE: { value: number; label: string; emoji: string }[] = [
  { value: 1, label: 'Exhausted', emoji: '🔋' },
  { value: 2, label: 'Very Low', emoji: '😫' },
  { value: 3, label: 'Low', emoji: '😪' },
  { value: 4, label: 'Below Average', emoji: '😓' },
  { value: 5, label: 'Moderate', emoji: '💫' },
  { value: 6, label: 'Okay', emoji: '⚡' },
  { value: 7, label: 'Good', emoji: '💪' },
  { value: 8, label: 'High', emoji: '🔥' },
  { value: 9, label: 'Very High', emoji: '🚀' },
  { value: 10, label: 'Peak', emoji: '⚡️' },
];

export const FLOW_OPTIONS: { value: MenstrualData['flow']; label: string; emoji: string }[] = [
  { value: 'none', label: 'None', emoji: '◯' },
  { value: 'spotting', label: 'Spotting', emoji: '•' },
  { value: 'light', label: 'Light', emoji: '◐' },
  { value: 'medium', label: 'Medium', emoji: '◑' },
  { value: 'heavy', label: 'Heavy', emoji: '◉' },
];

export const SLEEP_QUALITY_OPTIONS: { value: number; label: string; emoji: string }[] = [
  { value: 1, label: 'Terrible', emoji: '😫' },
  { value: 2, label: 'Poor', emoji: '😴' },
  { value: 3, label: 'Okay', emoji: '😶' },
  { value: 4, label: 'Good', emoji: '😌' },
  { value: 5, label: 'Excellent', emoji: '✨' },
];
