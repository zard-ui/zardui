import { ZardContentComponent } from '@/shared/components/layout/content.component';
import { ZardFooterComponent } from '@/shared/components/layout/footer.component';
import { ZardHeaderComponent } from '@/shared/components/layout/header.component';
import { ZardLayoutComponent } from '@/shared/components/layout/layout.component';
import {
  ZardSidebarComponent,
  ZardSidebarGroupComponent,
  ZardSidebarGroupLabelComponent,
} from '@/shared/components/layout/sidebar.component';

export const ZardLayoutImports = [
  ZardLayoutComponent,
  ZardHeaderComponent,
  ZardFooterComponent,
  ZardContentComponent,
  ZardSidebarComponent,
  ZardSidebarGroupComponent,
  ZardSidebarGroupLabelComponent,
] as const;
