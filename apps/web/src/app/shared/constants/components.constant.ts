import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { TOOLTIP } from '@zard/components/tooltip/demo/tooltip';
import { DIVIDER } from '@zard/components/divider/demo/divider';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { LOADER } from '@zard/components/loader/demo/loader';
import { BUTTON } from '@zard/components/button/demo/button';
import { AVATAR } from '@zard/components/avatar/demo/avatar';
import { RADIO } from '@zard/components/radio/demo/radio';
import { INPUT } from '@zard/components/input/demo/input';
import { BADGE } from '@zard/components/badge/demo/badge';
import { CARD } from '@zard/components/card/demo/card';
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

export const COMPONENTS: ComponentData[] = [AVATAR, BADGE, BUTTON, CARD, CHECKBOX, DIVIDER, INPUT, LOADER, RADIO, SWITCH, TOOLTIP];
