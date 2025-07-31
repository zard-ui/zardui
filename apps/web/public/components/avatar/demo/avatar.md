```angular-ts showLineNumbers
import { ZardDemoAvatarBorderComponent } from './border';
import { ZardDemoAvatarLoadingComponent } from './loading';
import { ZardDemoAvatarShapeComponent } from './shape';
import { ZardDemoAvatarSizeComponent } from './size';
import { ZardDemoAvatarStatusComponent } from './status';
import { ZardDemoAvatarWithImageComponent } from './with-image';
import { ZardDemoAvatarWithoutImageComponent } from './without-image';

export const AVATAR = {
  componentName: 'avatar',
  componentType: 'avatar',
  examples: [
    {
      name: 'without-image',
      component: ZardDemoAvatarWithoutImageComponent,
    },
    {
      name: 'with-image',
      component: ZardDemoAvatarWithImageComponent,
    },
    {
      name: 'size',
      component: ZardDemoAvatarSizeComponent,
    },
    {
      name: 'shape',
      component: ZardDemoAvatarShapeComponent,
    },
    {
      name: 'status',
      component: ZardDemoAvatarStatusComponent,
    },
    {
      name: 'border',
      component: ZardDemoAvatarBorderComponent,
    },
    {
      name: 'loading',
      component: ZardDemoAvatarLoadingComponent,
    },
  ],
};

```