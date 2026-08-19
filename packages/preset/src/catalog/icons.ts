/**
 * As famílias de ícones, só o suficiente para o código do preset carregá-las.
 *
 * Quem manda sobre ícones é `<registry>/icons.json` — é de lá que sai o que o
 * `add` instala e o que o `apply` reescreve. Esta tabela existe por um motivo
 * só: o código curto do preset precisa de um número por família, e um número
 * imutável não pode depender da ordem em que o outro catálogo lista as chaves.
 * Uma família publicada lá e ausente daqui continua utilizável; ela só não cabe
 * num código curto até ganhar um `code`.
 */

import type { IconEntry } from '../types.js';

export const ICONS: readonly IconEntry[] = [{ id: 'lucide', code: 0, label: 'Lucide', package: '@ng-icons/lucide' }];
