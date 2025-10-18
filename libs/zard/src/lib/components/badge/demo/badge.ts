import { ZardDemoBadgeDestructiveComponent } from './destructive';
import { ZardDemoBadgeSecondaryComponent } from './secondary';
import { ZardDemoBadgeOutlineComponent } from './outline';
import { ZardDemoBadgeDefaultComponent } from './default';
import { ZardDemoBadgeShapeComponent } from './shape';

export const BADGE = {
  componentName: 'badge',
  componentType: 'badge',
  description: 'Displays a badge or a component that looks like a badge.',
  examples: [
    {
      name: 'default',
      component: ZardDemoBadgeDefaultComponent,
    },
    {
      name: 'secondary',
      component: ZardDemoBadgeSecondaryComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoBadgeDestructiveComponent,
    },
    {
      name: 'outline',
      component: ZardDemoBadgeOutlineComponent,
    },
    {
      name: 'shape',
      component: ZardDemoBadgeShapeComponent,
    },
  ],
};
