import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Motion and elevation',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const roles = [
  ['Feedback', 'feedback'],
  ['State', 'state'],
  ['Enter', 'enter'],
  ['Exit', 'exit'],
  ['Content', 'content'],
] as const;

const elevations = ['flat', 'raised', 'floating', 'overlay', 'modal', 'toast'] as const;

export const TransitionMatrix: Story = {
  render() {
    return (
      <div style={{ display: 'grid', gap: 'var(--space-m)' }}>
        <p>
          Hover or focus each sample. Enable reduced motion in the operating system to verify the
          instant mapping.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
            gap: 'var(--space-s)',
          }}
        >
          {roles.map(([label, role]) => (
            <button
              key={role}
              type="button"
              style={{
                minHeight: '5rem',
                border: '1px solid var(--neutral-30)',
                borderRadius: 'var(--radius-m)',
                background: 'var(--neutral-5)',
                transition: [
                  `transform var(--motion-${role}-duration) var(--motion-${role}-easing)`,
                  `background-color var(--motion-${role}-duration) var(--motion-${role}-easing)`,
                ].join(', '),
              }}
              onPointerEnter={(event) => {
                event.currentTarget.style.transform = 'translateY(-0.25rem)';
                event.currentTarget.style.backgroundColor = 'var(--color-10)';
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.transform = '';
                event.currentTarget.style.backgroundColor = '';
              }}
              onFocus={(event) => {
                event.currentTarget.style.transform = 'translateY(-0.25rem)';
              }}
              onBlur={(event) => {
                event.currentTarget.style.transform = '';
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const ElevationHierarchy: Story = {
  render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
          gap: 'var(--space-m)',
          padding: 'var(--space-l)',
          background: 'var(--neutral-10)',
        }}
      >
        {elevations.map((level) => (
          <div
            key={level}
            style={{
              minHeight: '6rem',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--radius-m)',
              background: 'var(--neutral-5)',
              boxShadow: `var(--elevation-${level})`,
            }}
          >
            {level}
          </div>
        ))}
      </div>
    );
  },
};
