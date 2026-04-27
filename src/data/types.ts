export interface WordPair {
  en: string;
  kk: string;
  phonetic?: string;
}

export type LevelId = 'beginner'
// export type LevelId = 'beginner' | 'elementary' | 'intermediate';

export interface WordEntry extends WordPair {
  id: string;
  level: LevelId;
  unitId: string;
  note?: string;
}

export interface UnitMeta {
  id: string;
  level: LevelId;
  title: string;
  description: string;
}

export interface QuizQuestion {
  prompt: string;
  correctAnswer: string;
  options: string[];
  direction: 'en-to-kk' | 'kk-to-en';
}
