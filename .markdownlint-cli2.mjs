// https://github.com/DavidAnson/markdownlint#rules--aliases
export default {
  config: {
    default: true,
    MD004: false, // ul-style — buggy
    MD009: { br_spaces: 0, strict: true, list_item_empty_lines: false },
    MD013: false, // line-length — handled by Prettier
    MD014: false, // commands-show-output
    MD024: { siblings_only: true },
    MD025: { level: 1, front_matter_title: '' },
    MD028: false, // no-blanks-blockquote
    MD029: false, // ol-prefix — buggy
    MD031: false, // blanks-around-fences
    MD033: false, // no-inline-html
    MD034: false, // no-bare-urls
    MD036: false, // no-emphasis-as-heading
    MD038: false, // false positives in MDX
    MD041: false, // false positives in MDX
    MD051: false, // link-fragments — false positives in changelogs
    MD052: false, // reference-links-images
    MD040: false, // fenced-code-language — too many pre-existing unlabelled blocks
    MD059: false, // descriptive-link-text
    MD060: false, // table-column-style — too strict for generated/compact tables
  },
  ignores: [
    'CHANGELOG.old.md',
    'IMPLEMENTATION_SUMMARY.md',
    '**/node_modules/**',
    '**/build/**',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'docs/public/**',
    'docs/export/**',
    'docs/archive/research/**',
    'docs/versioned/**',
    '.agentic-loop/**',
    'analysis/**',
    'plans/**',
    'tools/.eval-context.md',
  ],
};
