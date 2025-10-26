import ToggleGroupWithTextComponent from './with-text';
import ToggleGroupOutlineComponent from './outline';
import ToggleGroupDefaultComponent from './default';
import ToggleGroupSingleComponent from './single';
import ToggleGroupSizesComponent from './sizes';

export const TOGGLE_GROUP = {
  componentName: 'toggle-group',
  description: 'A set of two-state buttons that can be pressed or released. Multiple buttons can be selected at the same time.',
  examples: [
    {
      name: 'default',
      component: ToggleGroupDefaultComponent,
    },
    {
      name: 'with-text',
      component: ToggleGroupWithTextComponent,
    },
    {
      name: 'outline',
      component: ToggleGroupOutlineComponent,
    },
    {
      name: 'single',
      component: ToggleGroupSingleComponent,
    },
    {
      name: 'sizes',
      component: ToggleGroupSizesComponent,
    },
  ],
};
