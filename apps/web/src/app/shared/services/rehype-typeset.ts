import { visit } from 'unist-util-visit';

/**
 * The slice of HAST these plugins touch.
 *
 * Declared here rather than imported: `@types/hast` reaches this project only
 * as a transitive dependency, and a plugin this small does not justify taking
 * one on. Both plugins read a tag name and edit a class, so that is the shape.
 */
interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** Adds a class without discarding the ones the node already carries. */
function addClass(node: HastNode, className: string): void {
  const existing = node.properties?.['class'] ?? node.properties?.['className'] ?? [];
  const classes = Array.isArray(existing) ? existing : String(existing).split(/\s+/).filter(Boolean);

  if (classes.includes(className)) return;

  node.properties = { ...node.properties, class: [...classes, className] };
}

function containsPre(node: HastNode): boolean {
  if (node?.tagName === 'pre') return true;
  return Array.isArray(node?.children) && node.children.some(child => containsPre(child));
}

/**
 * Keeps typeset off the code blocks.
 *
 * `rehypeEnhancedCode` builds a block with a header, a copy button and icons,
 * all sized by hand. Typeset styles `pre`, `pre code` and `img` — all three
 * appear in there. Without this mark the block survives only by accident: the
 * `pre.shiki` rules in `styles.css` sit outside any layer and therefore win,
 * which leaves the protection resting on where someone wrote a selector.
 *
 * The root is the rule: in markdown a code block is always a top-level block,
 * so marking the root child that contains it covers the whole wrapper. A bare
 * `pre` is marked too, for a block inside a list item.
 */
export function rehypeNotTypeset() {
  return (tree: HastNode) => {
    for (const child of tree.children ?? []) {
      if (child.type === 'element' && containsPre(child)) addClass(child, 'not-typeset');
    }

    visit(tree, 'element', (node: HastNode) => {
      if (node.tagName === 'pre') addClass(node, 'not-typeset');
    });
  };
}

/**
 * Wraps every table in a container that scrolls horizontally.
 *
 * Typeset lets a table be a table and shrink to fit; a five-column API table
 * is unreadable that way. `typeset-scroll` gives back the natural width and
 * hands the overflow to the container — and typeset styles the wrapper itself,
 * so no utility class is needed here.
 */
export function rehypeScrollableTables() {
  return (tree: HastNode) => {
    visit(tree, 'element', (node: HastNode, index, parent: HastNode | undefined) => {
      if (node.tagName !== 'table' || !parent || index === null || index === undefined) return;

      // The class may be an array or a string, depending on who built the node.
      const parentClass = parent.properties?.['class'];
      const classes = Array.isArray(parentClass) ? parentClass : String(parentClass ?? '').split(/\s+/);
      if (parent.tagName === 'div' && classes.includes('typeset-scroll')) return;

      parent.children![index] = {
        type: 'element',
        tagName: 'div',
        properties: { class: ['typeset-scroll'] },
        children: [node],
      };
    });
  };
}
