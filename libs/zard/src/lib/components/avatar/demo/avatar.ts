import { ZardDemoAvatarWithoutImageComponent } from './without-image';
import { ZardDemoAvatarWithImageComponent } from './with-image';
import { ZardDemoAvatarLoadingComponent } from './loading';
import { ZardDemoAvatarStatusComponent } from './status';
import { ZardDemoAvatarBorderComponent } from './border';
import { ZardDemoAvatarShapeComponent } from './shape';
import { ZardDemoAvatarSizeComponent } from './size';

export const AVATAR = {
  componentName: 'avatar',
  componentType: 'avatar',
  description: 'An image element with a fallback for representing the user.',
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
