/**
 * @tale-ui/a2ui — A2UI Protocol Renderer for Tale UI
 *
 * Renders A2UI agent messages as fully-themed, accessible Tale UI components.
 *
 * @example
 * ```tsx
 * import { A2UIProvider, A2UISurface } from '@tale-ui/a2ui/renderer';
 * import { taleUICatalog } from '@tale-ui/a2ui/catalog';
 *
 * <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
 *   <A2UISurface surfaceId="main" />
 * </A2UIProvider>
 * ```
 */

// Types
export type {
  A2UIMessage,
  BeginRenderingMessage,
  SurfaceUpdateMessage,
  DataModelUpdateMessage,
  DeleteSurfaceMessage,
  A2UIComponent,
  DataBinding,
  A2UIAction,
  CatalogEntry,
  AdapterContext,
  Catalog,
  SurfaceState,
  TreeNode,
} from './types.ts';
export { isDataBinding } from './types.ts';

// Catalog
export { taleUICatalog, createCatalog } from './catalog.ts';
export { taleChatA2UICatalog } from './chat.ts';

// Icon registry
export { resolveIcon, registerIcons, getIconNames } from './icon-registry.ts';

// Renderer
export {
  A2UIProvider,
  useA2UI,
  A2UISurface,
  A2UINode,
  buildTree,
  findOrphanedRefs,
  createDataModelStore,
  useDataModelValue,
  useActionDispatcher,
} from './renderer/index.ts';

export type {
  A2UIProviderProps,
  A2UIContextValue,
  A2UISurfaceProps,
  A2UINodeProps,
  DataModelStore,
  OnAction,
} from './renderer/index.ts';
