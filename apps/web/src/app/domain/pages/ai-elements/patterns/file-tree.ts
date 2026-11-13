import { AI_ELEMENTS_FILE_TREE_FILE_TREE } from '@generated/ai-elements/file-tree/file-tree';
import { BLOCK_1, BLOCK_2, TABS_0 } from '@generated/pages/ai-elements/file-tree';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsFileTreeComponent } from '../demos/file-tree/file-tree';

export const FILE_TREE: AiElementData = {
  slug: 'file-tree',
  preview: { name: 'file-tree', component: ZardAiElementsFileTreeComponent, codeData: AI_ELEMENTS_FILE_TREE_FILE_TREE },
  intro: [
    'File Tree is the files the agent changed, shown as folders you can open. A folder is a [Collapsible](/docs/components/collapsible). A file is a [Button](/docs/components/button). For a single file the agent read or edited, use a [Tool](/docs/ai-elements/tool) line instead.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [
        {
          prose:
            'Render nodes recursively, with a template that calls itself. Nest each folder’s children in its `z-collapsible-content`.',
        },
        { code: BLOCK_1 },
        { code: BLOCK_2 },
        { prose: 'See [Collapsible](/docs/components/collapsible).' },
      ],
    },
  ],
};
