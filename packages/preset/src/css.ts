/**
 * O CSS global que o preset descreve — o arquivo que o `init` grava.
 *
 * Os blocos fixos abaixo (`@theme inline`, `@layer base`, a barra de rolagem)
 * vieram literalmente de `packages/cli/src/core/themes/theme-definitions.ts`,
 * incluindo o espaçamento. A saída é comparada byte a byte com a das cinco
 * funções que existiam lá (`css.spec.ts`): o objetivo desta migração era tirar
 * os tokens de dois lugares, não mudar o que quem roda o comando recebe.
 */

import type { ResolvedPreset } from './resolve.js';
import { THEME_COLOR_KEYS, type ThemeColors } from './types.js';

const tailwindConfiguration = (corePath: string): string => `
@layer ng-icon, theme, base, components, utilities;
@import 'tailwindcss';
@import '${corePath}/css/tailwind';
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));
`;

const inlineTheme = `
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
`;

const layerBase = `
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield; /* Added for general compatibility */
  }
}
`;

const windowsScrollbar = `
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  border-radius: 5px;
  background: var(--muted);
}
`;

/** As declarações de um bloco. `--radius` só no `:root` — é assim que o CSS atual está escrito. */
export function renderTokens(colors: ThemeColors, radius?: string): string {
  const lines = radius ? [`  --radius: ${radius};`] : [];

  for (const key of THEME_COLOR_KEYS) lines.push(`  --${key}: ${colors[key]};`);

  return lines.join('\n');
}

export interface RenderThemeCssOptions {
  /** O caminho do core dentro do projeto, para o `@import`. */
  readonly corePath: string;
}

/** O arquivo de estilos completo, já sem as bordas em branco — como `getThemeContent` sempre devolveu. */
export function renderThemeCss(resolved: ResolvedPreset, { corePath }: RenderThemeCssOptions): string {
  return `
${tailwindConfiguration(corePath)}

:root {
${renderTokens(resolved.light, resolved.radius)}
}

.dark {
${renderTokens(resolved.dark)}
}

${inlineTheme}
${layerBase}
${windowsScrollbar}
`.trim();
}

/** Só os dois blocos de tokens — o que o `apply` reescreve num projeto vivo, sem tocar no resto. */
export function renderThemeBlocks(resolved: ResolvedPreset): string {
  return `:root {
${renderTokens(resolved.light, resolved.radius)}
}

.dark {
${renderTokens(resolved.dark)}
}`;
}
