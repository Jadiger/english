import type { UnitMeta, WordEntry } from '../../types';

export const intermediateUnit1: UnitMeta = {
  id: 'int-1',
  level: 'intermediate',
  title: 'Unit 1. Work life',
  description: 'Kense, joba ham jumis ortasi.',
};

export const intermediateUnit1Words: WordEntry[] = [
  { id: 'office', level: 'intermediate', unitId: intermediateUnit1.id, en: 'office', kk: 'kense' },
  { id: 'job', level: 'intermediate', unitId: intermediateUnit1.id, en: 'job', kk: 'jumis' },
  { id: 'project', level: 'intermediate', unitId: intermediateUnit1.id, en: 'project', kk: 'joybar' },
  { id: 'meeting', level: 'intermediate', unitId: intermediateUnit1.id, en: 'meeting', kk: 'jiyin' },
  { id: 'manager', level: 'intermediate', unitId: intermediateUnit1.id, en: 'manager', kk: 'basshi' },
  { id: 'salary', level: 'intermediate', unitId: intermediateUnit1.id, en: 'salary', kk: 'ayliq' },
];
