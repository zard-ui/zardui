import { MARKER_DEMO_BORDER } from '@generated/components/marker/demo/border';
import { MARKER_DEMO_DEFAULT } from '@generated/components/marker/demo/default';
import { MARKER_DEMO_ICON } from '@generated/components/marker/demo/icon';
import { MARKER_DEMO_LINK } from '@generated/components/marker/demo/link';
import { MARKER_DEMO_SEPARATOR } from '@generated/components/marker/demo/separator';
import { MARKER_DEMO_SHIMMER } from '@generated/components/marker/demo/shimmer';
import { MARKER_DEMO_SHORTHAND } from '@generated/components/marker/demo/shorthand';
import { MARKER_DEMO_STATUS } from '@generated/components/marker/demo/status';
import { MARKER_DEMO_VARIANT } from '@generated/components/marker/demo/variant';
import { MARKER_CLI_ADD } from '@generated/installation/cli/add-marker';
import { MARKER_MANUAL_CODE } from '@generated/installation/manual/marker';
import { MARKER_USAGE_CODE, MARKER_USAGE_IMPORT } from '@generated/usage/marker';

import { ZardDemoMarkerBorderComponent } from './border';
import { ZardDemoMarkerDefaultComponent } from './default';
import { ZardDemoMarkerIconComponent } from './icon';
import { ZardDemoMarkerLinkComponent } from './link';
import { ZardDemoMarkerSeparatorComponent } from './separator';
import { ZardDemoMarkerShimmerComponent } from './shimmer';
import { ZardDemoMarkerShorthandComponent } from './shorthand';
import { ZardDemoMarkerStatusComponent } from './status';
import { ZardDemoMarkerVariantComponent } from './variant';
import { MARKER_API } from '../doc/api';

export const MARKER = {
  componentName: 'marker',
  componentType: 'marker',
  description: 'Displays an inline status, system note, bordered row, or labeled separator in a conversation.',
  api: MARKER_API,
  installData: {
    cliAdd: MARKER_CLI_ADD,
    manualCode: MARKER_MANUAL_CODE,
  },
  usage: { importBlock: MARKER_USAGE_IMPORT, codeBlock: MARKER_USAGE_CODE },
  examples: [
    { name: 'default', component: ZardDemoMarkerDefaultComponent, codeData: MARKER_DEMO_DEFAULT },
    { name: 'variant', component: ZardDemoMarkerVariantComponent, codeData: MARKER_DEMO_VARIANT },
    { name: 'status', component: ZardDemoMarkerStatusComponent, codeData: MARKER_DEMO_STATUS },
    { name: 'shimmer', component: ZardDemoMarkerShimmerComponent, codeData: MARKER_DEMO_SHIMMER },
    { name: 'separator', component: ZardDemoMarkerSeparatorComponent, codeData: MARKER_DEMO_SEPARATOR },
    { name: 'border', component: ZardDemoMarkerBorderComponent, codeData: MARKER_DEMO_BORDER },
    { name: 'icon', component: ZardDemoMarkerIconComponent, codeData: MARKER_DEMO_ICON },
    { name: 'link', component: ZardDemoMarkerLinkComponent, codeData: MARKER_DEMO_LINK },
    { name: 'shorthand', component: ZardDemoMarkerShorthandComponent, codeData: MARKER_DEMO_SHORTHAND },
  ],
};
