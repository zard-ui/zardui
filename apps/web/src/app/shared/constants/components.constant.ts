import { PROGRESS_BAR } from '@zard/components/progress-bar/demo/progress-bar';
import { BREADCRUMB } from '@zard/components/breadcrumb/demo/breadcrumb';
import { ACCORDION } from '@zard/components/accordion/demo/accordion';
import { DROPDOWN } from '@zard/components/dropdown/demo/dropdown';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { TOOLTIP } from '@zard/components/tooltip/demo/tooltip';
import { DIVIDER } from '@zard/components/divider/demo/divider';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { SLIDER } from '@zard/components/slider/demo/slider';
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
import { TOGGLE } from '@zard/components/toggle/demo/toggle';
import { POPOVER } from '@zard/components/popover/demo/popover';
import { COMMAND } from '@zard/components/command/demo/command';

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
  COMMAND,
  DIALOG,
  DIVIDER,
  DROPDOWN,
  INPUT,
  LOADER,
  POPOVER,
  PROGRESS_BAR,
  RADIO,
  SELECT,
  SLIDER,
  SWITCH,
  TABS,
  TOGGLE,
  TOOLTIP,
];
