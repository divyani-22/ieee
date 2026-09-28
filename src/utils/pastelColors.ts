export type PastelColorKey = 'mint' | 'lavender' | 'yellow' | 'periwinkle' | 'peach' | 'pink';

export interface PastelConfig {
  name: string;
  front: string;
  back: string;
  accent: string;
  badge: string;
  dark: string;
  ring: string;
  hover: string;
  watermark: string;
}

export const PASTEL_PALETTE: Record<PastelColorKey, PastelConfig> = {
  mint: {
    name: 'Mint',
    front: '#D6EAE1',
    back: '#C2E2D4',
    accent: '#A8D5C2',
    badge: '#E8F5EF',
    dark: '#3A7560',
    ring: '#A8D5C2',
    hover: 'rgba(214, 234, 225, 0.4)',
    watermark: 'rgba(58, 117, 96, 0.08)',
  },
  lavender: {
    name: 'Lavender',
    front: '#D9CDEE',
    back: '#C7B4E5',
    accent: '#B9A6E3',
    badge: '#EDE7F8',
    dark: '#5C4394',
    ring: '#B9A6E3',
    hover: 'rgba(217, 205, 238, 0.4)',
    watermark: 'rgba(92, 67, 148, 0.08)',
  },
  yellow: {
    name: 'Butter Yellow',
    front: '#FCE6A6',
    back: '#F6D884',
    accent: '#E5CB82',
    badge: '#FEF6DC',
    dark: '#947214',
    ring: '#E5CB82',
    hover: 'rgba(252, 230, 166, 0.4)',
    watermark: 'rgba(148, 114, 20, 0.08)',
  },
  periwinkle: {
    name: 'Periwinkle',
    front: '#CFD3F0',
    back: '#B9BFEC',
    accent: '#A9B4EB',
    badge: '#E8EBF8',
    dark: '#404C95',
    ring: '#A9B4EB',
    hover: 'rgba(207, 211, 240, 0.4)',
    watermark: 'rgba(64, 76, 149, 0.08)',
  },
  peach: {
    name: 'Soft Peach',
    front: '#F9D9CF',
    back: '#F3C2B4',
    accent: '#F2B8A8',
    badge: '#FDEEEA',
    dark: '#A6482F',
    ring: '#F2B8A8',
    hover: 'rgba(249, 217, 207, 0.4)',
    watermark: 'rgba(166, 72, 47, 0.08)',
  },
  pink: {
    name: 'Soft Pink',
    front: '#F5D3E3',
    back: '#EDB9D1',
    accent: '#E8ADC5',
    badge: '#FBEBF2',
    dark: '#9C3A68',
    ring: '#E8ADC5',
    hover: 'rgba(245, 211, 227, 0.4)',
    watermark: 'rgba(156, 58, 104, 0.08)',
  },
};

export const PASTEL_ORDER: PastelColorKey[] = ['mint', 'lavender', 'yellow', 'periwinkle', 'peach', 'pink'];

/**
 * Returns a pastel color key deterministically by index.
 */
export function getPastelByIndex(index: number): PastelColorKey {
  return PASTEL_ORDER[Math.abs(index) % PASTEL_ORDER.length];
}

/**
 * Returns a pastel color key deterministically by string seed (e.g. topic name, card ID, etc.).
 */
export function getPastelBySeed(seed: string | number): PastelColorKey {
  if (typeof seed === 'number') return getPastelByIndex(seed);
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return PASTEL_ORDER[Math.abs(hash) % PASTEL_ORDER.length];
}

/**
 * Get config for a pastel color key
 */
export function getPastelConfig(key?: PastelColorKey): PastelConfig {
  if (!key || !PASTEL_PALETTE[key]) {
    return PASTEL_PALETTE.mint;
  }
  return PASTEL_PALETTE[key];
}
