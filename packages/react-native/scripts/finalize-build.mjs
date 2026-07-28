import { readFile, writeFile } from 'node:fs/promises';

const packageRootUrl = new URL('../', import.meta.url);
const buildPackageUrl = new URL('build/package.json', packageRootUrl);
const manifest = JSON.parse(await readFile(buildPackageUrl, 'utf8'));
const dependencyManifests = await Promise.all(
  ['foundations', 'tokens'].map(async (dependency) => ({
    dependency,
    manifest: JSON.parse(
      await readFile(new URL(`../${dependency}/package.json`, packageRootUrl), 'utf8'),
    ),
  })),
);
for (const { dependency, manifest: dependencyManifest } of dependencyManifests) {
  manifest.dependencies[`@tale-ui/${dependency}`] = `^${dependencyManifest.version}`;
}
manifest.exports = Object.fromEntries(
  Object.entries(manifest.exports).map(([subpath, target]) => [
    subpath,
    typeof target === 'object' && target.import?.default
      ? { 'react-native': target.import.default, ...target }
      : target,
  ]),
);
await writeFile(buildPackageUrl, `${JSON.stringify(manifest, null, 2)}\n`);
