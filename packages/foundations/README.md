# @tale-ui/foundations

Renderer-neutral Tale UI theme resolution, presets, component contracts,
state controllers, and portable style recipes.

This is a workspace-supported experimental package. The current repository
publication workflow does not publish it.

This package has no React or platform runtime dependency.

Foundational component contracts reference a portable recipe only when that
recipe exists and belongs to the same component. Contracts without a portable
recipe omit `recipeId`.
