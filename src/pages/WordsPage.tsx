import { Accordion, Badge, Card, Group, SegmentedControl, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { BookText, Globe, Languages, Search, Shapes } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { getUnitsByLevel, levelLabels, units, words } from '../data/words';
import type { LevelId, WordEntry } from '../data/types';

export function WordsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialLevel = searchParams.get('level');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'level' | 'unit'>('level');
  const [level, setLevel] = useState<string>(
    initialLevel && initialLevel in levelLabels ? initialLevel : 'all'
  );
  const [unitId, setUnitId] = useState<string>('all');

  const filteredWords = words.filter((word) => {
    const matchesLevel = level === 'all' || word.level === level;
    const matchesUnit = unitId === 'all' || word.unitId === unitId;
    const searchValue = query.trim().toLowerCase();
    const matchesQuery =
      searchValue.length === 0 ||
      word.en.toLowerCase().includes(searchValue) ||
      word.kk.toLowerCase().includes(searchValue);

    return matchesLevel && matchesUnit && matchesQuery;
  });

  const visibleLevels = (level === 'all' ? Object.keys(levelLabels) : [level]) as LevelId[];
  const unitOptions = [
    { label: t('common.allUnits'), value: 'all' },
    ...((level === 'all' ? units : getUnitsByLevel(level as LevelId)).map((unit) => ({
      label: `${t(`levels.${unit.level}`)} - ${unit.title}`,
      value: unit.id,
    }))),
  ];

  const visibleUnits = (unitId === 'all' ? units : units.filter((unit) => unit.id === unitId)).filter((unit) => {
    if (level !== 'all' && unit.level !== level) {
      return false;
    }

    return filteredWords.some((word) => word.unitId === unit.id);
  });

  return (
    <Stack gap="xl">
      <div>
        <Text className="section-kicker">{t('wordsPage.kicker')}</Text>
        <Title order={1}>{t('wordsPage.title')}</Title>
        <Text c="dimmed" mt="sm">
          {t('wordsPage.description')}
        </Text>
      </div>

      <Card className="panel-card filters-card app-toolbar-card" radius="xl" padding="lg">
        <Stack gap="md">
          <div>
            <Text className="word-label" mb={8}>{t('wordsPage.viewModeLabel')}</Text>
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as 'level' | 'unit')}
              data={[
                { label: t('wordsPage.viewByLevel'), value: 'level' },
                { label: t('wordsPage.viewByUnit'), value: 'unit' },
              ]}
              fullWidth
            />
          </div>
          <TextInput
            label={t('wordsPage.searchLabel')}
            placeholder={t('wordsPage.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            radius="md"
            leftSection={<Search size={16} strokeWidth={2.2} />}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Select
              label={t('wordsPage.levelLabel')}
              data={[
                { label: t('common.allLevels'), value: 'all' },
                ...Object.keys(levelLabels).map((value) => ({ value, label: t(`levels.${value}`) })),
              ]}
              value={level}
              onChange={(value) => {
                setLevel(value ?? 'all');
                setUnitId('all');
              }}
              leftSection={<Shapes size={16} strokeWidth={2.2} />}
            />
            <Select
              label={t('wordsPage.unitLabel')}
              data={unitOptions}
              value={unitId}
              onChange={(value) => setUnitId(value ?? 'all')}
              leftSection={<BookText size={16} strokeWidth={2.2} />}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {viewMode === 'level' ? (
        <Accordion variant="separated" radius="md">
          {visibleLevels.map((levelId) => {
            const levelWords = filteredWords.filter((word) => word.level === levelId);

            if (levelWords.length === 0) {
              return null;
            }

            const levelUnits = units.filter((unit) =>
              unit.level === levelId && levelWords.some((word) => word.unitId === unit.id)
            );

            return (
              <Accordion.Item key={levelId} value={levelId}>
                <Accordion.Control>
                  <Group justify="space-between" wrap="nowrap">
                    <div>
                      <Text fw={600} className="title-with-icon">
                        <Shapes size={16} strokeWidth={2.2} />
                        {t(`levels.${levelId}`)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {t('wordsPage.levelSummary', { unitCount: levelUnits.length, wordCount: levelWords.length })}
                      </Text>
                    </div>
                    <Badge variant="light" color="violet">{levelWords.length}</Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="lg">
                    {levelUnits.map((unit) => {
                      const unitWords = levelWords.filter((word) => word.unitId === unit.id);

                      return (
                        <Card key={unit.id} className="panel-card inner-panel-card unit-shell-card" radius="lg" padding="lg">
                          <Group justify="space-between" mb="md">
                            <div>
                              <Title order={4} className="title-with-icon">
                                <BookText size={17} strokeWidth={2.2} />
                                {unit.title}
                              </Title>
                              <Text size="sm" c="dimmed">{unit.description}</Text>
                            </div>
                            <Badge variant="outline" color="violet">
                              {t('wordsPage.unitWordCount', { count: unitWords.length })}
                            </Badge>
                          </Group>

                          <div className="word-grid">
                            {unitWords.map((word) => (
                              <WordCard key={word.id} word={word} />
                            ))}
                          </div>
                        </Card>
                      );
                    })}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : (
        <Accordion variant="separated" radius="md">
          {visibleUnits.map((unit) => {
            const unitWords = filteredWords.filter((word) => word.unitId === unit.id);

            return (
              <Accordion.Item key={unit.id} value={unit.id}>
                <Accordion.Control>
                  <Group justify="space-between" wrap="nowrap">
                    <div>
                      <Text fw={600} className="title-with-icon">
                        <BookText size={16} strokeWidth={2.2} />
                        {unit.title}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {t(`levels.${unit.level}`)} · {unit.description}
                      </Text>
                    </div>
                    <Badge variant="light" color="violet">{unitWords.length}</Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <div className="word-grid">
                    {unitWords.map((word) => (
                      <WordCard key={word.id} word={word} />
                    ))}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}

      {filteredWords.length === 0 && (
        <Card className="panel-card" radius="xl" padding="xl">
          <Title order={3}>{t('wordsPage.noResultsTitle')}</Title>
          <Text c="dimmed" mt="sm">
            {t('wordsPage.noResultsDescription')}
          </Text>
        </Card>
      )}
    </Stack>
  );
}

function WordCard({ word }: { word: WordEntry }) {
  const { t } = useTranslation();
  const phonetic = formatPhonetic(word.phonetic);

  return (
    <Card className="word-card vocab-card" radius="lg" padding="md">
      <div className="word-card-head">
        <div className="word-main">
          <Text className="word-label">{t('wordsPage.english')}</Text>
          <Title order={3} className="title-with-icon word-primary">
            <Globe size={18} strokeWidth={2.2} />
            {word.en}
          </Title>
          {phonetic ? (
            <Text className="word-phonetic-inline">
              {t('wordsPage.phonetic')}: {phonetic}
            </Text>
          ) : null}
        </div>

        <Badge radius="xl" variant="light" color="violet" className="word-level-badge">
          {t(`levels.${word.level}`)}
        </Badge>
      </div>

      <div className="word-divider" />

      <div className="word-main">
        <Text className="word-label">{t('wordsPage.karakalpak')}</Text>
        <Title order={2} className="kk-word title-with-icon word-secondary">
          <Languages size={19} strokeWidth={2.2} />
          {word.kk}
        </Title>
      </div>

      {word.note ? (
        <Text c="dimmed" className="word-note">
          {word.note}
        </Text>
      ) : null}
    </Card>
  );
}

function formatPhonetic(value?: string) {
  if (!value) {
    return '';
  }

  return value.trim().replace(/^[/[\]()\s]+/, '').replace(/[/\]()\s]+$/, '');
}
