import { NgModule } from '@angular/core';

import { ContentComponent } from './content.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { LayoutComponent } from './layout.component';
import { SidebarGroupLabelComponent, SidebarGroupComponent, SidebarComponent } from './sidebar.component';

const LAYOUT_COMPONENTS = [LayoutComponent, HeaderComponent, FooterComponent, ContentComponent, SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent];

@NgModule({
  imports: [LAYOUT_COMPONENTS],
  exports: [LAYOUT_COMPONENTS],
})
export class LayoutModule {}
