import { TOGGLE_GROUP } from '@zard/components/toggle-group/demo/toggle-group';
import { PROGRESS_BAR } from '@zard/components/progress-bar/demo/progress-bar';
import { ALERT_DIALOG } from '@zard/components/alert-dialog/demo/alert-dialog';
import { INPUT_GROUP } from '@zard/components/input-group/demo/input-group';
import { DATE_PICKER } from '@zard/components/date-picker/demo/date-picker';
import { PAGINATION } from '@zard/components/pagination/demo/pagination';
import { BREADCRUMB } from '@zard/components/breadcrumb/demo/breadcrumb';
import { SEGMENTED } from '@zard/components/segmented/demo/segmented';
import { RESIZABLE } from '@zard/components/resizable/demo/resizable';
import { ACCORDION } from '@zard/components/accordion/demo/accordion';
import { SKELETON } from '@zard/components/skeleton/demo/skeleton';
import { DROPDOWN } from '@zard/components/dropdown/demo/dropdown';
import { COMBOBOX } from '@zard/components/combobox/demo/combobox';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { CALENDAR } from '@zard/components/calendar/demo/calendar';
import { TOOLTIP } from '@zard/components/tooltip/demo/tooltip';
import { POPOVER } from '@zard/components/popover/demo/popover';
import { DIVIDER } from '@zard/components/divider/demo/divider';
import { COMMAND } from '@zard/components/command/demo/command';
import { TOGGLE } from '@zard/components/toggle/demo/toggle';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { SLIDER } from '@zard/components/slider/demo/slider';
import { SELECT } from '@zard/components/select/demo/select';
import { LOADER } from '@zard/components/loader/demo/loader';
import { LAYOUT } from '@zard/components/layout/demo/layout';
import { DIALOG } from '@zard/components/dialog/demo/dialog';
import { BUTTON } from '@zard/components/button/demo/button';
import { AVATAR } from '@zard/components/avatar/demo/avatar';
import { TOAST } from '@zard/components/toast/demo/toast';
import { TABLE } from '@zard/components/table/demo/table';
import { SHEET } from '@zard/components/sheet/demo/sheet';
import { RADIO } from '@zard/components/radio/demo/radio';
import { INPUT } from '@zard/components/input/demo/input';
import { EMPTY } from '@zard/components/empty/demo/empty';
import { BADGE } from '@zard/components/badge/demo/badge';
import { ALERT } from '@zard/components/alert/demo/alert';
import { TABS } from '@zard/components/tabs/demo/tabs';
import { MENU } from '@zard/components/menu/demo/menu';
import { FORM } from '@zard/components/form/demo/form';
import { CARD } from '@zard/components/card/demo/card';
import { ComponentType } from '@angular/cdk/overlay';

export interface ComponentData {
  componentName: string;
  description: string;
  examples: ExampleData[];
  fullWidth?: boolean;
}

export interface ExampleData {
  name: string;
  type?: string;
  column?: boolean;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
  fullScreen?: boolean;
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
  EMPTY,
  FORM,
  INPUT,
  INPUT_GROUP,
  LAYOUT,
  LOADER,
  MENU,
  PAGINATION,
  POPOVER,
  PROGRESS_BAR,
  RADIO,
  RESIZABLE,
  SEGMENTED,
  SELECT,
  SHEET,
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
