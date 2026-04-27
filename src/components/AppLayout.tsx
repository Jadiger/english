import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BookOpen, Home, Languages, MoonStar, Sparkles, SunMedium } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();
  const { t } = useTranslation();

  const links = [
    { to: '/', label: t('common.home'), icon: Home },
    { to: '/words', label: t('common.words'), icon: BookOpen },
    { to: '/quiz', label: t('common.quiz'), icon: Sparkles },
  ];

  return (
    <AppShell header={{ height: 76 }} padding="md">
      <AppShell.Header className="shell-header">
        <Container size="xl" h="100%" className="shell-header-inner">
          <Group h="100%" justify="space-between">
            <Link to="/" className="brand-link" onClick={close}>
              <Group gap="sm" wrap="nowrap">
                <div className="brand-mark">
                  <Languages size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <Text className="brand-kicker">{t('brand.short')}</Text>
                  <Title order={4}>{t('brand.title')}</Title>
                </div>
              </Group>
            </Link>

            <Group gap="sm" visibleFrom="sm">
              {links.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  variant={location.pathname === link.to ? 'filled' : 'subtle'}
                  radius="md"
                  color="violet"
                  leftSection={<link.icon size={16} strokeWidth={2.2} />}
                >
                  {link.label}
                </Button>
              ))}
              <ActionIcon
                variant="light"
                radius="md"
                size="lg"
                onClick={() => toggleColorScheme()}
                aria-label={colorScheme === 'dark' ? t('common.light') : t('common.dark')}
              >
                {colorScheme === 'dark' ? <SunMedium size={17} /> : <MoonStar size={17} />}
              </ActionIcon>
            </Group>

            <Group hiddenFrom="sm">
              <ActionIcon
                variant="light"
                radius="md"
                size="lg"
                onClick={() => toggleColorScheme()}
                aria-label={colorScheme === 'dark' ? t('common.light') : t('common.dark')}
              >
                {colorScheme === 'dark' ? <SunMedium size={17} /> : <MoonStar size={17} />}
              </ActionIcon>
              <Burger opened={opened} onClick={toggle} />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <Drawer opened={opened} onClose={close} title={t('common.menu')} position="right" radius="md">
        <Stack>
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              justify="flex-start"
              variant={location.pathname === link.to ? 'filled' : 'light'}
              color="violet"
              onClick={close}
              leftSection={<link.icon size={16} strokeWidth={2.2} />}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Drawer>

      <AppShell.Main>
        <div className="app-stage">
          <Container size="xl">
            <div className="app-screen">{children}</div>
          </Container>
        </div>
      </AppShell.Main>

      <Box component="footer" className="shell-footer">
        <Container size="xl">
          <Text ta="center" c="dimmed" size="sm">
            {t('brand.footer')}
          </Text>
        </Container>
      </Box>
    </AppShell>
  );
}
