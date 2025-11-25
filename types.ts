export type RoleType = 'Raja' | 'Rani' | 'Mantri' | 'Senapati' | 'Police' | 'Courtesan' | 'Praja' | 'Chor';

export type Language = 'HINDI' | 'ENGLISH';

export interface RoleDef {
  id: RoleType;
  names: {
    HINDI: string;
    ENGLISH: string;
  };
  points: number;
  priority: number;
  description: string;
  objective: string;
  abilities: string[];
  icon: string;
}

export interface Player {
  id: string;
  name: string;
  role?: RoleType;
  color: string;
  icon: string;
  score: number;
  roundsPlayed: number;
  wins: number;
  isRevealed: boolean; // Has the player seen their own card?
  isPubliclyRevealed: boolean; // Has the role been revealed to everyone?
}

export type GamePhase = 
  | 'SETUP' 
  | 'DISTRIBUTION' 
  | 'REVEAL_RAJA' 
  | 'REVEAL_POLICE' 
  | 'GUESSING' 
  | 'ROUND_END';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentRound: number;
  policeId: string | null;
  chorId: string | null;
  rajaId: string | null;
  message: string;
}

export interface Settings {
  language: Language;
  masterVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
}

export type View = 'LANDING' | 'GAME' | 'RULES' | 'SCOREBOARD' | 'SETTINGS' | 'SETUP';

export type SoundEffectType = 'CARD_FLIP' | 'SUCCESS' | 'FAILURE' | 'GAME_START' | 'ROUND_END' | 'CLICK';

export interface ScoreData {
  name: string;
  roundsPlayed: number;
  totalScore: number;
  wins: number;
  lastPlayed: string;
}
