import { visit } from 'unist-util-visit';

export function rehypeComponentBadges() {
  return (tree: any) => {
    let currentType: string | null = null;

    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'p' && node.children?.length > 0) {
        const firstChild = node.children[0];

        if (firstChild?.type === 'text') {
          const text = firstChild.value || '';
          const match = text.match(/^(\[[\w-]+\])\s+(Component|Directive|Service|Pipe)$/);

          if (match) {
            const [, selector, typeName] = match;
            const typeLower = typeName.toLowerCase();
            currentType = typeLower;
            const selectorClean = selector.replace(/[[\]]/g, '');

            node.properties = {
              ...node.properties,
              class: [...(node.properties?.class || []), `api-${typeLower}`],
            };

            node.children = [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  class: ['component-selector'],
                },
                children: [{ type: 'text', value: selectorClean }],
              },
              { type: 'text', value: ' ' },
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  class: ['component-badge', `component-badge--${typeLower}`],
                },
                children: [{ type: 'text', value: typeName }],
              },
            ];
          }
        }
      }

      if (currentType) {
        if (node.tagName === 'div' && node.children?.[0]?.tagName === 'table') {
          node.properties = {
            ...node.properties,
            class: [...(node.properties?.class || []), `api-table-wrapper--${currentType}`],
          };
          node.children[0].properties = {
            ...node.children[0].properties,
            class: [...(node.children[0].properties?.class || []), `api-table--${currentType}`],
          };
        } else if (node.tagName === 'table') {
          node.properties = {
            ...node.properties,
            class: [...(node.properties?.class || []), `api-table--${currentType}`],
          };
        }
      }

      if (node.tagName === 'h1' || node.tagName === 'h2' || node.tagName === 'h5') {
        currentType = null;
      }
    });
  };
}
