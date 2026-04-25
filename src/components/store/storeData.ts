/**
 * HEKA Pro Store — Product Catalog & Subscription Tiers
 */

export type ProductCategory = 'certificate' | 'report' | 'routine' | 'physical';
export type PricingType = 'subscription' | 'one-time' | 'addon';

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  pricingType: PricingType;
  price: number;
  priceUnit: string; // 'USD', 'AUD', etc.
  includedWithPro: boolean;
  image?: string;
  features: string[];
  previewAvailable: boolean;
}

export interface SubscriptionTier {
  id: 'monthly' | 'yearly';
  name: string;
  price: number;
  period: string;
  savings?: string;
  features: string[];
  highlight?: boolean;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'monthly',
    name: 'HEKA Pro Monthly',
    price: 13,
    period: '/ month',
    features: [
      'Unlimited digital birth certificates',
      'Deep natal chart analysis',
      'Year-ahead transit forecasts',
      'Relationship compatibility reports',
      'AI routine builder',
      'Share birth charts with friends',
      'Advanced pattern detection',
      'Priority AI coach responses',
    ],
  },
  {
    id: 'yearly',
    name: 'HEKA Pro Yearly',
    price: 130,
    period: '/ year',
    savings: 'Save $26',
    highlight: true,
    features: [
      'Everything in Monthly',
      '2 free physical birth certificates',
      'Exclusive yearly solar return reading',
      'Early access to new features',
      'VIP community badge',
    ],
  },
];

export const STORE_PRODUCTS: StoreProduct[] = [
  // Birth Certificates
  {
    id: 'cert-digital',
    name: 'Digital Birth Certificate',
    description: 'A beautifully designed PDF birth certificate with your HEKA date, exact moon illumination, sidereal chart data, and constellation alignment.',
    category: 'certificate',
    pricingType: 'subscription',
    price: 0,
    priceUnit: 'USD',
    includedWithPro: true,
    features: ['PDF download', 'HEKA + civil date', 'Moon illumination %', 'Sidereal Sun/Moon signs', 'Rising sign', 'House cusps'],
    previewAvailable: true,
  },
  {
    id: 'cert-physical-standard',
    name: 'Physical Birth Certificate',
    description: 'A museum-quality physical print on archival paper, foil-stamped with your celestial data. Mailed to your door.',
    category: 'physical',
    pricingType: 'addon',
    price: 45,
    priceUnit: 'USD',
    includedWithPro: false,
    features: ['Archival 300gsm paper', 'Gold foil stamping', 'A4 size', 'Protective sleeve', 'Worldwide shipping'],
    previewAvailable: true,
  },
  {
    id: 'cert-physical-framed',
    name: 'Framed Birth Certificate',
    description: 'The physical certificate, professionally framed in solid oak with UV-protective glass. Ready to hang.',
    category: 'physical',
    pricingType: 'addon',
    price: 89,
    priceUnit: 'USD',
    includedWithPro: false,
    features: ['Solid oak frame', 'UV-protective glass', 'Certificate included', 'Ready to hang', 'Gift wrapping available'],
    previewAvailable: true,
  },
  // Reports
  {
    id: 'report-natal-deep',
    name: 'Deep Natal Analysis',
    description: 'A 5,000+ word comprehensive natal chart reading covering planets, houses, aspects, patterns, and life themes.',
    category: 'report',
    pricingType: 'subscription',
    price: 0,
    priceUnit: 'USD',
    includedWithPro: true,
    features: ['5,000+ words', 'All planets interpreted', 'House analysis', 'Aspect patterns', 'Life theme synthesis'],
    previewAvailable: true,
  },
  {
    id: 'report-year-ahead',
    name: 'Year-Ahead Transit Forecast',
    description: 'Personalized 12-month forecast of major transits, eclipses, and retrogrades affecting your chart.',
    category: 'report',
    pricingType: 'subscription',
    price: 0,
    priceUnit: 'USD',
    includedWithPro: true,
    features: ['12-month timeline', 'Major transits', 'Eclipse impacts', 'Retrograde guidance', 'Key dates calendar'],
    previewAvailable: true,
  },
  {
    id: 'report-compatibility',
    name: 'Relationship Compatibility',
    description: 'Synastry and composite chart analysis between two people. Understand the chemistry, challenges, and growth potential.',
    category: 'report',
    pricingType: 'subscription',
    price: 0,
    priceUnit: 'USD',
    includedWithPro: true,
    features: ['Synastry analysis', 'Composite chart', 'Chemistry score', 'Challenge areas', 'Growth potential'],
    previewAvailable: true,
  },
  // Routines
  {
    id: 'routine-ai-builder',
    name: 'AI Routine Builder',
    description: 'Answer a few questions about your goals, energy patterns, and constraints. Our AI builds a personalized routine and bakes it directly into your HEKA calendar.',
    category: 'routine',
    pricingType: 'subscription',
    price: 0,
    priceUnit: 'USD',
    includedWithPro: true,
    features: ['AI-powered Q&A', 'Calendar integration', 'Duration-based scheduling', 'Moon-phase alignment', 'Retrograde-aware pauses'],
    previewAvailable: false,
  },
  {
    id: 'routine-templates',
    name: 'Premium Routine Templates',
    description: 'A library of expert-crafted routines: morning rituals, creative blocks, study schedules, workout plans, and more.',
    category: 'routine',
    pricingType: 'subscription',
    price: 0,
    priceUnit: 'USD',
    includedWithPro: true,
    features: ['50+ templates', 'Celestial-aligned', 'Customizable', 'Category filtering', 'Community submissions'],
    previewAvailable: false,
  },
];

export function getProductsByCategory(category: ProductCategory): StoreProduct[] {
  return STORE_PRODUCTS.filter(p => p.category === category);
}

export function getProIncludedProducts(): StoreProduct[] {
  return STORE_PRODUCTS.filter(p => p.includedWithPro);
}

export function getAddonProducts(): StoreProduct[] {
  return STORE_PRODUCTS.filter(p => !p.includedWithPro);
}
