# Component Deep Audit Prompt

Use this prompt with Claude Code agents to perform a deep quality audit of a Tale UI component. Run against individual components or batches.

## Usage

```
/loop 10m node tools/audit-components.js --verbose
```

Or manually audit a single component:

```
node tools/audit-components.js --component=button --verbose
```

## Deep Audit Checklist (for AI agents)

When auditing a component `{name}` (kebab-case) / `{Name}` (PascalCase):

### 1. JSDoc @example Accuracy

- [ ] Read `packages/react/src/{name}/{Name}.styled.tsx`
- [ ] Verify the `@example` block exists on the Root/main export
- [ ] Verify the import path in @example matches `@tale-ui/react/{name}`
- [ ] Verify all sub-parts shown in the example actually exist as exports
- [ ] Verify the composition pattern is correct (no missing required wrappers)
- [ ] Verify prop names and values are valid

### 2. Markdown Doc Quality

- [ ] Read `docs/components/{name}.md`
- [ ] Has import statement at top matching package.json export
- [ ] Has `## Parts` table (for namespace components) listing ALL exported parts with descriptions
- [ ] Has `## Props` table listing ALL Tale UI-specific props with Type, Default, Description
- [ ] Has `## Basic Usage` with a working example
- [ ] Has `## Examples` section with variant/state showcases
- [ ] Has `## CSS Classes` listing ALL BEM classes from `packages/styles/src/{name}.css`
- [ ] Has `## Notes` with important gotchas
- [ ] Examples use correct import paths
- [ ] Examples show realistic, copy-pasteable code
- [ ] No references to non-existent props or parts

### 3. Component Index

- [ ] `docs/component-index.md` row exists with correct Description, Import, Parts
- [ ] Parts list matches actual exports (excluding Visual/internal parts)

### 4. Consumer Snippet

- [ ] Generated `docs/consumer-claude-md-snippet.md` includes the component
- [ ] Generated namespace/simple/deprecated categorization matches `registry/components.json`
- [ ] Critical component-specific gotchas live in canonical component docs/pitfalls for just-in-time retrieval

### 5. Storybook Story

- [ ] Story exists at `playground/storybook/src/stories/{Name}.stories.tsx`
- [ ] Default story with argType controls for all props
- [ ] Variant showcase story
- [ ] Disabled state story
- [ ] Size variants story (if applicable)

### 6. CSS Consistency

- [ ] All BEM classes used in styled.tsx have matching CSS rules in styles/src/{name}.css
- [ ] All CSS classes documented in markdown match actual CSS file
- [ ] Shared primitives in `_primitives.css` include this component's selectors where applicable

### 7. Cross-reference Accuracy

- [ ] CLAUDE.md audit table row shows all ✓
- [ ] packages/react/README.md lists the component
- [ ] packages/react/package.json has the export
- [ ] packages/styles/package.json has the CSS export
- [ ] styles/src/index.css has the @import

## How to Fix Common Issues

### Missing @example

Add a JSDoc block above the main export (Root for namespace, component for simple):

````tsx
/**
 * Description of the component.
 *
 * @example
 * ```tsx
 * import { ComponentName } from '@tale-ui/react/{name}';
 *
 * <ComponentName.Root>
 *   <ComponentName.Part>content</ComponentName.Part>
 * </ComponentName.Root>
 * ```
 */
````

### Missing CSS Classes in doc

Read `packages/styles/src/{name}.css`, extract all `.tale-{name}*` selectors, and add them to the `## CSS Classes` section of the markdown doc.

### Missing from component-index.md

Add a row to the appropriate category table:

```
| ComponentName | Description | `@tale-ui/react/{name}` | Root, Part1, Part2, ... |
```
