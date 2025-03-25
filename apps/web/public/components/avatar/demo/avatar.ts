import { ZardDemoAvatarBasicWithImageComponent } from './basic-image';
import { ZardDemoAvatarShapeComponent } from './shape';
import { ZardDemoAvatarBasicComponent } from './basic';
import { ZardDemoAvatarSizeComponent } from './size';
import { ZardDemoAvatarLoadingComponent } from './loading';

export const AVATAR = {
  componentName: 'avatar',
  componentType: 'avatar',
  examples: [
    {
      name: 'basic',
      component: ZardDemoAvatarBasicComponent,
    },
    {
      name: 'basic-image',
      component: ZardDemoAvatarBasicWithImageComponent,
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
      name: 'loading',
      component: ZardDemoAvatarLoadingComponent,
    },
  ],
};
