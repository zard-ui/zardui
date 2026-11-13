import {
  ZardCodeBlockActionsComponent,
  ZardCodeBlockComponent,
  ZardCodeBlockContentComponent,
  ZardCodeBlockCopyButtonComponent,
  ZardCodeBlockFooterComponent,
  ZardCodeBlockHeaderComponent,
  ZardCodeBlockLineComponent,
  ZardCodeBlockTitleComponent,
} from '@/shared/components/code-block/code-block.component';

export const ZardCodeBlockImports = [
  ZardCodeBlockComponent,
  ZardCodeBlockHeaderComponent,
  ZardCodeBlockTitleComponent,
  ZardCodeBlockActionsComponent,
  ZardCodeBlockCopyButtonComponent,
  ZardCodeBlockContentComponent,
  ZardCodeBlockLineComponent,
  ZardCodeBlockFooterComponent,
] as const;
