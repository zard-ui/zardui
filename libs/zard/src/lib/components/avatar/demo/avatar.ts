import { ZardDemoAvatarBasicWithImageComponent } from './basic-image';
import { ZardDemoAvatarShapeComponent } from './shape';
import { ZardDemoAvatarBasicComponent } from './basic';
import { ZardDemoAvatarSizeComponent } from './size';

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
  ],
};
