import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardProgressBarComponent } from '@zard/components/progress-bar/progress-bar.component';
import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';
import { ZardSliderComponent } from '@zard/components/slider/slider.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTabComponent, ZardTabGroupComponent } from '@zard/components/tabs/tabs.component';

import { ThemeGeneratorService } from '../../services/theme-generator.service';

@Component({
  selector: 'app-theme-preview',
  standalone: true,
  imports: [
    FormsModule,
    ZardAlertComponent,
    ZardAvatarComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardCardComponent,
    ZardCheckboxComponent,
    ZardDividerComponent,
    ZardEmptyComponent,
    ZardIconComponent,
    ZardInputDirective,
    ZardProgressBarComponent,
    ZardSkeletonComponent,
    ZardSliderComponent,
    ZardSwitchComponent,
    ZardTabComponent,
    ZardTabGroupComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'block h-full' },
  templateUrl: './theme-preview.component.html',
})
export class ThemePreviewComponent {
  private readonly themeService = inject(ThemeGeneratorService);

  readonly scopedStyles = this.themeService.scopedStyles;
  readonly previewDarkMode = this.themeService.previewDarkMode;

  readonly recentSales = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '1,999.00', initials: 'OM' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '39.00', initials: 'JL' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '299.00', initials: 'IN' },
    { name: 'William Kim', email: 'will@email.com', amount: '99.00', initials: 'WK' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '39.00', initials: 'SD' },
  ];

  readonly teamMembers = [
    { name: 'Sofia Davis', email: 'sofia@email.com', role: 'Owner', initials: 'SD' },
    { name: 'Jackson Lee', email: 'jackson@email.com', role: 'Admin', initials: 'JL' },
    { name: 'Isabella Nguyen', email: 'isabella@email.com', role: 'Member', initials: 'IN' },
  ];

  readonly chartHeights = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95];
}
