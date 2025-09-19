import { ZardDemoBadgeDestructiveComponent } from './destructive';
import { ZardDemoBadgeSecondaryComponent } from './secondary';
import { ZardDemoBadgeOutlineComponent } from './outline';
import { ZardDemoBadgeDefaultComponent } from './default';
import { ZardDemoBadgeShapeComponent } from './shape';
import { ZardDemoBadgeSemanticColorsComponent } from './semantic-colors';

export const BADGE = {
  componentName: 'badge',
  componentType: 'badge',
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
      name: 'semantic-colors',
      component: ZardDemoBadgeSemanticColorsComponent,
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
