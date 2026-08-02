import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { expect as vitestExpect } from 'vitest';
import { Meter } from '@tale-ui/react/meter';
import { createRenderer } from '#test-utils';

describe('<Meter />', () => {
  const { render } = createRenderer();

  describe('Meter.Root', () => {
    it('renders a div with the meter role', async () => {
      await render(<Meter.Root value={50} aria-label="Battery level" />);
      expect(screen.getByRole('meter')).toBeVisible();
    });

    it('forwards ref to HTMLDivElement', async () => {
      let refEl: HTMLDivElement | null = null;
      await render(
        <Meter.Root
          value={50}
          aria-label="Battery level"
          ref={(el) => {
            refEl = el;
          }}
        />,
      );
      expect(refEl).to.be.instanceof(window.HTMLDivElement);
    });

    it('applies tale-meter class', async () => {
      await render(<Meter.Root value={50} aria-label="Battery level" />);
      expect(screen.getByRole('meter')).to.have.class('tale-meter');
    });

    it('merges additional className', async () => {
      await render(<Meter.Root value={50} aria-label="Battery level" className="custom" />);
      expect(screen.getByRole('meter')).to.have.class('tale-meter');
      expect(screen.getByRole('meter')).to.have.class('custom');
    });

    it('sets aria-valuenow, aria-valuemin, aria-valuemax', async () => {
      await render(
        <Meter.Root value={30} minValue={0} maxValue={100} aria-label="Battery level" />,
      );
      const meter = screen.getByRole('meter');
      expect(meter).to.have.attribute('aria-valuenow', '30');
      expect(meter).to.have.attribute('aria-valuemin', '0');
      expect(meter).to.have.attribute('aria-valuemax', '100');
    });
  });

  describe('Meter.Track', () => {
    it('renders a div with tale-meter__track class', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Track data-testid="track" />
        </Meter.Root>,
      );
      const track = screen.getByTestId('track');
      expect(track.tagName).to.equal('DIV');
      expect(track).to.have.class('tale-meter__track');
    });

    it('forwards ref to HTMLDivElement', async () => {
      let refEl: HTMLDivElement | null = null;
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Track
            ref={(el) => {
              refEl = el;
            }}
          />
        </Meter.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLDivElement);
    });
  });

  describe('Meter.Indicator', () => {
    it('renders a div with tale-meter__indicator class', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Indicator data-testid="indicator" value={50} />
        </Meter.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.tagName).to.equal('DIV');
      expect(indicator).to.have.class('tale-meter__indicator');
    });

    it('forwards ref to HTMLDivElement', async () => {
      let refEl: HTMLDivElement | null = null;
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Indicator
            ref={(el) => {
              refEl = el;
            }}
          />
        </Meter.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLDivElement);
    });

    it('sets width based on value', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Indicator data-testid="indicator" value={50} />
        </Meter.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.style.width).to.equal('50%');
    });

    it('defaults to 0% width when no value provided', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Indicator data-testid="indicator" />
        </Meter.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.style.width).to.equal('0%');
    });

    it('uses 0% width when min and max are equal', async () => {
      await render(
        <Meter.Root value={5} minValue={5} maxValue={5} aria-label="Battery level">
          <Meter.Indicator data-testid="indicator" value={5} min={5} max={5} />
        </Meter.Root>,
      );

      vitestExpect(screen.getByTestId('indicator').style.width).toBe('0%');
    });
  });

  describe('Meter.Label', () => {
    it('renders a span with tale-meter__label class', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Label data-testid="label">Battery</Meter.Label>
        </Meter.Root>,
      );
      const label = screen.getByTestId('label');
      expect(label.tagName).to.equal('SPAN');
      expect(label).to.have.class('tale-meter__label');
    });

    it('forwards ref to HTMLSpanElement', async () => {
      let refEl: HTMLSpanElement | null = null;
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Label
            ref={(el) => {
              refEl = el;
            }}
          >
            Battery
          </Meter.Label>
        </Meter.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLSpanElement);
    });
  });

  describe('Meter.Value', () => {
    it('renders a span with tale-meter__value class', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Value data-testid="value">50%</Meter.Value>
        </Meter.Root>,
      );
      const value = screen.getByTestId('value');
      expect(value.tagName).to.equal('SPAN');
      expect(value).to.have.class('tale-meter__value');
    });

    it('is aria-hidden', async () => {
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Value data-testid="value">50%</Meter.Value>
        </Meter.Root>,
      );
      expect(screen.getByTestId('value')).to.have.attribute('aria-hidden');
    });

    it('forwards ref to HTMLSpanElement', async () => {
      let refEl: HTMLSpanElement | null = null;
      await render(
        <Meter.Root value={50} aria-label="Battery level">
          <Meter.Value
            ref={(el) => {
              refEl = el;
            }}
          >
            50%
          </Meter.Value>
        </Meter.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLSpanElement);
    });
  });
});
