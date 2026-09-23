import {
  ZardDrawerCloseDirective,
  ZardDrawerComponent,
  ZardDrawerDescriptionComponent,
  ZardDrawerFooterComponent,
  ZardDrawerHeaderComponent,
  ZardDrawerTitleComponent,
} from '@/shared/components/drawer/drawer.component';

export const ZardDrawerImports = [
  ZardDrawerComponent,
  ZardDrawerHeaderComponent,
  ZardDrawerTitleComponent,
  ZardDrawerDescriptionComponent,
  ZardDrawerFooterComponent,
  ZardDrawerCloseDirective,
] as const;
