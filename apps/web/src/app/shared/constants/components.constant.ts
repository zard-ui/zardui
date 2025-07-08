import { ComponentType } from '@angular/cdk/overlay';
import { ACCORDION } from '@zard/components/accordion/demo/accordion';
import { ALERT } from '@zard/components/alert/demo/alert';
import { AVATAR } from '@zard/components/avatar/demo/avatar';
import { BADGE } from '@zard/components/badge/demo/badge';
import { BREADCRUMB } from '@zard/components/breadcrumb/demo/breadcrumb';
import { BUTTON } from '@zard/components/button/demo/button';
import { CARD } from '@zard/components/card/demo/card';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { DIALOG } from '@zard/components/dialog/demo/dialog';
import { DIVIDER } from '@zard/components/divider/demo/divider';
import { DROPDOWN } from '@zard/components/dropdown/demo/dropdown';
import { INPUT } from '@zard/components/input/demo/input';
import { LOADER } from '@zard/components/loader/demo/loader';
import { PROGRESS_BAR } from '@zard/components/progress-bar/demo/progress-bar';
import { RADIO } from '@zard/components/radio/demo/radio';
import { SELECT } from '@zard/components/select/demo/select';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { TABS } from '@zard/components/tabs/demo/tabs';
import { TOOLTIP } from '@zard/components/tooltip/demo/tooltip';

export interface ComponentData {
  componentName: string;
  examples: ExampleData[];
  fullWidth?: boolean;
}

export interface ExampleData {
  name: string;
  type?: string;
  column?: boolean;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
}

export const COMPONENTS: ComponentData[] = [
  ALERT,
  ACCORDION,
  AVATAR,
  BADGE,
  BUTTON,
  BREADCRUMB,
  CARD,
  CHECKBOX,
  DIALOG,
  DIVIDER,
  DROPDOWN,
  INPUT,
  LOADER,
  PROGRESS_BAR,
  RADIO,
  SELECT,
  SWITCH,
  TABS,
  TOOLTIP,
];
