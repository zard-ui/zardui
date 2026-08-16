/**
 * As famílias de ícones que o `components.json` aceita em `icons`.
 *
 * Todo componente da biblioteca desenha através do `<ng-icon>` do ng-icons, que
 * é agnóstico de família: o que amarra o desenho a uma delas é o pacote de onde
 * os símbolos são importados (`@ng-icons/lucide`) e o prefixo que eles carregam
 * (`lucideCheck`). As duas coisas estão declaradas aqui, e é só isso que separa
 * uma família da outra no caminho de instalação.
 *
 * Esta tabela é a cópia local — a que vale quando o registry não responde. A
 * lista boa vem de `<registry>/icons.json`, e é isso que permite uma família
 * nova entrar sem que ninguém precise atualizar a CLI.
 */

export interface IconFamilyInfo {
  /** Como aparece no `components.json`. */
  readonly value: string;
  /** Nome de exibição, para prompts e relatórios. */
  readonly label: string;
  /** O pacote npm que o projeto precisa ter instalado. */
  readonly package: string;
  /** O prefixo dos símbolos exportados por esse pacote (`lucide` → `lucideCheck`). */
  readonly prefix: string;
}

/**
 * Uma string, e não a união das famílias conhecidas.
 *
 * O tipo literal seria mais preciso e mais errado: as famílias passaram a vir do
 * registry, então o conjunto válido é o que estiver publicado no momento da
 * execução, e não o que existia quando a CLI foi compilada. Quem valida é
 * `assertIconFamily`, contra o catálogo em mãos.
 */
export type IconFamily = string;

export const ICON_FAMILIES: Record<string, IconFamilyInfo> = {
  lucide: {
    value: 'lucide',
    label: 'Lucide',
    package: '@ng-icons/lucide',
    prefix: 'lucide',
  },
};

/** A família usada por `libs/zard` — a que está escrita nos arquivos do registry. */
export const SOURCE_ICON_FAMILY: IconFamily = 'lucide';

/** O pacote que registra o `<ng-icon>`, comum a todas as famílias. */
export const ICON_CORE_PACKAGE = '@ng-icons/core';
