/**
 * Edição de uma linha de texto num campo do wizard.
 *
 * O campo aceitava só duas coisas — digitar no fim e apagar de trás para a
 * frente. Quem quisesse trocar o meio de um alias (`@/shared/components` para
 * `@app/shared/components`) apertava as setas, não via nada acontecer e ficava
 * sem saída a não ser apagar tudo e redigitar. Aqui o cursor é de verdade:
 * anda, insere no meio, apaga para os dois lados.
 */

import type { KeyEvent } from '@cli/ui/engine/index.js';

export interface TextInput {
  readonly value: string;
  /** Posição do cursor, em caracteres — nunca fora de `[0, comprimento]`. */
  readonly caret: number;
  /**
   * true enquanto o campo ainda mostra a sugestão e o usuário não tocou nela:
   * a primeira tecla digitada substitui a sugestão inteira, em vez de emendar
   * nela. Mover o cursor ou apagar assume o valor e passa a editá-lo.
   */
  readonly pristine: boolean;
}

export function startInput(value: string): TextInput {
  return { value, caret: [...value].length, pristine: true };
}

/**
 * Aplica uma tecla ao campo.
 *
 * Devolve `null` quando a tecla não é de edição — `enter` e `escape` pertencem
 * ao fluxo do wizard, e é ele quem decide o que fazer com elas.
 */
export function editInput(state: TextInput, event: KeyEvent): TextInput | null {
  const chars = [...state.value];
  const caret = clamp(state.caret, chars.length);

  if (event.ctrl) return editWithControl(state, chars, caret, event.key);
  if (event.alt) return null;

  if (event.key.length === 1) {
    // A sugestão inteira sai na primeira tecla: quem já sabe o que quer digita
    // direto, sem apagar caractere por caractere o que a CLI propôs.
    if (state.pristine) return { value: event.key, caret: 1, pristine: false };

    chars.splice(caret, 0, event.key);
    return { value: chars.join(''), caret: caret + 1, pristine: false };
  }

  switch (event.key) {
    case 'backspace':
      if (caret === 0) return { ...state, caret, pristine: false };
      chars.splice(caret - 1, 1);
      return { value: chars.join(''), caret: caret - 1, pristine: false };

    case 'delete':
      if (caret >= chars.length) return { ...state, caret, pristine: false };
      chars.splice(caret, 1);
      return { value: chars.join(''), caret, pristine: false };

    case 'left':
      return { ...state, caret: Math.max(0, caret - 1), pristine: false };

    case 'right':
      return { ...state, caret: Math.min(chars.length, caret + 1), pristine: false };

    case 'home':
      return { ...state, caret: 0, pristine: false };

    case 'end':
      return { ...state, caret: chars.length, pristine: false };

    default:
      return null;
  }
}

/** Os atalhos de linha que qualquer shell oferece. */
function editWithControl(state: TextInput, chars: string[], caret: number, key: string): TextInput | null {
  switch (key) {
    case 'u': // limpa até o começo
      return { value: chars.slice(caret).join(''), caret: 0, pristine: false };

    case 'k': // limpa até o fim
      return { value: chars.slice(0, caret).join(''), caret, pristine: false };

    case 'w': {
      // apaga a palavra anterior, incluindo os separadores que a antecedem
      let start = caret;
      while (start > 0 && isSeparator(chars[start - 1] as string)) start--;
      while (start > 0 && !isSeparator(chars[start - 1] as string)) start--;

      return { value: [...chars.slice(0, start), ...chars.slice(caret)].join(''), caret: start, pristine: false };
    }

    case 'a':
      return { ...state, caret: 0, pristine: false };

    case 'e':
      return { ...state, caret: chars.length, pristine: false };

    default:
      return null;
  }
}

function isSeparator(char: string): boolean {
  return char === ' ' || char === '/' || char === '\\' || char === '.' || char === '-';
}

function clamp(caret: number, length: number): number {
  return Math.max(0, Math.min(caret, length));
}
