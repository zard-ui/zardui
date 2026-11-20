/**
 * The project lifecycle: start a project (`create`), set up one that exists (`init`), restyle it (`apply`) and add to
 * it (`add`).
 *
 * These tools answer with the command instead of running it, as shadcn's `get_add_command_for_items` does: `create`
 * runs the framework's own generator and installs dependencies for minutes, far past what a tool call should hold, and
 * the agent's shell shows the output and the errors as they happen. Every command carries `--no-interactive`, so it
 * never stops at a question: what is missing fails with a message that names the flag.
 *
 * What the CLI cannot be given in words is the design. It takes a preset code, which the /create page builds; here the
 * same codec (`../design`, a copy of the CLI's) builds it from the choices, so an agent can ask for "violet, Geist,
 * small radius" without a browser.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { encodePreset, parsePresetInput, PresetError } from '../design/codec.js';
import { DEFAULT_DESIGN, DESIGN_FIELDS, normalizeDesign, SQUARE_STYLES, type DesignConfig } from '../design/config.js';
import {
  ACCENT_COLOR_IDS,
  BASE_COLOR_IDS,
  FONTS,
  ICON_LIBRARY_IDS,
  INHERIT_FONT,
  MENU_ACCENT_IDS,
  MENU_APPEARANCE_IDS,
  MENU_COLOR_IDS,
  RADIUS_IDS,
  STYLES,
  themesFor,
} from '../design/options.js';
import { assertRegistryId, InvalidIdentifierError } from '../utils/identifiers.js';
import { fail, json, text } from '../utils/result.js';

export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

/** Yarn runs `npx`: `yarn dlx` does not exist in Yarn 1. The same strings the docs and the /create page print. */
const RUNNERS: Record<PackageManager, string> = {
  npm: 'npx zard-cli@latest',
  pnpm: 'pnpm dlx zard-cli@latest',
  yarn: 'npx zard-cli@latest',
  bun: 'bunx zard-cli@latest',
};

export const TEMPLATES = ['angular', 'nx', 'analog'] as const;
export const PROJECT_TYPES = ['angular', 'angular-library', 'nx', 'nx-library', 'analog'] as const;
export const APPLY_PARTS = ['theme', 'font'] as const;

const FONT_IDS = FONTS.map(font => font.id) as [string, ...string[]];
const THEME_IDS = [...BASE_COLOR_IDS, ...ACCENT_COLOR_IDS] as const;

/** Every field optional: what is left out keeps the default design's value. */
export const designSchema = z
  .object({
    style: z.enum(STYLES.map(style => style.value) as [string, ...string[]]).optional(),
    baseColor: z.enum(BASE_COLOR_IDS).optional(),
    theme: z.enum(THEME_IDS).optional().describe('An accent color, or the base color itself for none'),
    chartColor: z.enum(THEME_IDS).optional(),
    font: z.enum(FONT_IDS).optional(),
    fontHeading: z.enum([INHERIT_FONT, ...FONT_IDS] as [string, ...string[]]).optional(),
    iconLibrary: z.enum(ICON_LIBRARY_IDS).optional(),
    radius: z.enum(RADIUS_IDS).optional(),
    menuColor: z.enum(MENU_COLOR_IDS).optional(),
    menuAppearance: z.enum(MENU_APPEARANCE_IDS).optional(),
    menuAccent: z.enum(MENU_ACCENT_IDS).optional(),
  })
  .describe('Design choices. See get-design-options for every value and how they constrain each other.');

export type DesignInput = z.infer<typeof designSchema>;

export interface ResolvedPreset {
  readonly code: string;
  readonly design: DesignConfig;
  /** Choices the design rules changed, so the agent can tell the user instead of being surprised later. */
  readonly adjusted: string[];
}

/** A preset from a code or from design choices; never both. Throws with a message meant for the model. */
export function resolvePreset(preset: string | undefined, design: DesignInput | undefined): ResolvedPreset | undefined {
  if (preset && design) throw new Error('Pass either preset or design, not both.');

  if (preset) {
    // A code, `--preset <code>` or a whole pasted /create command: the same input the CLI accepts.
    try {
      return { ...parsePresetInput(preset), adjusted: [] };
    } catch (error) {
      if (error instanceof PresetError) throw new Error(`Invalid preset "${preset}": ${error.message}`);
      throw error;
    }
  }

  if (!design) return undefined;

  const normalized = normalizeDesign(design);
  const adjusted = DESIGN_FIELDS.filter(
    field => design[field] !== undefined && design[field] !== normalized[field],
  ).map(field => `${field}: "${design[field]}" became "${normalized[field]}"`);
  return { code: encodePreset(normalized), design: normalized, adjusted };
}

const presetField = z
  .string()
  .optional()
  .describe(
    'A preset code from https://zardui.com/create (e.g. "Z2qIUL"), or the command that page gives. Use design instead to build one.',
  );
const packageManagerField = z.enum(PACKAGE_MANAGERS).optional().describe('Defaults to npm');

/** The answer of every command tool: the command, and what the agent should know before running it. */
function commandResult(command: string, notes: string[], preset?: ResolvedPreset) {
  return json({
    command,
    ...(preset ? { preset: preset.code, design: preset.design } : {}),
    ...(preset?.adjusted.length ? { adjusted: preset.adjusted } : {}),
    notes,
  });
}

const failure = (error: unknown) =>
  fail(error instanceof InvalidIdentifierError || error instanceof Error ? error.message : String(error));

export function buildCreateCommand(options: {
  name: string;
  template: (typeof TEMPLATES)[number];
  preset?: string;
  packageManager?: PackageManager;
  pointer?: boolean;
  rtl?: boolean;
}): string {
  const manager = options.packageManager ?? 'npm';
  const parts = [RUNNERS[manager], 'create', options.name, '--template', options.template];
  // Without a preset `--yes` is what accepts the default design when nobody can be asked.
  parts.push(...(options.preset ? ['--preset', options.preset] : ['--yes']));
  if (manager === 'yarn') parts.push('--package-manager', 'yarn');
  if (options.pointer) parts.push('--pointer');
  if (options.rtl) parts.push('--rtl');
  parts.push('--no-interactive');
  return parts.join(' ');
}

export function registerProjectCommands(server: McpServer): void {
  server.registerTool(
    'get-design-options',
    {
      title: 'Get design options',
      description:
        'Every design choice a Zard UI project can start from (style, base color, accent theme, chart color, fonts, icon library, radius, menu), the default design, and the rules between them. Read it before building a design for get-create-command, get-init-command or get-apply-command.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () =>
      json({
        default: DEFAULT_DESIGN,
        styles: STYLES,
        baseColors: BASE_COLOR_IDS,
        themesByBaseColor: Object.fromEntries(BASE_COLOR_IDS.map(base => [base, themesFor(base)])),
        fonts: FONTS.map(({ id, label, kind }) => ({ id, label, kind })),
        iconLibraries: ICON_LIBRARY_IDS,
        radius: RADIUS_IDS,
        menuColor: MENU_COLOR_IDS,
        menuAppearance: MENU_APPEARANCE_IDS,
        menuAccent: MENU_ACCENT_IDS,
        rules: [
          'theme and chartColor must be one of themesByBaseColor[baseColor]; the base color itself means no accent.',
          `${SQUARE_STYLES.join(' and ')} are square styles: radius is always "none".`,
          'rhea has no "large" radius.',
          'menuAppearance "translucent" always uses menuAccent "subtle".',
          `fontHeading "${INHERIT_FONT}" (or the same font as font) uses the body font for headings.`,
        ],
        builder: 'https://zardui.com/create',
      }),
  );

  server.registerTool(
    'get-create-command',
    {
      title: 'Get create command',
      description:
        'The zard-cli command that starts a NEW project: it runs the framework generator (Angular CLI, Nx or Analog), configures Zard UI with the design and installs button. Pass a preset code or design choices; neither means the default design. Run the command yourself in the directory that will contain the project: it takes minutes and never prompts.',
      inputSchema: {
        name: z
          .string()
          .regex(/^[a-z][a-z0-9-]*$/, 'lowercase letters, digits and dashes, starting with a letter')
          .describe('Project name, also the directory it is created in'),
        template: z.enum(TEMPLATES).describe('angular: an Angular app; nx: an Nx workspace with one; analog: Analog'),
        preset: presetField,
        design: designSchema.optional(),
        packageManager: packageManagerField,
        pointer: z.boolean().optional().describe('Pointer cursor on buttons'),
        rtl: z.boolean().optional().describe('The app reads right to left'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ name, template, preset, design, packageManager, pointer, rtl }) => {
      try {
        const resolved = resolvePreset(preset, design);
        const command = buildCreateCommand({ name, template, preset: resolved?.code, packageManager, pointer, rtl });
        return commandResult(
          command,
          [
            `Run it from the parent directory: it creates ./${name} and fails if it exists.`,
            'It refuses to run inside another Angular or Nx workspace; add --allow-nested if that is intended.',
            'Then add components with get-add-command.',
          ],
          resolved,
        );
      } catch (error) {
        return failure(error);
      }
    },
  );

  server.registerTool(
    'get-init-command',
    {
      title: 'Get init command',
      description:
        'The zard-cli command that sets Zard UI up in an EXISTING Angular, Nx or Analog project or library: dependencies, path aliases, the core, the theme and provideZard(). It overwrites the global stylesheet. Use get-create-command for a new project.',
      inputSchema: {
        type: z.enum(PROJECT_TYPES).describe('What the project is; the CLI does not guess it'),
        project: z
          .string()
          .optional()
          .describe('The workspace project to configure (Nx, or a multi-project workspace)'),
        preset: presetField,
        design: designSchema.optional(),
        baseColor: z
          .enum(BASE_COLOR_IDS)
          .optional()
          .describe('Theme base color for the default style; ignored with a preset or design'),
        css: z.string().optional().describe('The global stylesheet, when it is not the default one'),
        rtl: z.boolean().optional(),
        pointer: z.boolean().optional().describe('Pointer cursor on buttons; needs a preset or design'),
        packageManager: packageManagerField,
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ type, project, preset, design, baseColor, css, rtl, pointer, packageManager }) => {
      try {
        const resolved = resolvePreset(preset, design);
        if (pointer && !resolved) throw new Error('pointer needs a preset or design.');

        const parts = [RUNNERS[packageManager ?? 'npm'], 'init', '--type', type];
        if (project) parts.push('--project', project);
        if (resolved) parts.push('--preset', resolved.code);
        else if (baseColor) parts.push('--base-color', baseColor);
        if (css) parts.push('--css', css);
        if (rtl) parts.push('--rtl');
        if (pointer) parts.push('--pointer');
        // `--yes` because init overwrites the global stylesheet, which nobody can confirm here.
        parts.push('--yes', '--no-interactive');

        return commandResult(
          parts.join(' '),
          [
            'Run it at the workspace root. It replaces the global stylesheet with the Zard UI theme.',
            'Then add components with get-add-command.',
          ],
          resolved,
        );
      } catch (error) {
        return failure(error);
      }
    },
  );

  server.registerTool(
    'get-apply-command',
    {
      title: 'Get apply command',
      description:
        'The zard-cli command that restyles a project already set up with Zard UI: replaces the theme, fonts and the style of the installed components, keeping every rule of its own. Pass a preset code or design choices.',
      inputSchema: {
        preset: presetField,
        design: designSchema.optional(),
        only: z.enum(APPLY_PARTS).optional().describe('Apply only the theme colors or only the fonts'),
        pointer: z.boolean().optional().describe('true adds the pointer cursor rule, false removes it'),
        packageManager: packageManagerField,
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ preset, design, only, pointer, packageManager }) => {
      try {
        const resolved = resolvePreset(preset, design);
        if (!resolved) throw new Error('Pass a preset or design: apply needs something to apply.');

        const parts = [RUNNERS[packageManager ?? 'npm'], 'apply', '--preset', resolved.code];
        if (only) parts.push('--only', only);
        if (pointer !== undefined) parts.push(pointer ? '--pointer' : '--no-pointer');
        parts.push('--no-interactive');

        return commandResult(parts.join(' '), ['Run it at the project root, after init.'], resolved);
      } catch (error) {
        return failure(error);
      }
    },
  );

  server.registerTool(
    'get-add-command',
    {
      title: 'Get add command',
      description:
        'The zard-cli command that adds components and blocks to a project set up with Zard UI. Registry dependencies are resolved by the CLI. To run it for one component from here, use install-component.',
      inputSchema: {
        items: z.array(z.string()).min(1).describe('Component or block names, e.g. ["button", "date-picker"]'),
        overwrite: z.boolean().optional().describe('Replace files that already exist'),
        packageManager: packageManagerField,
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ items, overwrite, packageManager }) => {
      try {
        for (const item of items) assertRegistryId(item, 'component');
        const parts = [RUNNERS[packageManager ?? 'npm'], 'add', ...items, '--yes'];
        if (overwrite) parts.push('--overwrite');
        parts.push('--no-interactive');
        return commandResult(parts.join(' '), ['Run it at the project root.']);
      } catch (error) {
        return failure(error);
      }
    },
  );

  server.registerTool(
    'get-audit-checklist',
    {
      title: 'Get audit checklist',
      description:
        'A checklist to run after adding components or writing code with them, before telling the user it is done.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () =>
      text(`## Zard UI audit checklist

- [ ] Every Zard UI component used in a template is in that component's \`imports\` array (standalone components).
- [ ] Selectors and inputs come from get-component-docs (\`z-button\`, \`zType\`), not from shadcn/React memory.
- [ ] Imports use the alias in components.json (\`@/shared/components/...\`), not a path into node_modules.
- [ ] \`provideZard()\` is in the app config providers, and overlays (dialog, sheet, toast) have what their docs ask for.
- [ ] Icons come from the icon library in components.json, registered with \`provideIcons\`.
- [ ] The production build passes (\`ng build\`, \`nx build <app>\` or \`npm run build\`) and so does lint.
- [ ] Open the page (with the Playwright MCP if available): no console errors, light and dark mode both render.`),
  );
}
