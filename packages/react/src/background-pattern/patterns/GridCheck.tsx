import * as React from 'react';

type GridCheckSize = 'sm' | 'md';

interface GridConfig {
  cellSize: 64 | 96;
  shadedCells: ReadonlySet<number>;
  suffix: string;
}

const configs: Record<GridCheckSize, GridConfig> = {
  md: {
    cellSize: 96,
    shadedCells: new Set([12, 18, 20, 26, 39, 43, 50, 56, 73, 79, 80, 86]),
    suffix: '4940_405685',
  },
  sm: {
    cellSize: 64,
    shadedCells: new Set([
      17, 26, 34, 38, 57, 60, 65, 78, 84, 87, 96, 109, 115, 122, 133, 141, 154, 161, 173, 178, 184,
      196, 205, 217, 224,
    ]),
    suffix: '4940_405682',
  },
};

function cellPath(left: number, top: number, right: number, bottom: number) {
  return `M${left} ${top}H${right}V${bottom}H${left}V${top}Z`;
}

function borderPath(left: number, top: number, right: number, bottom: number) {
  return (
    `M${right} ${bottom}V${bottom + 1}H${right + 1}V${bottom}H${right}Z` +
    `M${right - 1} ${top}V${bottom}H${right + 1}V${top}H${right - 1}Z` +
    `M${right} ${bottom - 1}H${left}V${bottom + 1}H${right}V${bottom - 1}Z`
  );
}

function Grid({
  config,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  config: GridConfig;
}) {
  const { cellSize, shadedCells, suffix } = config;
  const columnCount = 960 / cellSize;
  const cellCount = columnCount ** 2;

  return (
    <svg width="960" height="960" viewBox="0 0 960 960" fill="none" {...props}>
      <mask
        id={`mask0_${suffix}`}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="960"
        height="960"
      >
        <rect width="960" height="960" fill={`url(#paint0_radial_${suffix})`} />
      </mask>
      <g mask={`url(#mask0_${suffix})`}>
        <g clipPath={`url(#clip0_${suffix})`}>
          {Array.from({ length: cellCount }, (_, index) => {
            const left = (index % columnCount) * cellSize;
            const top = Math.floor(index / columnCount) * cellSize;
            const right = left + cellSize;
            const bottom = top + cellSize;
            const path = cellPath(left, top, right, bottom);
            const maskId = `path-${index * 2 + 3}-inside-${index + 1}_${suffix}`;

            return (
              <React.Fragment key={maskId}>
                <mask id={maskId} fill="white">
                  <path d={path} />
                </mask>
                {shadedCells.has(index) ? <path d={path} fill="#F2F4F7" /> : null}
                <path
                  d={borderPath(left, top, right, bottom)}
                  fill="currentColor"
                  mask={`url(#${maskId})`}
                />
              </React.Fragment>
            );
          })}
        </g>
        <rect x="0.5" y="0.5" width="959" height="959" stroke="#D0D5DD" />
      </g>
      <defs>
        <radialGradient
          id={`paint0_radial_${suffix}`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(480 -0.000114441) rotate(90) scale(960 501.059)"
        >
          <stop />
          <stop offset="0.953125" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip0_${suffix}`}>
          <rect width="960" height="960" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

const sizes: Record<GridCheckSize, React.FC<React.SVGProps<SVGSVGElement>>> = {
  md: (props) => <Grid {...props} config={configs.md} />,
  sm: (props) => <Grid {...props} config={configs.sm} />,
};

export function GridCheck(
  props: Omit<React.SVGProps<SVGSVGElement>, 'size'> & { size?: GridCheckSize },
) {
  const { size = 'md', className, ...svgProps } = props;
  const Pattern = sizes[size];
  return <Pattern {...svgProps} className={`tale-background-pattern ${className || ''}`.trim()} />;
}
