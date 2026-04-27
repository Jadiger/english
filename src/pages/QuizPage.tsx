import { Badge, Button, Card, Group, Progress, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { BookOpenCheck, CheckCircle2, CircleX, Keyboard, Layers3, ListChecks, PencilLine, PlayCircle, Shapes, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRandomQuizQuestions, getUnitById, getUnitsByLevel, getWordsByLevel, getWordsByUnit, getWrittenQuizQuestions, levelLabels, units, words } from '../data/words';
import type { LevelId, QuizQuestion, WordEntry } from '../data/types';

type QuizMode = 'all' | 'level' | 'unit';
type QuizFormat = 'multiple-choice' | 'written';
const QUIZ_COUNT_STEPS = [10, 20, 30, 40, 50];

function buildQuiz(
  t: (key: string, options?: Record<string, unknown>) => string,
  mode: QuizMode,
  format: QuizFormat,
  questionCount: number,
  level?: LevelId,
  unitId?: string
) {
  let sourceWords: WordEntry[] = words;
  let label = t('quizPage.globalLabel');

  if (mode === 'level' && level) {
    sourceWords = getWordsByLevel(level);
    label = t('quizPage.levelSessionLabel', { level: t(`levels.${level}`) });
  }

  if (mode === 'unit' && unitId) {
    sourceWords = getWordsByUnit(unitId);
    const unit = getUnitById(unitId);
    label = unit ? unit.title : 'Unit quiz';
  }

  return {
    mode,
    format,
    label,
    questions:
      format === 'written'
        ? getWrittenQuizQuestions(sourceWords, questionCount)
        : getRandomQuizQuestions(sourceWords, questionCount),
  };
}

export function QuizPage() {
  const { t } = useTranslation();
  const [quizMode, setQuizMode] = useState<QuizMode>('all');
  const [quizFormat, setQuizFormat] = useState<QuizFormat>('multiple-choice');
  const [selectedLevel, setSelectedLevel] = useState<string>('beginner');
  const [selectedUnit, setSelectedUnit] = useState<string>(units[0]?.id ?? '');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<string>('10');
  const [session, setSession] = useState<{
    mode: QuizMode;
    format: QuizFormat;
    label: string;
    questions: QuizQuestion[];
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedSeconds, setCompletedSeconds] = useState<number | null>(null);
  const [answerHistory, setAnswerHistory] = useState<Array<{ question: QuizQuestion; selectedAnswer: string }>>([]);

  const questions = session?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const isFinished = session !== null && currentIndex >= questions.length;
  const availableWords = getAvailableWords(quizMode, selectedLevel as LevelId, selectedUnit);
  const questionCountOptions = getQuestionCountOptions(availableWords.length).map((count) => ({
    label: String(count),
    value: String(count),
  }));
  const normalizedQuestionCount =
    questionCountOptions.find((option) => option.value === selectedQuestionCount)?.value ?? questionCountOptions[0]?.value ?? '0';

  const startQuiz = () => {
    const nextSession = buildQuiz(
      t,
      quizMode,
      quizFormat,
      Number(normalizedQuestionCount),
      quizMode === 'level' ? (selectedLevel as LevelId) : undefined,
      quizMode === 'unit' ? selectedUnit : undefined
    );

    setSession(nextSession);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setWrittenAnswer('');
    setScore(0);
    setStartedAt(Date.now());
    setCompletedSeconds(null);
    setAnswerHistory([]);
  };

  const restartQuiz = () => {
    if (!session) {
      return;
    }

    const nextSession = buildQuiz(
      t,
      session.mode,
      session.format,
      questions.length,
      session.mode === 'level' ? (selectedLevel as LevelId) : undefined,
      session.mode === 'unit' ? selectedUnit : undefined
    );

    setSession(nextSession);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setWrittenAnswer('');
    setScore(0);
    setStartedAt(Date.now());
    setCompletedSeconds(null);
    setAnswerHistory([]);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer || !currentQuestion) {
      return;
    }

    setSelectedAnswer(option);
    setAnswerHistory((value) => [...value, { question: currentQuestion, selectedAnswer: option }]);

    if (option === currentQuestion.correctAnswer) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1 && startedAt) {
      setCompletedSeconds(Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
    }

    setSelectedAnswer(null);
    setWrittenAnswer('');
    setCurrentIndex((value) => value + 1);
  };

  const handleWrittenSubmit = () => {
    if (selectedAnswer || !currentQuestion) {
      return;
    }

    const answer = writtenAnswer.trim();

    if (!answer) {
      return;
    }

    setSelectedAnswer(answer);
    setAnswerHistory((value) => [...value, { question: currentQuestion, selectedAnswer: answer }]);

    if (normalizeAnswer(answer) === normalizeAnswer(currentQuestion.correctAnswer)) {
      setScore((value) => value + 1);
    }
  };

  if (!session) {
    const levelUnitOptions = getUnitsByLevel(selectedLevel as LevelId).map((unit) => ({
      label: unit.title,
      value: unit.id,
    }));

    return (
      <Stack gap="xl">
        <div>
          <Text className="section-kicker">{t('quizPage.kicker')}</Text>
          <Title order={1}>{t('quizPage.setupTitle')}</Title>
          <Text c="dimmed" mt="sm">
            {t('quizPage.setupDescription')}
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <ModeCard
            icon={Sparkles}
            title={t('quizPage.allTitle')}
            description={t('quizPage.allDescription')}
            active={quizMode === 'all'}
            onClick={() => setQuizMode('all')}
          />
          <ModeCard
            icon={Layers3}
            title={t('quizPage.levelModeTitle')}
            description={t('quizPage.levelModeDescription')}
            active={quizMode === 'level'}
            onClick={() => setQuizMode('level')}
          />
          <ModeCard
            icon={ListChecks}
            title={t('quizPage.unitModeTitle')}
            description={t('quizPage.unitModeDescription')}
            active={quizMode === 'unit'}
            onClick={() => setQuizMode('unit')}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <ModeCard
            icon={ListChecks}
            title={t('quizPage.multipleChoiceTitle')}
            description={t('quizPage.multipleChoiceDescription')}
            active={quizFormat === 'multiple-choice'}
            onClick={() => setQuizFormat('multiple-choice')}
          />
          <ModeCard
            icon={Keyboard}
            title={t('quizPage.writtenTitle')}
            description={t('quizPage.writtenDescription')}
            active={quizFormat === 'written'}
            onClick={() => setQuizFormat('written')}
          />
        </SimpleGrid>

        <Card className="panel-card filters-card app-toolbar-card" radius="lg" padding="lg">
          <Stack gap="md">
            {quizMode === 'level' ? (
              <Select
                label={t('quizPage.chooseLevel')}
                data={Object.keys(levelLabels).map((value) => ({ value, label: t(`levels.${value}`) }))}
                value={selectedLevel}
                onChange={(value) => setSelectedLevel(value ?? 'beginner')}
                leftSection={<Shapes size={16} strokeWidth={2.2} />}
              />
            ) : null}

            {quizMode === 'unit' ? (
              <>
                <Select
                  label={t('quizPage.chooseLevel')}
                  data={Object.keys(levelLabels).map((value) => ({ value, label: t(`levels.${value}`) }))}
                  value={selectedLevel}
                  onChange={(value) => {
                    const nextLevel = value ?? 'beginner';
                    setSelectedLevel(nextLevel);
                    const nextUnits = getUnitsByLevel(nextLevel as LevelId);
                    setSelectedUnit(nextUnits[0]?.id ?? '');
                  }}
                  leftSection={<Shapes size={16} strokeWidth={2.2} />}
                />
                <Select
                  label={t('quizPage.chooseUnit')}
                  data={levelUnitOptions}
                  value={selectedUnit}
                  onChange={(value) => setSelectedUnit(value ?? '')}
                  leftSection={<BookOpenCheck size={16} strokeWidth={2.2} />}
                />
              </>
            ) : null}

            <Select
              label={t('quizPage.questionCountLabel')}
              data={questionCountOptions}
              value={normalizedQuestionCount}
              onChange={(value) => setSelectedQuestionCount(value ?? normalizedQuestionCount)}
              leftSection={<ListChecks size={16} strokeWidth={2.2} />}
            />

            <Text c="dimmed" size="sm">
              {quizFormat === 'written' ? t('quizPage.writtenHint') : t('quizPage.multipleChoiceHint')}
            </Text>

            <Group justify="space-between">
              <Text c="dimmed" size="sm">
                {t('quizPage.questionCountInfo', {
                  selected: normalizedQuestionCount,
                  available: availableWords.length,
                })}
              </Text>
              <Button color="violet" radius="md" onClick={startQuiz} leftSection={<PlayCircle size={16} strokeWidth={2.2} />}>
                {t('quizPage.startQuiz')}
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    );
  }

  if (isFinished) {
    const percent = Math.round((score / questions.length) * 100);
    const wrongAnswers = answerHistory.filter((entry) => entry.selectedAnswer !== entry.question.correctAnswer);
    const totalSeconds = completedSeconds ?? 0;

    return (
      <Stack gap="lg">
        <Card className="panel-card quiz-result-card" radius="xl" padding="xl">
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start" className="quiz-result-top">
              <div className="quiz-result-copy">
                <Badge radius="xl" color="violet" variant="light">
                  <Trophy size={14} strokeWidth={2.2} style={{ marginRight: 6 }} />
                  {t('quizPage.resultBadge')}
                </Badge>
                <Title order={1} mt="md">
                  {t('quizPage.resultHeading')}
                </Title>
                <Text c="dimmed" mt="xs">
                  {session.label}
                </Text>
              </div>
              <div className="quiz-result-score">
                <div className="quiz-result-score-value">{score}</div>
                <div className="quiz-result-score-total">{t('quizPage.outOfTotal', { total: questions.length })}</div>
              </div>
            </Group>

            <Text className="quiz-result-summary">
              {t('quizPage.resultDescription', { percent })}
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Card className="stat-panel quiz-result-stat" radius="lg" padding="md">
                <Text className="word-label">{t('quizPage.correctCount')}</Text>
                <Title order={3} className="quiz-stat-value">{score}</Title>
              </Card>
              <Card className="stat-panel quiz-result-stat" radius="lg" padding="md">
                <Text className="word-label">{t('quizPage.wrongCount')}</Text>
                <Title order={3} className="quiz-stat-value">{wrongAnswers.length}</Title>
              </Card>
              <Card className="stat-panel quiz-result-stat" radius="lg" padding="md">
                <Text className="word-label">{t('quizPage.timeSpent')}</Text>
                <Title order={3} className="quiz-stat-value">{formatDuration(totalSeconds)}</Title>
              </Card>
            </SimpleGrid>

            <Group className="quiz-result-actions">
              <Button radius="xl" color="violet" onClick={restartQuiz} leftSection={<PlayCircle size={16} strokeWidth={2.2} />}>
                {t('quizPage.restart')}
              </Button>
              <Button radius="xl" variant="default" onClick={() => setSession(null)}>
                {t('quizPage.chooseAnother')}
              </Button>
            </Group>
          </Stack>
        </Card>

        {wrongAnswers.length > 0 ? (
          <Card className="panel-card quiz-review-card" radius="xl" padding="xl">
            <Stack gap="md">
              <div>
                <Text className="section-kicker">{t('quizPage.reviewKicker')}</Text>
                <Title order={2}>{t('quizPage.reviewTitle')}</Title>
                <Text c="dimmed" mt="xs">
                  {t('quizPage.reviewDescription')}
                </Text>
              </div>

              <Stack gap="sm">
                {wrongAnswers.map((entry, index) => (
                  <Card key={`${entry.question.prompt}-${index}`} className="panel-card quiz-review-item" radius="lg" padding="md">
                    <Stack gap={8}>
                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        <div className="quiz-review-icon wrong">
                          <CircleX size={16} strokeWidth={2.2} />
                        </div>
                        <div>
                          <Text fw={700}>{entry.question.prompt}</Text>
                          <Text size="sm" c="dimmed">
                            {entry.question.direction === 'en-to-kk' ? t('quizPage.directionEnToKk') : t('quizPage.directionKkToEn')}
                          </Text>
                        </div>
                      </Group>

                      <div className="quiz-review-answer wrong">
                        <Text size="sm" fw={700}>
                          {t('quizPage.yourAnswer')}
                        </Text>
                        <Text>{entry.selectedAnswer}</Text>
                      </div>

                      <div className="quiz-review-answer correct">
                        <Text size="sm" fw={700}>
                          {t('quizPage.correctAnswerLabel')}
                        </Text>
                        <Text>{entry.question.correctAnswer}</Text>
                      </div>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        ) : null}
      </Stack>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const correctAnswer = currentQuestion.correctAnswer;
  const answeredCorrectly = selectedAnswer
    ? normalizeAnswer(selectedAnswer) === normalizeAnswer(correctAnswer)
    : false;

  return (
    <Stack gap="xl">
      <div>
        <Text className="section-kicker">{t('quizPage.kicker')}</Text>
        <Title order={1}>{t('quizPage.playTitle')}</Title>
        <Text c="dimmed" mt="sm">
          {t('quizPage.playDescription')}
        </Text>
      </div>

      <Card className="panel-card quiz-play-card quiz-session-card" radius="xl" padding="xl">
        <Group justify="space-between" mb="md">
          <Badge radius="xl" variant="outline" color="gray">
            {currentIndex + 1} / {questions.length}
          </Badge>
          <Group gap="sm">
            <Badge radius="xl" variant="light" color="violet">
              {session.label}
            </Badge>
            <Badge radius="xl" variant="light" color="violet">
              {session.format === 'written'
                ? t('quizPage.writtenModeBadge')
                : currentQuestion.direction === 'en-to-kk'
                  ? t('quizPage.directionEnToKk')
                  : t('quizPage.directionKkToEn')}
            </Badge>
          </Group>
        </Group>

        <Progress value={progress} radius="xl" color="violet" mb="xl" />

        <Title order={2} mb="xs">
          {currentQuestion.prompt}
        </Title>
        <Text c="dimmed" mb="xl">
          {session.format === 'written' ? t('quizPage.writeCorrect') : t('quizPage.chooseCorrect')}
        </Text>

        {session.format === 'written' ? (
          <Stack gap="md">
            <TextInput
              value={writtenAnswer}
              onChange={(event) => setWrittenAnswer(event.currentTarget.value)}
              placeholder={t('quizPage.writePlaceholder')}
              leftSection={<PencilLine size={16} strokeWidth={2.2} />}
              disabled={selectedAnswer !== null}
            />
            <Button
              radius="lg"
              color="violet"
              onClick={handleWrittenSubmit}
              disabled={selectedAnswer !== null || writtenAnswer.trim().length === 0}
            >
              {t('quizPage.checkAnswer')}
            </Button>
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {currentQuestion.options.map((option) => {
              const isCorrect = option === correctAnswer;
              const isSelected = option === selectedAnswer;
              const answered = selectedAnswer !== null;

              let variant: 'light' | 'filled' | 'outline' = 'light';
              let color = 'gray';

              if (answered && isCorrect) {
                variant = 'filled';
                color = 'teal';
              } else if (answered && isSelected && !isCorrect) {
                variant = 'filled';
                color = 'red';
              }

              return (
                <Button
                  key={option}
                  variant={variant}
                  color={color}
                  radius="lg"
                  size="lg"
                  styles={{ root: { height: 'auto', paddingBlock: 18 } }}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              );
            })}
          </SimpleGrid>
        )}

        {selectedAnswer ? (
          <Group justify="space-between" mt="xl">
            <Text c={answeredCorrectly ? 'teal' : 'red'} fw={700}>
              {answeredCorrectly
                ? t('quizPage.correct')
                : t('quizPage.correctAnswer', { answer: correctAnswer })}
            </Text>
            <Button radius="xl" color="violet" onClick={handleNext}>
              {currentIndex === questions.length - 1 ? t('quizPage.finish') : t('quizPage.next')}
            </Button>
          </Group>
        ) : null}
      </Card>
    </Stack>
  );
}

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[?!.,;:'"`]+/g, '')
    .replace(/\s+/g, ' ');
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

function getAvailableWords(mode: QuizMode, level: LevelId, unitId: string) {
  if (mode === 'level') {
    return getWordsByLevel(level);
  }

  if (mode === 'unit') {
    return getWordsByUnit(unitId);
  }

  return words;
}

function getQuestionCountOptions(availableCount: number) {
  const matchingSteps = QUIZ_COUNT_STEPS.filter((count) => count <= availableCount);

  if (matchingSteps.length > 0) {
    return matchingSteps;
  }

  return availableCount > 0 ? [availableCount] : [];
}

function ModeCard({
  icon: Icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className="panel-card mode-card"
      radius="lg"
      padding="lg"
      style={{ cursor: 'pointer' }}
      data-active={active ? 'true' : 'false'}
      onClick={onClick}
    >
      <Stack gap="xs">
        {active ? (
          <div className="mode-card-active-indicator">
            <CheckCircle2 size={18} strokeWidth={2.4} />
          </div>
        ) : null}
        <div className="mode-card-icon">
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <Title order={4}>{title}</Title>
        <Text size="sm" c="dimmed">{description}</Text>
      </Stack>
    </Card>
  );
}
