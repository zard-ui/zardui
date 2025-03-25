import { ZardDemoAvatarBasicComponent } from './basic';
import { ZardDemoAvatarBasicWithImageComponent } from './basic-image';
import { ZardDemoAvatarLoadingComponent } from './loading';
import { ZardDemoAvatarShapeComponent } from './shape';
import { ZardDemoAvatarSizeComponent } from './size';
import { ZardDemoAvatarStatusComponent } from './status';

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
      name: 'status',
      component: ZardDemoAvatarStatusComponent,
    },
    {
      name: 'loading',
      component: ZardDemoAvatarLoadingComponent,
    },
  ],
};
