#!/usr/bin/env node

import { renameSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(ROOT, 'registry/metrics/provider-checkpoint.json');
const PACKAGES = [
  '@tale-ui/core',
  '@tale-ui/utils',
  '@tale-ui/react',
  '@tale-ui/react-styles',
  '@tale-ui/themes',
  '@tale-ui/charts',
  '@tale-ui/a2ui',
];

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function normalizeProviderFixture(fixture) {
  const downloads = new Map(
    fixture.npm.map(({ package: packageName, downloads }) => [packageName, downloads]),
  );
  const issues = new Map(fixture.github.issues.map((issue) => [issue.id, issue]));
  const releases = new Map(fixture.github.releases.map((release) => [release.tag, release]));
  const openIssuesByComponentVersion = {};
  for (const issue of issues.values()) {
    const key = `${issue.component ?? 'unclassified'}@${issue.version ?? 'unclassified'}`;
    openIssuesByComponentVersion[key] = (openIssuesByComponentVersion[key] ?? 0) + 1;
  }
  return {
    downloadsLast30Days: Object.fromEntries([...downloads.entries()].sort()),
    openIssuesByComponentVersion,
    releaseCadence: {
      releasesLast365Days: releases.size,
      latestReleaseAt:
        [...releases.values()]
          .map(({ publishedAt }) => publishedAt)
          .sort()
          .at(-1) ?? null,
    },
  };
}

async function collectNetwork() {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 30);
  const period = `${start.toISOString().slice(0, 10)}:${end.toISOString().slice(0, 10)}`;
  const npm = await Promise.all(
    PACKAGES.map(async (packageName) => {
      const response = await fetch(
        `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(packageName)}`,
      );
      if (!response.ok) {
        throw new Error(`npm returned ${response.status}`);
      }
      const payload = await response.json();
      return { package: packageName, downloads: payload.downloads };
    }),
  );
  const githubHeaders = process.env.GITHUB_TOKEN
    ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};
  const [issuesResponse, releasesResponse] = await Promise.all([
    fetch('https://api.github.com/repos/Tale-UI/tale-ui/issues?state=open&per_page=100', {
      headers: githubHeaders,
    }),
    fetch('https://api.github.com/repos/Tale-UI/tale-ui/releases?per_page=100', {
      headers: githubHeaders,
    }),
  ]);
  if (!issuesResponse.ok || !releasesResponse.ok) {
    throw new Error(
      `GitHub returned issues=${issuesResponse.status}, releases=${releasesResponse.status}`,
    );
  }
  const issuesPayload = await issuesResponse.json();
  const releasesPayload = await releasesResponse.json();
  return {
    npm,
    github: {
      issues: issuesPayload
        .filter((issue) => !issue.pull_request)
        .map((issue) => {
          const labels = issue.labels.map((label) =>
            typeof label === 'string' ? label : label.name,
          );
          return {
            id: issue.node_id,
            component: labels.find((label) => label?.startsWith('component:'))?.slice(10),
            version: labels.find((label) => label?.startsWith('version:'))?.slice(8),
          };
        }),
      releases: releasesPayload.map((release) => ({
        tag: release.tag_name,
        publishedAt: release.published_at,
      })),
    },
  };
}

async function main() {
  const fixturePath = process.argv.includes('--fixture')
    ? process.argv[process.argv.indexOf('--fixture') + 1]
    : undefined;
  const previous = JSON.parse(readFileSync(OUTPUT, 'utf8'));
  const capturedAt = new Date().toISOString();
  let checkpoint;
  try {
    const fixture = fixturePath
      ? JSON.parse(readFileSync(resolve(ROOT, fixturePath), 'utf8'))
      : await collectNetwork();
    const value = normalizeProviderFixture(fixture);
    checkpoint = {
      schemaVersion: '1.0.0',
      capturedAt,
      sources: {
        'npm-public-api': {
          status: 'current',
          asOf: capturedAt,
          value: { downloadsLast30Days: value.downloadsLast30Days },
        },
        'github-public-api': {
          status: 'current',
          asOf: capturedAt,
          value: {
            openIssuesByComponentVersion: value.openIssuesByComponentVersion,
            releaseCadence: value.releaseCadence,
          },
        },
      },
    };
  } catch (error) {
    checkpoint = {
      ...previous,
      capturedAt,
      sources: Object.fromEntries(
        Object.entries(previous.sources).map(([id, source]) => [
          id,
          {
            ...source,
            status: source.value ? 'stale' : 'unavailable',
            collectionError:
              error instanceof Error ? error.message : 'Unknown public collector failure.',
          },
        ]),
      ),
    };
  }
  const temporary = `${OUTPUT}.${process.pid}.tmp`;
  writeFileSync(temporary, canonical(checkpoint));
  renameSync(temporary, OUTPUT);
  console.log(`Checkpointed ${Object.keys(checkpoint.sources).length} public aggregate sources.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
