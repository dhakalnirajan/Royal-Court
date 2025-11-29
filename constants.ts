import { RoleDef, RoleType, Settings } from './types';

export const ROLES: Record<RoleType, RoleDef> = {
  Raja: { 
    id: 'Raja',
    names: { NEPALI: 'Raja', ENGLISH: 'King' },
    points: 2000, 
    priority: 8, 
    description: 'The Ruler. Reveals first. Always scores 2000.',
    objective: 'Protect your kingdom and ensure lawful order prevails',
    abilities: ['First revelation', 'Point security'],
    icon: 'Crown'
  },
  Rani: { 
    id: 'Rani',
    names: { NEPALI: 'Rani', ENGLISH: 'Queen' },
    points: 1800, 
    priority: 7, 
    description: 'The High Royal. Supports the Raja.',
    objective: 'Support the Raja and maintain royal authority',
    abilities: ['High point value', 'Royal protection'],
    icon: 'Heart'
  },
  Mantri: { 
    id: 'Mantri',
    names: { NEPALI: 'Mantri', ENGLISH: 'Minister' },
    points: 1500, 
    priority: 6, 
    description: 'The Advisor. Guides the court.',
    objective: 'Guide the court with wisdom and strategic counsel',
    abilities: ['Moderate point value', 'Advisory position'],
    icon: 'Scroll'
  },
  Senapati: { 
    id: 'Senapati',
    names: { NEPALI: 'Senapati', ENGLISH: 'General' },
    points: 1200, 
    priority: 5, 
    description: 'The Commander. Protects the realm.',
    objective: 'Defend the royal court from internal threats',
    abilities: ['Military authority', 'Moderate protection'],
    icon: 'Sword'
  },
  Police: { 
    id: 'Police',
    names: { NEPALI: 'Prahari', ENGLISH: 'Police' },
    points: 800, 
    priority: 4, 
    description: 'The Investigator. Must find the Chor to score.',
    objective: 'Identify and accuse the Chor before they escape',
    abilities: ['Investigation power', 'Single accusation'],
    icon: 'Shield'
  },
  Courtesan: { 
    id: 'Courtesan',
    names: { NEPALI: 'Nartak', ENGLISH: 'Courtesan' },
    points: 400, 
    priority: 3, 
    description: 'The Entertainer. Neutral observer.',
    objective: 'Navigate court politics while maintaining neutrality',
    abilities: ['Low risk', 'Neutral position'],
    icon: 'Music'
  },
  Praja: { 
    id: 'Praja',
    names: { NEPALI: 'Praja', ENGLISH: 'Citizen' },
    points: 200, 
    priority: 2, 
    description: 'The Citizen. Common folk.',
    objective: 'Survive the court intrigue with minimal losses',
    abilities: ['Minimal risk', 'Commoner perspective'],
    icon: 'User'
  },
  Chor: { 
    id: 'Chor',
    names: { NEPALI: 'Chor', ENGLISH: 'Thief' },
    points: 0, 
    priority: 1, 
    description: 'The Criminal. Steals 800 points if Police fails.',
    objective: 'Evade detection and undermine the Police investigation',
    abilities: ['Deception', 'Point reversal'],
    icon: 'Skull'
  }
};

export const DEFAULT_SETTINGS: Settings = {
  language: 'NEPALI',
  masterVolume: 0.5,
  sfxVolume: 1.0,
  musicVolume: 0.5
};

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 8;

export const PLAYER_COLORS = [
  "#dc2626", // Red
  "#2563eb", // Blue
  "#16a34a", // Green
  "#d97706", // Amber
  "#9333ea", // Purple
  "#0891b2", // Cyan
  "#db2777", // Pink
  "#65a30d"  // Lime
];

export const PLAYER_ICONS = [
  'Crown', 'Shield', 'Sword', 'Scroll', 'Key', 'Coins', 'Flag', 'Gem'
];

export const PLAYER_ICON_LABELS: Record<string, string> = {
  Crown: 'Leader',
  Shield: 'Guard',
  Sword: 'Fighter',
  Scroll: 'Scholar',
  Key: 'Keeper',
  Coins: 'Merchant',
  Flag: 'Herald',
  Gem: 'Noble'
};

export const STORAGE_KEY_SCORES = 'royalCourtScores';
