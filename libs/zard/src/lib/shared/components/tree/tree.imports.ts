import { ZardTreeNodeContentComponent } from '@/shared/components/tree/tree-node-content.component';
import { ZardTreeNodeToggleDirective } from '@/shared/components/tree/tree-node-toggle.directive';
import { ZardTreeNodeComponent } from '@/shared/components/tree/tree-node.component';
import { ZardTreeComponent } from '@/shared/components/tree/tree.component';

export const ZardTreeImports = [
  ZardTreeComponent,
  ZardTreeNodeComponent,
  ZardTreeNodeToggleDirective,
  ZardTreeNodeContentComponent,
] as const;
