import ToggleGroupDefaultComponent from './default';
import ToggleGroupOutlineComponent from './outline';
import ToggleGroupSingleComponent from './single';
import ToggleGroupSizesComponent from './sizes';
import ToggleGroupWithTextComponent from './with-text';

export const TOGGLE_GROUP = {
  componentName: 'toggle-group',
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
