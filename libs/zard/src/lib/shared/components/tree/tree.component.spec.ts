import { ZardTreeService } from './tree.service';
import type { TreeNode } from './tree.types';

jest.mock('../../utils/merge-classes', () => ({
  mergeClasses: jest.fn().mockImplementation((...args: any[]) => args.filter(Boolean).join(' ') || 'default-classes'),
  transform: jest.fn(value => value),
  noopFn: jest.fn(),
}));

const MOCK_DATA: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        key: 'app',
        label: 'app',
        icon: 'folder',
        children: [
          { key: 'app.ts', label: 'app.component.ts', icon: 'file', leaf: true },
          { key: 'app.html', label: 'app.component.html', icon: 'file', leaf: true },
        ],
      },
      { key: 'main.ts', label: 'main.ts', icon: 'file', leaf: true },
    ],
  },
  {
    key: 'readme',
    label: 'README.md',
    icon: 'file',
    leaf: true,
  },
  {
    key: 'disabled-node',
    label: 'Disabled',
    disabled: true,
    leaf: true,
  },
];

describe('ZardTreeService', () => {
  let service: ZardTreeService;

  beforeEach(() => {
    service = new ZardTreeService();
    service.setData(MOCK_DATA);
  });

  describe('expand/collapse', () => {
    it('should expand a node', () => {
      service.expand('src');
      expect(service.isExpanded('src')).toBe(true);
    });

    it('should collapse a node', () => {
      service.expand('src');
      service.collapse('src');
      expect(service.isExpanded('src')).toBe(false);
    });

    it('should toggle a node', () => {
      service.toggle('src');
      expect(service.isExpanded('src')).toBe(true);
      service.toggle('src');
      expect(service.isExpanded('src')).toBe(false);
    });

    it('should expand all nodes', () => {
      service.expandAll();
      expect(service.isExpanded('src')).toBe(true);
      expect(service.isExpanded('app')).toBe(true);
    });

    it('should collapse all nodes', () => {
      service.expandAll();
      service.collapseAll();
      expect(service.isExpanded('src')).toBe(false);
      expect(service.isExpanded('app')).toBe(false);
    });

    it('should not expand leaf nodes', () => {
      service.expand('readme');
      expect(service.isExpanded('readme')).toBe(true); // service doesn't gate, tree UI does
    });
  });

  describe('selection', () => {
    it('should select a node in single mode', () => {
      service.select('app.ts', 'single');
      expect(service.isSelected('app.ts')).toBe(true);
    });

    it('should deselect previous node in single mode', () => {
      service.select('app.ts', 'single');
      service.select('main.ts', 'single');
      expect(service.isSelected('app.ts')).toBe(false);
      expect(service.isSelected('main.ts')).toBe(true);
    });

    it('should toggle selection in multiple mode', () => {
      service.select('app.ts', 'multiple');
      service.select('main.ts', 'multiple');
      expect(service.isSelected('app.ts')).toBe(true);
      expect(service.isSelected('main.ts')).toBe(true);

      service.select('app.ts', 'multiple');
      expect(service.isSelected('app.ts')).toBe(false);
      expect(service.isSelected('main.ts')).toBe(true);
    });

    it('should deselect a node', () => {
      service.select('app.ts', 'single');
      service.deselect('app.ts');
      expect(service.isSelected('app.ts')).toBe(false);
    });

    it('should return selected nodes', () => {
      service.select('app.ts', 'single');
      const selected = service.getSelectedNodes();
      expect(selected).toHaveLength(1);
      expect(selected[0].key).toBe('app.ts');
    });
  });

  describe('checkbox with propagation', () => {
    it('should check a leaf node', () => {
      const leafNode = { key: 'main.ts', label: 'main.ts', leaf: true } as TreeNode;
      service.toggleCheck(leafNode);
      expect(service.getCheckState('main.ts')).toBe('checked');
    });

    it('should uncheck a checked node', () => {
      const leafNode = { key: 'main.ts', label: 'main.ts', leaf: true } as TreeNode;
      service.toggleCheck(leafNode);
      service.toggleCheck(leafNode);
      expect(service.getCheckState('main.ts')).toBe('unchecked');
    });

    it('should check parent and all children when parent is checked', () => {
      const appNode = MOCK_DATA[0].children![0]; // 'app' with children
      service.toggleCheck(appNode);
      expect(service.getCheckState('app')).toBe('checked');
      expect(service.getCheckState('app.ts')).toBe('checked');
      expect(service.getCheckState('app.html')).toBe('checked');
    });

    it('should set parent to indeterminate when only some children are checked', () => {
      const appTsNode = MOCK_DATA[0].children![0].children![0]; // 'app.ts'
      service.toggleCheck(appTsNode);
      expect(service.getCheckState('app.ts')).toBe('checked');
      expect(service.getCheckState('app')).toBe('indeterminate');
    });

    it('should cascade indeterminate up through ancestors', () => {
      const appTsNode = MOCK_DATA[0].children![0].children![0]; // 'app.ts'
      service.toggleCheck(appTsNode);
      // src should also be indeterminate (grandparent)
      expect(service.getCheckState('src')).toBe('indeterminate');
    });

    it('should check parent when all children are checked', () => {
      const appTsNode = MOCK_DATA[0].children![0].children![0]; // 'app.ts'
      const appHtmlNode = MOCK_DATA[0].children![0].children![1]; // 'app.html'
      service.toggleCheck(appTsNode);
      service.toggleCheck(appHtmlNode);
      expect(service.getCheckState('app')).toBe('checked');
    });

    it('should return checked nodes', () => {
      const appNode = MOCK_DATA[0].children![0];
      service.toggleCheck(appNode);
      const checked = service.getCheckedNodes();
      expect(checked.some(n => n.key === 'app')).toBe(true);
      expect(checked.some(n => n.key === 'app.ts')).toBe(true);
      expect(checked.some(n => n.key === 'app.html')).toBe(true);
    });

    it('should not check disabled children when parent is checked', () => {
      const dataWithDisabledChild: TreeNode[] = [
        {
          key: 'parent',
          label: 'Parent',
          children: [
            { key: 'child-1', label: 'Child 1', leaf: true },
            { key: 'child-2', label: 'Child 2', disabled: true, leaf: true },
          ],
        },
      ];
      service.setData(dataWithDisabledChild);
      service.toggleCheck(dataWithDisabledChild[0]);
      expect(service.getCheckState('child-1')).toBe('checked');
      expect(service.getCheckState('child-2')).toBe('unchecked');
    });
  });

  describe('flattened nodes', () => {
    it('should flatten only visible nodes', () => {
      const flat = service.flattenedNodes();
      expect(flat).toHaveLength(3); // src, readme, disabled-node
    });

    it('should include children when node is expanded', () => {
      service.expand('src');
      const flat = service.flattenedNodes();
      expect(flat).toHaveLength(5); // src + (app, main.ts) + readme + disabled-node
    });

    it('should include deeply nested children when expanded', () => {
      service.expand('src');
      service.expand('app');
      const flat = service.flattenedNodes();
      expect(flat).toHaveLength(7); // src + app + app.ts + app.html + main.ts + readme + disabled-node
    });

    it('should track correct levels', () => {
      service.expand('src');
      service.expand('app');
      const flat = service.flattenedNodes();
      const srcNode = flat.find(f => f.node.key === 'src');
      const appNode = flat.find(f => f.node.key === 'app');
      const appTsNode = flat.find(f => f.node.key === 'app.ts');
      expect(srcNode?.level).toBe(0);
      expect(appNode?.level).toBe(1);
      expect(appTsNode?.level).toBe(2);
    });

    it('should mark expandable nodes correctly', () => {
      const flat = service.flattenedNodes();
      const srcNode = flat.find(f => f.node.key === 'src');
      const readmeNode = flat.find(f => f.node.key === 'readme');
      expect(srcNode?.expandable).toBe(true);
      expect(readmeNode?.expandable).toBe(false);
    });
  });

  describe('helpers', () => {
    it('should find a node by key', () => {
      const node = service.findNode('app.ts');
      expect(node?.label).toBe('app.component.ts');
    });

    it('should find deeply nested node', () => {
      const node = service.findNode('app.html');
      expect(node?.label).toBe('app.component.html');
    });

    it('should return null for missing key', () => {
      const node = service.findNode('nonexistent');
      expect(node).toBeNull();
    });
  });
});
