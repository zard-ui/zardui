import { ZardDemoAvatarBasicComponent } from './basic';
import { ZardDemoAvatarStatusComponent } from './status';

export const AVATAR = {
  componentName: 'avatar',
  componentType: 'avatar',
  description: 'An image element with a fallback for representing the user.',
  examples: [
    {
      name: 'basic',
      component: ZardDemoAvatarBasicComponent,
    },
    {
      name: 'status',
      component: ZardDemoAvatarStatusComponent,
    },
  ],
};
