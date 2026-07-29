import { resolveTheme } from '@tale-ui/foundations/theme';
import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { TaleProvider, useTaleTheme } from '@tale-ui/react-native/provider';
import type { Preview } from '@storybook/react-native';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function StorySurface({ children }: React.PropsWithChildren) {
  const { tokens } = useTaleTheme();
  return (
    <SafeAreaView style={{ backgroundColor: tokens.neutral5, flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center',
            padding: tokens.spaceS,
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const lightTokens = resolveTheme(harbourTheme, 'light').tokens;

const preview: Preview = {
  globalTypes: {
    appearance: {
      description: 'Resolved appearance',
      toolbar: { icon: 'mirror', items: ['system', 'light', 'dark'] },
    },
    theme: {
      description: 'Portable theme preset',
      toolbar: { icon: 'paintbrush', items: ['standard', 'monochrome', 'custom'] },
    },
    textScale: {
      description: 'Manual dynamic-type review target',
      toolbar: { icon: 'grow', items: ['1x', '1.5x', '2x'] },
    },
    locale: {
      description: 'Locale',
      toolbar: { icon: 'globe', items: ['en', 'ar', 'de'] },
    },
    direction: {
      description: 'Layout direction',
      toolbar: { icon: 'transfer', items: ['ltr', 'rtl'] },
    },
    reducedMotion: {
      description: 'Reduced motion',
      toolbar: { icon: 'stop', items: [false, true] },
    },
    density: {
      description: 'Component density',
      toolbar: { icon: 'component', items: ['compact', 'regular', 'comfortable'] },
    },
  },
  initialGlobals: {
    appearance: 'light',
    theme: 'standard',
    textScale: '1x',
    locale: 'en',
    direction: 'ltr',
    reducedMotion: false,
    density: 'regular',
  },
  decorators: [
    (Story, context) => {
      let selectedTheme = harbourTheme;
      if (context.globals.theme === 'monochrome') {
        selectedTheme = {
          id: 'storybook-monochrome',
          name: 'Storybook monochrome',
          tokens: {
            color60: lightTokens.neutral60,
            color60Fg: lightTokens.neutral60Fg,
          },
        };
      } else if (context.globals.theme === 'custom') {
        selectedTheme = {
          id: 'storybook-custom',
          name: 'Storybook custom',
          tokens: {
            color60: lightTokens.purple60,
            color60Fg: lightTokens.purple60Fg,
          },
        };
      }
      return (
        <TaleProvider
          appearance={context.globals.appearance}
          density={context.globals.density}
          direction={context.globals.direction}
          locale={context.globals.locale}
          reducedMotion={context.globals.reducedMotion}
          textScale={Number.parseFloat(String(context.globals.textScale))}
          theme={selectedTheme}
        >
          <StorySurface>
            <Story />
          </StorySurface>
        </TaleProvider>
      );
    },
  ],
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
    },
    accessibility: {
      ios: 'Verify VoiceOver name, role, state, and activation.',
      android: 'Verify TalkBack name, role, state, and activation.',
    },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
  },
};

export default preview;
