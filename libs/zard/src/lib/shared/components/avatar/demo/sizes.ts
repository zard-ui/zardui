import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-sizes',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex items-end gap-6">
      <div class="flex flex-col items-center gap-2">
        <z-avatar zSize="sm" zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="SM" />
        <span class="text-muted-foreground text-xs">sm — 24px</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <z-avatar zSize="default" zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="MD" />
        <span class="text-muted-foreground text-xs">default — 32px</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <z-avatar zSize="lg" zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="LG" />
        <span class="text-muted-foreground text-xs">lg — 40px</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarSizesComponent {}
