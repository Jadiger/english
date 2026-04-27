import type { LevelId, QuizQuestion, WordEntry } from './types';
import { beginnerUnit1, beginnerUnit1Words } from './words/beginner/unit1';
import { beginnerUnit2, beginnerUnit2Words } from './words/beginner/unit2';
import { beginnerUnit3, beginnerUnit3Words } from './words/beginner/unit3';
import { beginnerUnit4, beginnerUnit4Words } from './words/beginner/unit4';


export const levelLabels: Record<LevelId, string> = {
  beginner: 'Beginner'
  // elementary: 'Elementary',
  // intermediate: 'Intermediate',
};

export const units = [
  beginnerUnit1,
  beginnerUnit2,
  beginnerUnit3,
  beginnerUnit4
  // elementaryUnit1,
  // elementaryUnit2,
  // intermediateUnit1,
  // intermediateUnit2,
];

export const words: WordEntry[] = [
  ...beginnerUnit1Words,
  ...beginnerUnit2Words,
  ...beginnerUnit3Words,
  ...beginnerUnit4Words
];

export function getUnitById(unitId: string) {
  return units.find((unit) => unit.id === unitId);
}

export function getUnitsByLevel(level: LevelId) {
  return units.filter((unit) => unit.level === level);
}

export function getWordsByLevel(level: LevelId) {
  return words.filter((word) => word.level === level);
}

export function getWordsByUnit(unitId: string) {
  return words.filter((word) => word.unitId === unitId);
}

export function getRandomQuizQuestions(sourceWords: WordEntry[], total = 10): QuizQuestion[] {
  const availableWords = sourceWords.length > 0 ? sourceWords : words;
  const questionCount = Math.min(total, availableWords.length);
  const shuffled = [...availableWords].sort(() => Math.random() - 0.5).slice(0, questionCount);

  return shuffled.map((word, index) => {
    const direction = index % 2 === 0 ? 'en-to-kk' : 'kk-to-en';
    const correctAnswer = direction === 'en-to-kk' ? word.kk : word.en;
    const prompt = direction === 'en-to-kk' ? word.en : word.kk;
    const distractors = getQuizDistractors(word, direction, availableWords);
    const options = shuffleArray([...new Set([...distractors, correctAnswer])]).slice(0, 4);

    return {
      prompt,
      correctAnswer,
      options,
      direction,
    };
  });
}

export function getWrittenQuizQuestions(sourceWords: WordEntry[], total = 10): QuizQuestion[] {
  const availableWords = sourceWords.length > 0 ? sourceWords : words;
  const questionCount = Math.min(total, availableWords.length);
  const shuffled = shuffleArray(availableWords).slice(0, questionCount);

  return shuffled.map((word) => ({
    prompt: word.kk,
    correctAnswer: word.en,
    options: [],
    direction: 'kk-to-en',
  }));
}

function getQuizDistractors(
  word: WordEntry,
  direction: QuizQuestion['direction'],
  sourceWords: WordEntry[]
) {
  const answerValue = direction === 'en-to-kk' ? word.kk : word.en;
  const sourcePool = sourceWords.filter((item) => item.id !== word.id);
  const levelPool = words.filter((item) => item.id !== word.id && item.level === word.level);
  const unitPool = words.filter((item) => item.id !== word.id && item.unitId === word.unitId);
  const fallbackPool = words.filter((item) => item.id !== word.id);

  const mergedCandidates = uniqueWords([
    ...unitPool,
    ...sourcePool,
    ...levelPool,
    ...fallbackPool,
  ]);

  const rankedCandidates = mergedCandidates
    .map((candidate) => ({
      candidate,
      score: getDistractorScore(
        answerValue,
        direction === 'en-to-kk' ? candidate.kk : candidate.en,
        candidate,
        word
      ),
    }))
    .sort((left, right) => right.score - left.score);

  return rankedCandidates
    .slice(0, 8)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(({ candidate }) => (direction === 'en-to-kk' ? candidate.kk : candidate.en));
}

function getDistractorScore(answer: string, candidateValue: string, candidate: WordEntry, currentWord: WordEntry) {
  const normalizedAnswer = answer.toLowerCase();
  const normalizedCandidate = candidateValue.toLowerCase();
  const answerTokens = normalizedAnswer.split(/\s+/).filter(Boolean);
  const candidateTokens = normalizedCandidate.split(/\s+/).filter(Boolean);
  const sharedTokenCount = candidateTokens.filter((token) => answerTokens.includes(token)).length;
  const sharedPrefixLength = getSharedPrefixLength(normalizedAnswer, normalizedCandidate);
  const lengthDistance = Math.abs(normalizedAnswer.length - normalizedCandidate.length);

  let score = 0;

  if (candidate.unitId === currentWord.unitId) {
    score += 5;
  }

  if (candidate.level === currentWord.level) {
    score += 3;
  }

  score += Math.max(0, 8 - lengthDistance);
  score += Math.min(sharedPrefixLength, 4) * 2;
  score += sharedTokenCount * 3;

  if (candidateTokens.length === answerTokens.length) {
    score += 2;
  }

  return score;
}

function getSharedPrefixLength(left: string, right: string) {
  const limit = Math.min(left.length, right.length);
  let index = 0;

  while (index < limit && left[index] === right[index]) {
    index += 1;
  }

  return index;
}

function uniqueWords(items: WordEntry[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
