import type { UnitMeta, WordEntry } from '../../types';

export const elementaryUnit2: UnitMeta = {
  id: 'el-2',
  level: 'elementary',
  title: 'Unit 2. City and travel',
  description: 'Qala, kolik ham sayahat sozleri.',
};

export const elementaryUnit2Words: WordEntry[] = [
  { id: 'city', level: 'elementary', unitId: elementaryUnit2.id, en: 'city', kk: 'qala' },
  { id: 'street', level: 'elementary', unitId: elementaryUnit2.id, en: 'street', kk: 'koshe' },
  { id: 'car', level: 'elementary', unitId: elementaryUnit2.id, en: 'car', kk: 'mashina' },
  { id: 'bus', level: 'elementary', unitId: elementaryUnit2.id, en: 'bus', kk: 'avtobus' },
  { id: 'ticket', level: 'elementary', unitId: elementaryUnit2.id, en: 'ticket', kk: 'bilet' },
  { id: 'map', level: 'elementary', unitId: elementaryUnit2.id, en: 'map', kk: 'karta' },
];
