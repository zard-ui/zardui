import { ComponentType } from '@angular/cdk/overlay';

import { ACCORDION } from '../../../../../../libs/zard/accordion/demo/accordion';
import { ALERT } from '../../../../../../libs/zard/alert/demo/alert';
import { ALERT_DIALOG } from '../../../../../../libs/zard/alert-dialog/demo/alert-dialog';
import { AVATAR } from '../../../../../../libs/zard/avatar/demo/avatar';
import { BADGE } from '../../../../../../libs/zard/badge/demo/badge';
import { BREADCRUMB } from '../../../../../../libs/zard/breadcrumb/demo/breadcrumb';
import { BUTTON } from '../../../../../../libs/zard/button/demo/button';
import { BUTTON_GROUP } from '../../../../../../libs/zard/button-group/demo/button-group';
import { CALENDAR } from '../../../../../../libs/zard/calendar/demo/calendar';
import { CARD } from '../../../../../../libs/zard/card/demo/card';
import { CAROUSEL } from '../../../../../../libs/zard/carousel/demo/carousel';
import { CHECKBOX } from '../../../../../../libs/zard/checkbox/demo/checkbox';
import { COMBOBOX } from '../../../../../../libs/zard/combobox/demo/combobox';
import { COMMAND } from '../../../../../../libs/zard/command/demo/command';
import { DATE_PICKER } from '../../../../../../libs/zard/date-picker/demo/date-picker';
import { DIALOG } from '../../../../../../libs/zard/dialog/demo/dialog';
import { DIVIDER } from '../../../../../../libs/zard/divider/demo/divider';
import { DROPDOWN } from '../../../../../../libs/zard/dropdown/demo/dropdown';
import { EMPTY } from '../../../../../../libs/zard/empty/demo/empty';
import { FORM } from '../../../../../../libs/zard/form/demo/form';
import { ICON } from '../../../../../../libs/zard/icon/demo/icon';
import { INPUT } from '../../../../../../libs/zard/input/demo/input';
import { INPUT_GROUP } from '../../../../../../libs/zard/input-group/demo/input-group';
import { KBD } from '../../../../../../libs/zard/kbd/demo/kbd';
import { LAYOUT } from '../../../../../../libs/zard/layout/demo/layout';
import { LOADER } from '../../../../../../libs/zard/loader/demo/loader';
import { MENU } from '../../../../../../libs/zard/menu/demo/menu';
import { PAGINATION } from '../../../../../../libs/zard/pagination/demo/pagination';
import { POPOVER } from '../../../../../../libs/zard/popover/demo/popover';
import { PROGRESS_BAR } from '../../../../../../libs/zard/progress-bar/demo/progress-bar';
import { RADIO } from '../../../../../../libs/zard/radio/demo/radio';
import { RESIZABLE } from '../../../../../../libs/zard/resizable/demo/resizable';
import { SEGMENTED } from '../../../../../../libs/zard/segmented/demo/segmented';
import { SELECT } from '../../../../../../libs/zard/select/demo/select';
import { SHEET } from '../../../../../../libs/zard/sheet/demo/sheet';
import { SKELETON } from '../../../../../../libs/zard/skeleton/demo/skeleton';
import { SLIDER } from '../../../../../../libs/zard/slider/demo/slider';
import { SWITCH } from '../../../../../../libs/zard/switch/demo/switch';
import { TABLE } from '../../../../../../libs/zard/table/demo/table';
import { TABS } from '../../../../../../libs/zard/tabs/demo/tabs';
import { TOAST } from '../../../../../../libs/zard/toast/demo/toast';
import { TOGGLE } from '../../../../../../libs/zard/toggle/demo/toggle';
import { TOGGLE_GROUP } from '../../../../../../libs/zard/toggle-group/demo/toggle-group';
import { TOOLTIP } from '../../../../../../libs/zard/tooltip/demo/tooltip';

export interface ComponentData {
  componentName: string;
  description: string;
  examples: ExampleData[];
  fullWidth?: boolean;
}

export interface ExampleData {
  name: string;
  description?: string;
  type?: string;
  column?: boolean;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  flexAlign?: 'start' | 'center' | 'end';
}

export const COMPONENTS: ComponentData[] = [
  ALERT,
  ALERT_DIALOG,
  ACCORDION,
  AVATAR,
  BADGE,
  BUTTON,
  BUTTON_GROUP,
  BREADCRUMB,
  CALENDAR,
  CARD,
  CAROUSEL,
  CHECKBOX,
  COMBOBOX,
  COMMAND,
  DATE_PICKER,
  DIALOG,
  DIVIDER,
  DROPDOWN,
  EMPTY,
  FORM,
  ICON,
  INPUT,
  INPUT_GROUP,
  KBD,
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
