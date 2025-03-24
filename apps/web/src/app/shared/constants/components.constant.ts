import { ComponentType } from '@angular/cdk/overlay';
import { BADGE } from '@zard/components/badge/demo/badge';
import { BUTTON } from '@zard/components/button/demo/button';
import { CARD } from '@zard/components/card/demo/card';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { INPUT } from '@zard/components/input/demo/input';
import { LOADER } from '@zard/components/loader/demo/loader';
import { RADIO } from '@zard/components/radio/demo/radio';
import { SWITCH } from '@zard/components/switch/demo/switch';

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

export const COMPONENTS: ComponentData[] = [BADGE, BUTTON, CARD, CHECKBOX, INPUT, LOADER, RADIO, SWITCH];
