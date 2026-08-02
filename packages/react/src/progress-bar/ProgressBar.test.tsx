import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { expect as vitestExpect } from 'vitest';
import { ProgressBar } from '@tale-ui/react/progress-bar';
import { createRenderer } from '#test-utils';

describe('<ProgressBar />', () => {
  const { render } = createRenderer();

  describe('ProgressBar.Root', () => {
    it('renders a div with the progressbar role', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" />);
      expect(screen.getByRole('progressbar')).toBeVisible();
    });

    it('forwards ref to HTMLDivElement', async () => {
      let refEl: HTMLDivElement | null = null;
      await render(
        <ProgressBar.Root
          value={50}
          aria-label="Loading"
          ref={(el) => {
            refEl = el;
          }}
        />,
      );
      expect(refEl).to.be.instanceof(window.HTMLDivElement);
    });

    it('applies tale-progress-bar class', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" />);
      expect(screen.getByRole('progressbar')).to.have.class('tale-progress-bar');
    });

    it('merges additional className', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" className="custom" />);
      expect(screen.getByRole('progressbar')).to.have.class('tale-progress-bar');
      expect(screen.getByRole('progressbar')).to.have.class('custom');
    });

    it('sets aria-valuenow, aria-valuemin, aria-valuemax', async () => {
      await render(
        <ProgressBar.Root value={30} minValue={0} maxValue={100} aria-label="Loading" />,
      );
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).to.have.attribute('aria-valuenow', '30');
      expect(progressbar).to.have.attribute('aria-valuemin', '0');
      expect(progressbar).to.have.attribute('aria-valuemax', '100');
    });

    it('is indeterminate when isIndeterminate is true', async () => {
      await render(<ProgressBar.Root isIndeterminate aria-label="Loading" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.to.have.attribute('aria-valuenow');
    });
  });

  describe('ProgressBar.Track', () => {
    it('renders a div with tale-progress-bar__track class', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Track data-testid="track" />
        </ProgressBar.Root>,
      );
      const track = screen.getByTestId('track');
      expect(track.tagName).to.equal('DIV');
      expect(track).to.have.class('tale-progress-bar__track');
    });

    it('forwards ref to HTMLDivElement', async () => {
      let refEl: HTMLDivElement | null = null;
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Track
            ref={(el) => {
              refEl = el;
            }}
          />
        </ProgressBar.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLDivElement);
    });
  });

  describe('ProgressBar.Indicator', () => {
    it('renders a div with tale-progress-bar__indicator class', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Indicator data-testid="indicator" value={50} />
        </ProgressBar.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.tagName).to.equal('DIV');
      expect(indicator).to.have.class('tale-progress-bar__indicator');
    });

    it('forwards ref to HTMLDivElement', async () => {
      let refEl: HTMLDivElement | null = null;
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Indicator
            ref={(el) => {
              refEl = el;
            }}
            value={50}
          />
        </ProgressBar.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLDivElement);
    });

    it('sets width based on value', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Indicator data-testid="indicator" value={50} />
        </ProgressBar.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.style.width).to.equal('50%');
    });

    it('has no width when value is null (indeterminate)', async () => {
      await render(
        <ProgressBar.Root isIndeterminate aria-label="Loading">
          <ProgressBar.Indicator data-testid="indicator" value={null} />
        </ProgressBar.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.style.width).to.equal('');
    });

    it('uses 0% width when min and max are equal', async () => {
      await render(
        <ProgressBar.Root value={5} minValue={5} maxValue={5} aria-label="Loading">
          <ProgressBar.Indicator data-testid="indicator" value={5} min={5} max={5} />
        </ProgressBar.Root>,
      );

      vitestExpect(screen.getByTestId('indicator').style.width).toBe('0%');
    });
  });

  describe('ProgressBar.Label', () => {
    it('renders a span with tale-progress-bar__label class', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Label data-testid="label">Loading</ProgressBar.Label>
        </ProgressBar.Root>,
      );
      const label = screen.getByTestId('label');
      expect(label.tagName).to.equal('SPAN');
      expect(label).to.have.class('tale-progress-bar__label');
    });

    it('forwards ref to HTMLSpanElement', async () => {
      let refEl: HTMLSpanElement | null = null;
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Label
            ref={(el) => {
              refEl = el;
            }}
          >
            Loading
          </ProgressBar.Label>
        </ProgressBar.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLSpanElement);
    });
  });

  describe('ProgressBar.Value', () => {
    it('renders a span with tale-progress-bar__value class', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Value data-testid="value">50%</ProgressBar.Value>
        </ProgressBar.Root>,
      );
      const value = screen.getByTestId('value');
      expect(value.tagName).to.equal('SPAN');
      expect(value).to.have.class('tale-progress-bar__value');
    });

    it('is aria-hidden', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Value data-testid="value">50%</ProgressBar.Value>
        </ProgressBar.Root>,
      );
      expect(screen.getByTestId('value')).to.have.attribute('aria-hidden');
    });

    it('forwards ref to HTMLSpanElement', async () => {
      let refEl: HTMLSpanElement | null = null;
      await render(
        <ProgressBar.Root value={50} aria-label="Loading">
          <ProgressBar.Value
            ref={(el) => {
              refEl = el;
            }}
          >
            50%
          </ProgressBar.Value>
        </ProgressBar.Root>,
      );
      expect(refEl).to.be.instanceof(window.HTMLSpanElement);
    });

    it('applies left style for top-floating labelPosition', async () => {
      await render(
        <ProgressBar.Root
          value={60}
          minValue={0}
          maxValue={100}
          aria-label="Loading"
          labelPosition="top-floating"
        >
          <ProgressBar.Value data-testid="value">60%</ProgressBar.Value>
        </ProgressBar.Root>,
      );
      expect(screen.getByTestId('value').style.left).to.equal('60%');
    });

    it('applies left style for bottom-floating labelPosition', async () => {
      await render(
        <ProgressBar.Root
          value={25}
          minValue={0}
          maxValue={100}
          aria-label="Loading"
          labelPosition="bottom-floating"
        >
          <ProgressBar.Value data-testid="value">25%</ProgressBar.Value>
        </ProgressBar.Root>,
      );
      expect(screen.getByTestId('value').style.left).to.equal('25%');
    });

    it('does not apply left style for non-floating labelPosition', async () => {
      await render(
        <ProgressBar.Root value={60} aria-label="Loading" labelPosition="right">
          <ProgressBar.Value data-testid="value">60%</ProgressBar.Value>
        </ProgressBar.Root>,
      );
      expect(screen.getByTestId('value').style.left).to.equal('');
    });
  });

  describe('labelPosition prop', () => {
    it('sets data-label-position attribute for non-default positions', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" labelPosition="right" />);
      expect(screen.getByRole('progressbar')).to.have.attribute('data-label-position', 'right');
    });

    it('does not set data-label-position for default "top" position', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" labelPosition="top" />);
      expect(screen.getByRole('progressbar')).not.to.have.attribute('data-label-position');
    });

    it('does not set data-label-position when labelPosition is omitted', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" />);
      expect(screen.getByRole('progressbar')).not.to.have.attribute('data-label-position');
    });

    it('sets data-label-position="bottom" correctly', async () => {
      await render(<ProgressBar.Root value={50} aria-label="Loading" labelPosition="bottom" />);
      expect(screen.getByRole('progressbar')).to.have.attribute('data-label-position', 'bottom');
    });

    it('sets data-label-position="top-floating" correctly', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading" labelPosition="top-floating" />,
      );
      expect(screen.getByRole('progressbar')).to.have.attribute(
        'data-label-position',
        'top-floating',
      );
    });

    it('sets data-label-position="bottom-floating" correctly', async () => {
      await render(
        <ProgressBar.Root value={50} aria-label="Loading" labelPosition="bottom-floating" />,
      );
      expect(screen.getByRole('progressbar')).to.have.attribute(
        'data-label-position',
        'bottom-floating',
      );
    });
  });
});
