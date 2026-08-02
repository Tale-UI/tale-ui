import { readFile, writeFile } from 'node:fs/promises';

const packageRootUrl = new URL('../', import.meta.url);
const buildPackageUrl = new URL('build/package.json', packageRootUrl);

const getWorkspaceVersion = async (relativeManifestPath) => {
  const manifestUrl = new URL(relativeManifestPath, packageRootUrl);
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  return `^${manifest.version}`;
};

const manifest = JSON.parse(await readFile(buildPackageUrl, 'utf8'));
manifest.dependencies['@tale-ui/css'] = await getWorkspaceVersion('../css/package.json');
manifest.dependencies['@tale-ui/foundations'] = await getWorkspaceVersion(
  '../foundations/package.json',
);
manifest.dependencies['@tale-ui/utils'] = await getWorkspaceVersion('../utils/package.json');

await writeFile(buildPackageUrl, `${JSON.stringify(manifest, null, 2)}\n`);
// eslint-disable-next-line no-console
console.log('Resolved @tale-ui/themes workspace dependencies for publishing.');
