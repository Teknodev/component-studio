/**
 * Thin re-export shim. The actual implementation now lives in
 * `@blinkpage/component-builder` so that the MCP server (Task #11) and other
 * tools can share the same pipeline.
 *
 * Behavior here is unchanged from the original component-studio version: the
 * `ComponentBuilder` class still accepts `(componentDir, componentRelativePath)`
 * and still spawns `npx vite build` from within the user's project so that
 * `@blinkpage/composer-tools` resolves out of the project's node_modules.
 */

export {
  ComponentBuilder,
  type FilesystemBuildResult,
} from '@blinkpage/component-builder';
