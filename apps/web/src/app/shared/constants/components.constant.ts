import { ComponentType } from '@angular/cdk/overlay';
import { ACCORDION } from '@zard/components/accordion/demo/accordion';
import { ALERT_DIALOG } from '@zard/components/alert-dialog/demo/alert-dialog';
import { ALERT } from '@zard/components/alert/demo/alert';
import { AVATAR } from '@zard/components/avatar/demo/avatar';
import { BADGE } from '@zard/components/badge/demo/badge';
import { BREADCRUMB } from '@zard/components/breadcrumb/demo/breadcrumb';
import { BUTTON } from '@zard/components/button/demo/button';
import { CALENDAR } from '@zard/components/calendar/demo/calendar';
import { CARD } from '@zard/components/card/demo/card';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { COMBOBOX } from '@zard/components/combobox/demo/combobox';
import { COMMAND } from '@zard/components/command/demo/command';
import { DATE_PICKER } from '@zard/components/date-picker/demo/date-picker';
import { DIALOG } from '@zard/components/dialog/demo/dialog';
import { DIVIDER } from '@zard/components/divider/demo/divider';
import { DROPDOWN } from '@zard/components/dropdown/demo/dropdown';
import { FORM } from '@zard/components/form/demo/form';
import { INPUT } from '@zard/components/input/demo/input';
import { LOADER } from '@zard/components/loader/demo/loader';
import { PAGINATION } from '@zard/components/pagination/demo/pagination';
import { POPOVER } from '@zard/components/popover/demo/popover';
import { PROGRESS_BAR } from '@zard/components/progress-bar/demo/progress-bar';
import { RADIO } from '@zard/components/radio/demo/radio';
import { RESIZABLE } from '@zard/components/resizable/demo/resizable';
import { SEGMENTED } from '@zard/components/segmented/demo/segmented';
import { SELECT } from '@zard/components/select/demo/select';
import { SKELETON } from '@zard/components/skeleton/demo/skeleton';
import { SLIDER } from '@zard/components/slider/demo/slider';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { TABLE } from '@zard/components/table/demo/table';
import { TABS } from '@zard/components/tabs/demo/tabs';
import { TOAST } from '@zard/components/toast/demo/toast';
import { TOGGLE_GROUP } from '@zard/components/toggle-group/demo/toggle-group';
import { TOGGLE } from '@zard/components/toggle/demo/toggle';
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
  ALERT_DIALOG,
  ACCORDION,
  AVATAR,
  BADGE,
  BUTTON,
  BREADCRUMB,
  CALENDAR,
  CARD,
  CHECKBOX,
  COMBOBOX,
  COMMAND,
  DATE_PICKER,
  DIALOG,
  DIVIDER,
  DROPDOWN,
  FORM,
  INPUT,
  LOADER,
  PAGINATION,
  POPOVER,
  PROGRESS_BAR,
  RADIO,
  RESIZABLE,
  SEGMENTED,
  SELECT,
  SLIDER,
  SKELETON,
  SWITCH,
  TABLE,
  TABS,
  TOAST,
  TOGGLE,
  TOGGLE_GROUP,
  TOOLTIP,
];
