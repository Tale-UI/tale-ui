import { createHash, timingSafeEqual } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { intersects, validRange } from 'semver';
import { z } from 'zod';
import { TaleToolingError } from './contracts/errors.js';

export const EXTENSION_CONTRACT_VERSION = '1.0.0';
const MAX_MANIFEST_BYTES = 1024 * 1024;
const CONTRIBUTION_CLASSES = [
  'components-and-docs',
  'recipes-and-templates',
  'validations-and-pitfalls',
  'codemods',
  'a2ui-types',
] as const;

const classKinds = {
  'components-and-docs': new Set(['component', 'doc']),
  'recipes-and-templates': new Set(['recipe', 'template']),
  'validations-and-pitfalls': new Set(['validation', 'pitfall']),
  codemods: new Set(['codemod']),
  'a2ui-types': new Set(['a2ui-type']),
} as const;

const artifactSchema = z
  .object({
    id: z.string(),
    kind: z.enum([
      'component',
      'doc',
      'recipe',
      'template',
      'validation',
      'pitfall',
      'codemod',
      'a2ui-type',
    ]),
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]+$/),
    path: z.string().startsWith('./'),
    executable: z.boolean(),
    entrypoint: z.string().startsWith('./').optional(),
    capabilities: z.array(z.string()).refine((values) => new Set(values).size === values.length),
  })
  .strict()
  .superRefine((artifact, context) => {
    if (artifact.executable && (!artifact.entrypoint || artifact.capabilities.length === 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Executable artifacts require an entrypoint and at least one capability.',
      });
    }
    if (!artifact.executable && artifact.entrypoint) {
      context.addIssue({
        code: 'custom',
        message: 'Declarative artifacts cannot declare an entrypoint.',
      });
    }
  });

const extensionSchema = z
  .object({
    $schema: z.string().optional(),
    schemaVersion: z.literal('1.0.0'),
    namespace: z.string().regex(/^[a-z0-9][a-z0-9._-]+$/),
    package: z.string(),
    version: z.string().regex(/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/),
    publisher: z.string().regex(/^[a-z0-9][a-z0-9._-]+$/),
    provenance: z.object({ repository: z.string().url(), npmProvenance: z.boolean() }).strict(),
    license: z.string().min(1),
    contributionClasses: z
      .array(z.enum(CONTRIBUTION_CLASSES))
      .length(CONTRIBUTION_CLASSES.length)
      .refine((values) => new Set(values).size === CONTRIBUTION_CLASSES.length),
    contributions: z.array(
      z
        .object({
          class: z.enum(CONTRIBUTION_CLASSES),
          artifacts: z.array(artifactSchema).min(1),
        })
        .strict(),
    ),
    contractRanges: z.object({ tale: z.string().min(1), extension: z.string().min(1) }).strict(),
    capabilities: z.array(z.string()),
    permissions: z.array(z.string()),
    trust: z.literal('untrusted'),
    sourceLinks: z.array(z.string().url()).min(1),
    revocation: z.null(),
  })
  .strict();

const trustSchema = z
  .object({
    $schema: z.string().optional(),
    schemaVersion: z.literal('1.0.0'),
    generatedAt: z.string().datetime(),
    freshness: z.object({ warnAfterDays: z.literal(7), failAfterDays: z.literal(30) }).strict(),
    publishers: z.array(
      z
        .object({
          publisher: z.string(),
          status: z.enum(['trusted', 'revoked']),
          packages: z.array(z.string()),
          provenanceRequired: z.boolean(),
          reviewedAt: z.string().datetime(),
          revocation: z
            .object({ reason: z.string(), effectiveAt: z.string().datetime() })
            .strict()
            .optional(),
        })
        .strict(),
    ),
  })
  .strict();

const approvalSchema = z
  .object({
    schemaVersion: z.literal('1.0.0'),
    projectId: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    package: z.string(),
    publisher: z.string(),
    version: z.string(),
    integrity: z.string(),
    capabilities: z.array(z.string()),
    approvedAt: z.string().datetime(),
    revoked: z.boolean(),
  })
  .strict();

export type ExtensionManifest = z.infer<typeof extensionSchema>;
export type ExtensionArtifact = z.infer<typeof artifactSchema>;
export type ExtensionTrustRegistry = z.infer<typeof trustSchema>;
export type ExtensionApproval = z.infer<typeof approvalSchema>;

function inside(root: string, path: string) {
  const child = relative(root, path);
  return child !== '..' && !child.startsWith(`..${sep}`) && !isAbsolute(child);
}

function resolveRegularFile(root: string, candidate: string) {
  if (isAbsolute(candidate)) {
    throw new TaleToolingError('TALE_UNSAFE_PATH', 'Extension paths must be project-relative.');
  }
  const lexical = resolve(root, candidate);
  if (!inside(root, lexical) || lstatSync(lexical).isSymbolicLink()) {
    throw new TaleToolingError(
      'TALE_SYMLINK_REFUSED',
      'Extension paths cannot escape through traversal or symbolic links.',
    );
  }
  const canonical = realpathSync(lexical);
  if (!inside(root, canonical) || !lstatSync(canonical).isFile()) {
    throw new TaleToolingError('TALE_UNSAFE_PATH', 'Extension path is not a confined file.');
  }
  return canonical;
}

function parseJson<T>(path: string, schema: z.ZodType<T>) {
  const bytes = readFileSync(path);
  if (bytes.byteLength > MAX_MANIFEST_BYTES) {
    throw new TaleToolingError(
      'TALE_EXTENSION_UNSUPPORTED',
      'Extension manifest exceeds the 1 MiB discovery limit.',
    );
  }
  try {
    return schema.parse(JSON.parse(bytes.toString('utf8')));
  } catch (cause) {
    throw new TaleToolingError(
      'TALE_EXTENSION_UNSUPPORTED',
      'Extension manifest is invalid or unsupported.',
      { cause },
    );
  }
}

export function discoverExtension(packageRoot: string) {
  const root = realpathSync(packageRoot);
  const packagePath = resolveRegularFile(root, './package.json');
  const packageManifest = parseJson(
    packagePath,
    z
      .object({
        name: z.string(),
        version: z.string(),
        taleUiExtension: z.string().startsWith('./'),
      })
      .passthrough(),
  );
  const manifestPath = resolveRegularFile(root, packageManifest.taleUiExtension);
  const manifest = parseJson(manifestPath, extensionSchema);
  if (manifest.package !== packageManifest.name || manifest.version !== packageManifest.version) {
    throw new TaleToolingError(
      'TALE_EXTENSION_UNSUPPORTED',
      'Extension package identity differs from its contribution manifest.',
    );
  }
  const classes = new Set(manifest.contributions.map(({ class: name }) => name));
  if (
    classes.size !== CONTRIBUTION_CLASSES.length ||
    CONTRIBUTION_CLASSES.some((name) => !classes.has(name))
  ) {
    throw new TaleToolingError(
      'TALE_EXTENSION_UNSUPPORTED',
      'Extension contributions must cover each declared contribution class exactly.',
    );
  }
  for (const contribution of manifest.contributions) {
    for (const artifact of contribution.artifacts) {
      if (
        !classKinds[contribution.class].has(artifact.kind as never) ||
        artifact.id !== `${manifest.namespace}:${artifact.kind}:${artifact.slug}`
      ) {
        throw new TaleToolingError(
          'TALE_EXTENSION_UNSUPPORTED',
          `Extension artifact ${artifact.id} violates its class or namespace contract.`,
        );
      }
      resolveRegularFile(root, artifact.path);
      if (artifact.entrypoint) {
        resolveRegularFile(root, artifact.entrypoint);
      }
    }
  }
  return { packageRoot: root, manifestPath, manifest };
}

export function verifyExtensionIntegrity(bytes: Uint8Array, expected: string) {
  const actual = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return (
    actualBytes.byteLength === expectedBytes.byteLength &&
    timingSafeEqual(actualBytes, expectedBytes)
  );
}

export function createVirtualExtensionRegistry(
  entries: Array<{
    manifest: ExtensionManifest;
    packageBytes: Uint8Array;
    packageIntegrity: string;
  }>,
) {
  const ids = new Set<string>();
  return entries.flatMap(({ manifest, packageBytes, packageIntegrity }) => {
    if (!verifyExtensionIntegrity(packageBytes, packageIntegrity)) {
      throw new TaleToolingError(
        'TALE_EXTENSION_UNTRUSTED',
        `Extension ${manifest.package} failed its SHA-512 integrity check.`,
      );
    }
    return manifest.contributions.flatMap((contribution) =>
      contribution.artifacts.map((artifact) => {
        if (ids.has(artifact.id)) {
          throw new TaleToolingError(
            'TALE_EXTENSION_UNSUPPORTED',
            `Duplicate virtual extension artifact ${artifact.id}.`,
          );
        }
        ids.add(artifact.id);
        return {
          ...artifact,
          namespace: manifest.namespace,
          contributionClass: contribution.class,
          package: manifest.package,
          version: manifest.version,
          publisher: manifest.publisher,
          integrity: packageIntegrity,
          trust: 'untrusted' as const,
          provenance: manifest.provenance,
        };
      }),
    );
  });
}

function supportsV1(range: string) {
  try {
    return validRange(range) !== null && intersects(range, '>=1.0.0 <2.0.0');
  } catch {
    return false;
  }
}

function defaultTrustRegistryPath() {
  const moduleDirectory = dirname(fileURLToPath(import.meta.url));
  const installed = join(moduleDirectory, 'registry/extensions/trust.json');
  return lstatSync(installed, { throwIfNoEntry: false })
    ? installed
    : join(resolve(moduleDirectory, '../../..'), 'registry/extensions/trust.json');
}

export function loadExtensionTrustRegistry(path = defaultTrustRegistryPath()) {
  return parseJson(path, trustSchema);
}

export function authorizeExtensionExecution(options: {
  packageRoot: string;
  artifactId: string;
  packageBytes: Uint8Array;
  /** SHA-512 integrity obtained from external npm or lockfile metadata. */
  packageIntegrity: string;
  trustRegistry: ExtensionTrustRegistry;
  approval: ExtensionApproval;
  projectId: string;
  surface: 'local' | 'hosted';
  now?: Date;
}) {
  const { packageRoot, manifest } = discoverExtension(options.packageRoot);
  const artifact = manifest.contributions
    .flatMap(({ artifacts }) => artifacts)
    .find(({ id }) => id === options.artifactId);
  const reasons: string[] = [];
  const warnings: string[] = [];
  if (options.surface === 'hosted') {
    reasons.push('Hosted extension execution is prohibited.');
  }
  if (!artifact?.executable || !artifact.entrypoint) {
    reasons.push('Artifact is not executable.');
  }
  if (!verifyExtensionIntegrity(options.packageBytes, options.packageIntegrity)) {
    reasons.push('Package integrity does not match the approved SHA-512.');
  }
  if (!supportsV1(manifest.contractRanges.tale) || !supportsV1(manifest.contractRanges.extension)) {
    reasons.push('Extension contract range is incompatible with Tale tooling 1.x.');
  }
  const publisher = options.trustRegistry.publishers.find(
    (record) =>
      record.publisher === manifest.publisher && record.packages.includes(manifest.package),
  );
  if (!publisher || publisher.status !== 'trusted') {
    reasons.push('Publisher/package pair is untrusted or revoked.');
  }
  if (publisher?.provenanceRequired && !manifest.provenance.npmProvenance) {
    reasons.push('Required npm provenance is absent.');
  }
  const now = options.now ?? new Date();
  const trustAgeDays =
    (now.getTime() - Date.parse(options.trustRegistry.generatedAt)) / (24 * 60 * 60 * 1000);
  if (trustAgeDays > options.trustRegistry.freshness.failAfterDays) {
    reasons.push('Extension trust registry is older than 30 days.');
  } else if (trustAgeDays > options.trustRegistry.freshness.warnAfterDays) {
    warnings.push('Extension trust registry is older than seven days.');
  }
  let approval: ExtensionApproval | undefined;
  try {
    approval = approvalSchema.parse(options.approval);
  } catch {
    reasons.push('Project-local approval is invalid.');
  }
  const requestedCapabilities = artifact?.capabilities ?? [];
  if (
    !approval ||
    approval.revoked ||
    approval.projectId !== options.projectId ||
    approval.package !== manifest.package ||
    approval.publisher !== manifest.publisher ||
    approval.version !== manifest.version ||
    approval.integrity !== options.packageIntegrity ||
    requestedCapabilities.some((capability) => !approval?.capabilities.includes(capability))
  ) {
    reasons.push('Exact project-local execution approval is absent or revoked.');
  }
  if (reasons.length > 0 || !artifact?.entrypoint) {
    throw new TaleToolingError(
      'TALE_EXTENSION_UNTRUSTED',
      `Extension execution denied: ${[...new Set(reasons)].join(' ')}`,
    );
  }
  return {
    allowed: true as const,
    entrypoint: resolveRegularFile(packageRoot, artifact.entrypoint),
    artifactId: artifact.id,
    capabilities: requestedCapabilities,
    warnings,
  };
}
