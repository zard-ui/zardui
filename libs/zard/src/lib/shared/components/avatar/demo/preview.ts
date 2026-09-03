import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-preview',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" zAlt="Zard user" />
      <z-avatar zSrc="error-image.png" zFallback="ZA" zAlt="Broken image, falls back to initials" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarPreviewComponent {}
