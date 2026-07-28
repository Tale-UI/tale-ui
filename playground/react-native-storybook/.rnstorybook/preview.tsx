import { harbourTheme } from '@tale-ui/foundations/theme-presets';
import { TaleProvider } from '@tale-ui/react-native/provider';
import type { Preview } from '@storybook/react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    appearance: 'system',
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
          tokens: { color60: '#555555', color60Fg: '#ffffff' },
        };
      } else if (context.globals.theme === 'custom') {
        selectedTheme = {
          id: 'storybook-custom',
          name: 'Storybook custom',
          tokens: { color60: '#6b3fc6', color60Fg: '#ffffff' },
        };
      }
      return (
        <TaleProvider
          appearance={context.globals.appearance}
          density={context.globals.density}
          direction={context.globals.direction}
          locale={context.globals.locale}
          reducedMotion={context.globals.reducedMotion}
          theme={selectedTheme}
        >
          <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Story />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
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
