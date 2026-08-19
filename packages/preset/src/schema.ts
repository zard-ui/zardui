/**
 * O schema do preset de arquivo (`zard.preset.json`).
 *
 * Vive num módulo à parte de propósito: é o único ponto do pacote que depende do
 * zod, e quem só precisa resolver tokens — o site, no caminho do preview — não
 * deve carregar um validador junto. `index.ts` não o reexporta; a CLI importa
 * `@zardui/preset/schema` diretamente.
 *
 * Cor editada à mão não cabe no código curto (são 31 tokens em dois modos), e é
 * para isso que o arquivo existe: o mesmo preset, com os overrides junto.
 */

import { z } from 'zod';

const colorMapSchema = z.record(z.string(), z.string());

export const themeColorsOverrideSchema = z.object({
  light: colorMapSchema.optional(),
  dark: colorMapSchema.optional(),
});

export const presetSchema = z.object({
  $schema: z.string().optional(),
  version: z.literal(1),
  name: z.string().optional(),
  /** Tom neutro da base: neutral | stone | zinc | gray | slate. */
  baseColor: z.string().default('neutral'),
  /** Cor de destaque do catálogo; 'neutral' = sem destaque. */
  theme: z.string().default('neutral'),
  /** Paleta de --chart-1..5. */
  chart: z.string().default('default'),
  /** Id do raio no catálogo → o valor de --radius. */
  radius: z.string().default('default'),
  /** Família de ícones; validada contra o catálogo remoto de ícones. */
  icons: z.string().default('lucide'),
  /** 'class' instala o script de tema + provider; 'off' deixa só o claro. */
  darkMode: z.enum(['class', 'off']).default('class'),
  rtl: z.boolean().default(false),
  /** Overrides de token — só em preset de arquivo, nunca no código curto. */
  colors: themeColorsOverrideSchema.optional(),
  // RESERVADO — typeset. O tipo `never` é o que faz qualquer tentativa de ler,
  // escrever ou perguntar sobre fonte parar no compilador, e não numa revisão.
  font: z.never().optional(),
  fontHeading: z.never().optional(),
});

export type PresetFile = z.infer<typeof presetSchema>;
