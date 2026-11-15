import { NATIVE_SELECT_DEMO_DISABLED } from '@generated/components/native-select/demo/disabled';
import { NATIVE_SELECT_DEMO_FORM } from '@generated/components/native-select/demo/form';
import { NATIVE_SELECT_DEMO_GROUPS } from '@generated/components/native-select/demo/groups';
import { NATIVE_SELECT_DEMO_INVALID } from '@generated/components/native-select/demo/invalid';
import { NATIVE_SELECT_DEMO_NATIVE_VS_SELECT } from '@generated/components/native-select/demo/native-vs-select';
import { NATIVE_SELECT_DEMO_PREVIEW } from '@generated/components/native-select/demo/preview';
import { NATIVE_SELECT_DEMO_RTL } from '@generated/components/native-select/demo/rtl';
import { NATIVE_SELECT_DEMO_SIZES } from '@generated/components/native-select/demo/sizes';
import { NATIVE_SELECT_CLI_ADD } from '@generated/installation/cli/add-native-select';
import { NATIVE_SELECT_MANUAL_CODE } from '@generated/installation/manual/native-select';
import { NATIVE_SELECT_USAGE_CODE, NATIVE_SELECT_USAGE_IMPORT } from '@generated/usage/native-select';

import { ZardDemoNativeSelectDisabledComponent } from './disabled';
import { ZardDemoNativeSelectFormComponent } from './form';
import { ZardDemoNativeSelectGroupsComponent } from './groups';
import { ZardDemoNativeSelectInvalidComponent } from './invalid';
import { ZardDemoNativeSelectNativeVsSelectComponent } from './native-vs-select';
import { ZardDemoNativeSelectPreviewComponent } from './preview';
import { ZardDemoNativeSelectRtlComponent } from './rtl';
import { ZardDemoNativeSelectSizesComponent } from './sizes';
import { NATIVE_SELECT_API } from '../doc/api';

export const NATIVE_SELECT = {
  componentName: 'native-select',
  componentType: 'native-select',
  description: 'A styled native HTML select element with consistent design system integration.',
  api: NATIVE_SELECT_API,
  installData: {
    cliAdd: NATIVE_SELECT_CLI_ADD,
    manualCode: NATIVE_SELECT_MANUAL_CODE,
  },
  usage: { importBlock: NATIVE_SELECT_USAGE_IMPORT, codeBlock: NATIVE_SELECT_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoNativeSelectPreviewComponent,
    column: false,
    codeData: NATIVE_SELECT_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'groups',
      description: 'Use plain `<optgroup>` elements to organize options into categories.',
      component: ZardDemoNativeSelectGroupsComponent,
      codeData: NATIVE_SELECT_DEMO_GROUPS,
    },
    {
      name: 'sizes',
      description: 'Use `zSize` to pick between `sm`, `default` and `lg`. The default height lines up with `z-input`.',
      component: ZardDemoNativeSelectSizesComponent,
      codeData: NATIVE_SELECT_DEMO_SIZES,
    },
    {
      name: 'disabled',
      description:
        'Set the native `disabled` attribute on `select[z-native-select]`, and add `data-disabled="true"` to the surrounding `z-field` so its label dims along with the control.',
      component: ZardDemoNativeSelectDisabledComponent,
      codeData: NATIVE_SELECT_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Set `aria-invalid="true"` on `select[z-native-select]` and `data-invalid="true"` on the surrounding `z-field` to show the invalid state.',
      component: ZardDemoNativeSelectInvalidComponent,
      codeData: NATIVE_SELECT_DEMO_INVALID,
    },
    {
      name: 'form',
      description:
        'The directive adds no `ControlValueAccessor`: Angular binds `formControl`, `formControlName` and `ngModel` to the native `<select>` as usual.',
      component: ZardDemoNativeSelectFormComponent,
      codeData: NATIVE_SELECT_DEMO_FORM,
    },
    {
      name: 'native-vs-select',
      description:
        'Native Select keeps the browser picker, keyboard handling and form behavior. Select is an overlay with custom items, search and templates.',
      component: ZardDemoNativeSelectNativeVsSelectComponent,
      codeData: NATIVE_SELECT_DEMO_NATIVE_VS_SELECT,
    },
    {
      name: 'rtl',
      description:
        'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). The chevron moves to the start side.',
      type: 'rtl' as const,
      component: ZardDemoNativeSelectRtlComponent,
      codeData: NATIVE_SELECT_DEMO_RTL,
    },
  ],
};
