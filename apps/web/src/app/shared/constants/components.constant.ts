import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { LOADER } from '@zard/components/loader/demo/loader';
import { BUTTON } from '@zard/components/button/demo/button';
import { RADIO } from '@zard/components/radio/demo/radio';
import { INPUT } from '@zard/components/input/demo/input';
import { BADGE } from '@zard/components/badge/demo/badge';
import { CARD } from '@zard/components/card/demo/card';
import { ACCORDION } from '@zard/components/accordion/demo/accordion';

import { ComponentType } from '@angular/cdk/overlay';

export interface ComponentData {
  componentName: string;
  examples: ExampleData[];
}

export interface ExampleData {
  name: string;
  type?: string;
  column?: boolean;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
}

export const COMPONENTS: ComponentData[] = [BADGE, BUTTON, CARD, CHECKBOX, INPUT, LOADER, RADIO, SWITCH, ACCORDION];
