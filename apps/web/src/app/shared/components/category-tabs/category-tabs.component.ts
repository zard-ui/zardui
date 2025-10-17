import { ZardButtonComponent } from '@zard/components/button/button.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, input } from '@angular/core';

export interface CategoryTab {
  label: string;
  route: string;
}

@Component({
  selector: 'z-category-tabs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ZardButtonComponent],
  templateUrl: './category-tabs.component.html',
})
export class CategoryTabsComponent {
  tabs = input.required<CategoryTab[]>();
  browseAllRoute = input<string>();
  browseAllLabel = input<string>('Browse all blocks');
}
