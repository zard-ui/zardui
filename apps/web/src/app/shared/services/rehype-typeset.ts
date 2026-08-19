import { visit } from 'unist-util-visit';

/** Acrescenta uma classe sem descartar as que o nó já carrega. */
function addClass(node: any, className: string): void {
  const existing = node.properties?.class ?? node.properties?.className ?? [];
  const classes = Array.isArray(existing) ? existing : String(existing).split(/\s+/).filter(Boolean);

  if (classes.includes(className)) return;

  node.properties = { ...node.properties, class: [...classes, className] };
}

function containsPre(node: any): boolean {
  if (node?.tagName === 'pre') return true;
  return Array.isArray(node?.children) && node.children.some((child: any) => containsPre(child));
}

/**
 * Protege os blocos de código do typeset.
 *
 * `rehypeEnhancedCode` monta um bloco com cabeçalho, botão de copiar e ícones,
 * todo dimensionado à mão. O typeset estiliza `pre`, `pre code` e `img` — os
 * três aparecem aí dentro. Sem esta marca o bloco só sobrevive por acidente:
 * as regras de `pre.shiki` em `styles.css` estão fora de camada e por isso
 * vencem, o que deixa a proteção dependendo de onde alguém escreveu o seletor.
 *
 * A regra é a raiz: em markdown, um bloco de código é sempre um bloco de topo,
 * então marcar o filho da raiz que o contém cobre o wrapper inteiro. O `pre`
 * solto também é marcado, para o caso de um bloco dentro de item de lista.
 */
export function rehypeNotTypeset() {
  return (tree: any) => {
    for (const child of tree.children ?? []) {
      if (child.type === 'element' && containsPre(child)) addClass(child, 'not-typeset');
    }

    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'pre') addClass(node, 'not-typeset');
    });
  };
}

/**
 * Envolve toda tabela num container que rola na horizontal.
 *
 * O typeset deixa a tabela ser tabela e encolher para caber; uma tabela de API
 * com cinco colunas fica ilegível assim. `typeset-scroll` devolve a largura
 * natural e passa o transbordo para o container, e é o próprio typeset quem
 * estiliza o wrapper — nada de classe de utilitário aqui.
 */
export function rehypeScrollableTables() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: any, parent: any) => {
      if (node.tagName !== 'table' || !parent || index === null || index === undefined) return;
      if (parent.tagName === 'div' && parent.properties?.class?.includes?.('typeset-scroll')) return;

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { class: ['typeset-scroll'] },
        children: [node],
      };
    });
  };
}
