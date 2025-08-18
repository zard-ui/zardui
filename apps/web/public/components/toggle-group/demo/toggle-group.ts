import ToggleGroupDefaultDemo from './default';
import ToggleGroupBasicDemo from './basic';
import ToggleGroupSizesDemo from './sizes';

export const TOGGLE_GROUP = {
  componentName: 'toggle-group',
  examples: [
    {
      name: 'default',
      component: ToggleGroupDefaultDemo,
    },
    {
      name: 'basic',
      component: ToggleGroupBasicDemo,
    },
    {
      name: 'sizes',
      component: ToggleGroupSizesDemo,
    },
  ],
};
