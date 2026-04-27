import type { UnitMeta, WordEntry } from '../../types';

export const elementaryUnit1: UnitMeta = {
  id: 'el-1',
  level: 'elementary',
  title: 'Unit 1. School and study',
  description: 'Sabak, mektep ham oqiw sozleri.',
};

export const elementaryUnit1Words: WordEntry[] = [
  { id: 'book', level: 'elementary', unitId: elementaryUnit1.id, en: 'book', kk: 'kitap', note: 'Oqiw ushin qollaniladi.' },
  { id: 'pen', level: 'elementary', unitId: elementaryUnit1.id, en: 'pen', kk: 'qalem' },
  { id: 'school', level: 'elementary', unitId: elementaryUnit1.id, en: 'school', kk: 'mektep' },
  { id: 'teacher', level: 'elementary', unitId: elementaryUnit1.id, en: 'teacher', kk: 'mugallim' },
  { id: 'student', level: 'elementary', unitId: elementaryUnit1.id, en: 'student', kk: 'oqiwshi' },
  { id: 'lesson', level: 'elementary', unitId: elementaryUnit1.id, en: 'lesson', kk: 'sabaq' },
];
