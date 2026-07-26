#!/usr/bin/env node
/**
 * Doc-Sync Audit — verifies component markdown docs list all Tale UI-specific props.
 * Run: node tools/audit-docs.js
 *
 * For each component:
 *   1. Reads the Props interfaces from packages/react/src/{name}/*.styled.tsx
 *   2. Extracts Tale UI-specific props (not className, not inherited from Aria/React)
 *   3. Checks docs/components/{name}.md prop sections list each prop
 *   4. Reports mismatches
 */
const fs = require('fs');
const path = require('path');

const srcDir = 'packages/react/src';
const docsDir = 'docs/components';

// Props that are always present and never need explicit documentation
const SKIP_PROPS = new Set(['className']);

// Components that don't have meaningful Tale UI-specific props to document
// (they only extend Aria/React types + className)
const SKIP_COMPONENTS = new Set([
  'csp-provider', // Provider, no visual props
  'i18n-provider', // Provider, no visual props
  'merge-props', // Utility function, not a component
  'container', // Simple wrapper
  'checkbox-group', // Re-export, no own styled file with custom props
  'radio-group', // Re-export, no own styled file with custom props
  'toggle-group', // Re-export, no own styled file with custom props
]);

// Collect styled component files
const dirs = fs.readdirSync(srcDir, { withFileTypes: true }).filter((d) => d.isDirectory());
const components = [];

for (const d of dirs) {
  if (SKIP_COMPONENTS.has(d.name)) {
    continue;
  }

  const dirPath = path.join(srcDir, d.name);
  const files = fs.readdirSync(dirPath);
  const styledFile = files.find(
    (f) =>
      (f.endsWith('.styled.tsx') || f === 'CheckboxGroup.tsx') &&
      !f.includes('.test.') &&
      !f.includes('.spec.'),
  );

  if (!styledFile) {
    continue;
  }

  const content = fs.readFileSync(path.join(dirPath, styledFile), 'utf8');
  const docFile = path.join(docsDir, `${d.name}.md`);

  components.push({ name: d.name, content, docFile });
}

/**
 * Extract Tale UI-specific props from a styled component file.
 * Looks for properties defined directly in the interface body (not inherited).
 * Returns map of { InterfaceName: [propName, ...] }
 */
function extractProps(content) {
  const result = {};

  // Match exported interface blocks
  const interfaceRegex =
    /export\s+(?:type|interface)\s+(\w+Props)(?:<[^>]*>)?\s*(?:=\s*|extends\s+[^{]*)\{([^}]*)\}/gs;
  let match;

  while ((match = interfaceRegex.exec(content)) !== null) {
    const interfaceName = match[1];
    const body = match[2];

    // Extract prop names: lines like "  variant?: ..." or "  size?: ..."
    const props = [];
    const propRegex = /^\s+(\w+)\??\s*:/gm;
    let propMatch;

    while ((propMatch = propRegex.exec(body)) !== null) {
      if (!SKIP_PROPS.has(propMatch[1])) {
        props.push(propMatch[1]);
      }
    }

    if (props.length > 0) {
      result[interfaceName] = props;
    }
  }

  return result;
}

/**
 * Check if a markdown doc has Props or part-specific Props sections that
 * mention each prop.
 */
function checkDoc(docFile, propsMap) {
  if (!fs.existsSync(docFile)) {
    return { missing: true, undocumented: [] };
  }

  const content = fs.readFileSync(docFile, 'utf8');
  const propSections = [...content.matchAll(/^## (?:Props(?:\s+.*)?|[^\n]*\sProps)\s*$/gim)];

  if (propSections.length === 0) {
    // Collect all props that should be documented
    const allProps = Object.values(propsMap).flat();
    return { missing: false, noSection: true, undocumented: allProps };
  }

  // Compound components document each public part separately. Aggregate every
  // H2 ending in "Props" so Root, Panel, Handle, and similar sections are all
  // checked without forcing their tables into one misleading section.
  const propsSection = propSections
    .map((match) => content.slice(match.index + match[0].length).split(/^## /m)[0] || '')
    .join('\n');

  const undocumented = [];
  for (const [, props] of Object.entries(propsMap)) {
    for (const prop of props) {
      // Check if prop appears in a table row: | propName | or | `propName` |
      const plain = `| ${prop} `;
      const plainNoSpace = `| ${prop}|`;
      const backtick = `| \`${prop}\` `;
      const backtickNoSpace = `| \`${prop}\`|`;
      if (
        !propsSection.includes(plain) &&
        !propsSection.includes(plainNoSpace) &&
        !propsSection.includes(backtick) &&
        !propsSection.includes(backtickNoSpace)
      ) {
        undocumented.push(prop);
      }
    }
  }

  return { missing: false, noSection: false, undocumented };
}

// Run audit
const issues = [];

for (const { name, content, docFile } of components) {
  const propsMap = extractProps(content);

  // Skip components with no Tale UI-specific props
  if (Object.keys(propsMap).length === 0) {
    continue;
  }

  const result = checkDoc(docFile, propsMap);

  if (result.missing) {
    issues.push({ name, type: 'no-doc', props: Object.values(propsMap).flat() });
  } else if (result.noSection) {
    issues.push({ name, type: 'no-section', props: result.undocumented });
  } else if (result.undocumented.length > 0) {
    issues.push({ name, type: 'missing-props', props: result.undocumented });
  }
}

if (issues.length === 0) {
  console.log(`✅ All ${components.length} component docs have matching prop tables.`);
  process.exit(0);
} else {
  console.log(`❌ ${issues.length} components have doc-sync issues:\n`);
  for (const { name, type, props } of issues) {
    if (type === 'no-doc') {
      console.log(`  ${name}: no doc file (docs/components/${name}.md)`);
    } else if (type === 'no-section') {
      console.log(`  ${name}: missing Props section (needs: ${props.join(', ')})`);
    } else {
      console.log(`  ${name}: undocumented props: ${props.join(', ')}`);
    }
  }
  process.exit(1);
}
