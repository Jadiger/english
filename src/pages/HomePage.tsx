import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { BookText, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { levelLabels, units, words } from '../data/words';

export function HomePage() {
  const { t } = useTranslation();
  const levelIds = Object.keys(levelLabels) as Array<keyof typeof levelLabels>;
  const totalWords = words.length;
  const totalLevels = levelIds.length;
  const totalUnits = units.length;

  return (
    <Stack gap="xl">
      <div className="hero-block">
        <Badge className="soft-badge" radius="xl" size="lg">
          {t('brand.short')}
        </Badge>
        <Title order={1} className="hero-clean-title">
          {t('homePage.title')}
        </Title>
        <Text className="hero-clean-text">
          {t('home.title', { wordCount: totalWords, levelCount: totalLevels, unitCount: totalUnits })}
        </Text>
        <Group mt="md" className="hero-actions">
          <Button component={Link} to="/words" radius="xl" size="md" color="violet" leftSection={<BookText size={17} />}>
            {t('homePage.browseWords')}
          </Button>
          <Button component={Link} to="/quiz" radius="xl" size="md" variant="light" color="violet" leftSection={<PlayCircle size={17} />}>
            {t('homePage.startQuiz')}
          </Button>
        </Group>
      </div>

      <Card className="panel-card level-overview-card" radius="xl" padding="xl">
        <Group justify="space-between" mb="lg">
          <div>
            <Text className="section-kicker">{t('homePage.levelsKicker')}</Text>
            <Title order={2}>{t('homePage.levelsTitle')}</Title>
          </div>
          <Badge variant="outline" color="gray" radius="xl">
            {t('common.wordsCount', { count: totalWords })}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {levelIds.map((key) => {
            const levelUnits = units.filter((unit) => unit.level === key);
            const count = words.filter((word) => word.level === key).length;

            return (
              <Card
                key={key}
                component={Link}
                to={`/words?level=${key}`}
                className="mini-card home-link-card level-tile"
                radius="lg"
                padding="lg"
              >
                <Text fw={700}>{t(`levels.${key}`)}</Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {t('homePage.levelSummary', { unitCount: levelUnits.length, wordCount: count })}
                </Text>
              </Card>
            );
          })}
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
