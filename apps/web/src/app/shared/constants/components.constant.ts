import { ACCORDION } from '@zard/components/accordion/demo/accordion';
import { BREADCRUMB } from '@zard/components/breadcrumb/demo/breadcrumb';
import { DROPDOWN } from '@zard/components/dropdown/demo/dropdown';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { TOOLTIP } from '@zard/components/tooltip/demo/tooltip';
import { DIVIDER } from '@zard/components/divider/demo/divider';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { SELECT } from '@zard/components/select/demo/select';
import { LOADER } from '@zard/components/loader/demo/loader';
import { DIALOG } from '@zard/components/dialog/demo/dialog';
import { BUTTON } from '@zard/components/button/demo/button';
import { AVATAR } from '@zard/components/avatar/demo/avatar';
import { RADIO } from '@zard/components/radio/demo/radio';
import { INPUT } from '@zard/components/input/demo/input';
import { BADGE } from '@zard/components/badge/demo/badge';
import { ALERT } from '@zard/components/alert/demo/alert';
import { TABS } from '@zard/components/tabs/demo/tabs';
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

export const COMPONENTS: ComponentData[] = [
  ACCORDION,
  ALERT,
  AVATAR,
  BADGE,
  BREADCRUMB,
  BUTTON,
  CARD,
  CHECKBOX,
  DIALOG,
  DIVIDER,
  DROPDOWN,
  INPUT,
  LOADER,
  RADIO,
  SELECT,
  SWITCH,
  TABS,
  TOOLTIP,
];