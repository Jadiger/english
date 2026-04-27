import type { UnitMeta, WordEntry } from '../../types';

export const intermediateUnit2: UnitMeta = {
  id: 'int-2',
  level: 'intermediate',
  title: 'Unit 2. Communication',
  description: 'Telefon, kezdesiw ham waqtqa baylanisli sozler.',
};

export const intermediateUnit2Words: WordEntry[] = [
  { id: 'phone', level: 'intermediate', unitId: intermediateUnit2.id, en: 'phone', kk: 'telefon' },
  { id: 'message', level: 'intermediate', unitId: intermediateUnit2.id, en: 'message', kk: 'xabar' },
  { id: 'question', level: 'intermediate', unitId: intermediateUnit2.id, en: 'question', kk: 'soraw' },
  { id: 'answer', level: 'intermediate', unitId: intermediateUnit2.id, en: 'answer', kk: 'juwap' },
  { id: 'time', level: 'intermediate', unitId: intermediateUnit2.id, en: 'time', kk: 'waqit' },
  { id: 'conversation', level: 'intermediate', unitId: intermediateUnit2.id, en: 'conversation', kk: 'angime' },
];
