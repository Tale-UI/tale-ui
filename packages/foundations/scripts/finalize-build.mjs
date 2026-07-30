import { readFile, writeFile } from 'node:fs/promises';

const packageRootUrl = new URL('../', import.meta.url);
const buildPackageUrl = new URL('build/package.json', packageRootUrl);
const tokensManifest = JSON.parse(
  await readFile(new URL('../tokens/package.json', packageRootUrl), 'utf8'),
);
const manifest = JSON.parse(await readFile(buildPackageUrl, 'utf8'));
manifest.dependencies['@tale-ui/tokens'] = `^${tokensManifest.version}`;
await writeFile(buildPackageUrl, `${JSON.stringify(manifest, null, 2)}\n`);
// eslint-disable-next-line no-console
console.log('Resolved @tale-ui/foundations workspace dependencies for publishing.');
