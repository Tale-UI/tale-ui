import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialButton, SocialButtonGroup } from '@tale-ui/react/social-button';

type Args = {
  provider: 'google' | 'github' | 'apple' | 'x' | 'facebook';
  size: 'sm' | 'md';
};

const meta: Meta<Args> = {
  title: 'Components/SocialButton',
  parameters: { layout: 'centered' },
  argTypes: {
    provider: {
      control: 'select',
      options: ['google', 'github', 'apple', 'x', 'facebook'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    provider: 'google',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <SocialButton provider={args.provider} size={args.size}>
      Continue with {args.provider}
    </SocialButton>
  ),
};

export const AllProviders: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'stretch',
          width: 280,
        }}
      >
        <SocialButton provider="google">Sign in with Google</SocialButton>
        <SocialButton provider="github">Continue with GitHub</SocialButton>
        <SocialButton provider="apple">Sign in with Apple</SocialButton>
        <SocialButton provider="x">Sign in with X</SocialButton>
        <SocialButton provider="facebook">Continue with Facebook</SocialButton>
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'stretch',
          width: 280,
        }}
      >
        <SocialButton provider="google" size="sm">
          Sign in with Google
        </SocialButton>
        <SocialButton provider="google" size="md">
          Sign in with Google
        </SocialButton>
      </div>
    );
  },
};

export const Grouped: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <SocialButtonGroup>
        <SocialButton provider="google">Sign in with Google</SocialButton>
        <SocialButton provider="github">Continue with GitHub</SocialButton>
        <SocialButton provider="apple">Sign in with Apple</SocialButton>
        <SocialButton provider="x">Sign in with X</SocialButton>
        <SocialButton provider="facebook">Continue with Facebook</SocialButton>
      </SocialButtonGroup>
    );
  },
};

export const GroupedSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <SocialButtonGroup size="sm">
          <SocialButton provider="google">Sign in with Google</SocialButton>
          <SocialButton provider="github">Continue with GitHub</SocialButton>
          <SocialButton provider="apple">Sign in with Apple</SocialButton>
        </SocialButtonGroup>
        <SocialButtonGroup size="md">
          <SocialButton provider="google">Sign in with Google</SocialButton>
          <SocialButton provider="github">Continue with GitHub</SocialButton>
          <SocialButton provider="apple">Sign in with Apple</SocialButton>
        </SocialButtonGroup>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const providers = ['google', 'github', 'apple', 'x', 'facebook'] as const;
    const sizes = ['sm', 'md'] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: '0.75rem' }}>
        {sizes.map((s) => (
          <div key={s} className="story-label">
            {s}
          </div>
        ))}
        {providers.map((p) =>
          sizes.map((s) => (
            <SocialButton key={`${p}-${s}`} provider={p} size={s}>
              Sign in with {p}
            </SocialButton>
          )),
        )}
      </div>
    );
  },
};
