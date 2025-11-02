```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" zSize="sm" />
    <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" zSize="md" />
    <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" zSize="lg" />
  `,
})
export class ZardDemoAvatarSizeComponent {}

```
