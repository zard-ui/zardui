import { COLOR_PICKER_DEMO_ALPHA } from '@generated/components/color-picker/demo/alpha';
import { COLOR_PICKER_DEMO_BASIC } from '@generated/components/color-picker/demo/basic';
import { COLOR_PICKER_DEMO_FORM } from '@generated/components/color-picker/demo/form';
import { COLOR_PICKER_DEMO_FORMATS } from '@generated/components/color-picker/demo/formats';
import { COLOR_PICKER_DEMO_PRESETS } from '@generated/components/color-picker/demo/presets';
import { COLOR_PICKER_DEMO_PREVIEW } from '@generated/components/color-picker/demo/preview';
import { COLOR_PICKER_DEMO_SIZES } from '@generated/components/color-picker/demo/sizes';
import { COLOR_PICKER_CLI_ADD } from '@generated/installation/cli/add-color-picker';
import { COLOR_PICKER_MANUAL_CODE } from '@generated/installation/manual/color-picker';
import { COLOR_PICKER_USAGE_IMPORT, COLOR_PICKER_USAGE_CODE } from '@generated/usage/color-picker';

import { ZardDemoColorPickerAlphaComponent } from './alpha';
import { ZardDemoColorPickerBasicComponent } from './basic';
import { ZardDemoColorPickerFormComponent } from './form';
import { ZardDemoColorPickerFormatsComponent } from './formats';
import { ZardDemoColorPickerPresetsComponent } from './presets';
import { ZardDemoColorPickerPreviewComponent } from './preview';
import { ZardDemoColorPickerSizesComponent } from './sizes';
import { COLOR_PICKER_API } from '../doc/api';

export const COLOR_PICKER = {
  api: COLOR_PICKER_API,
  componentName: 'color-picker',
  componentType: 'color-picker',
  description: 'A swatch button that opens a panel to pick a color, with optional alpha and presets.',
  installData: {
    cliAdd: COLOR_PICKER_CLI_ADD,
    manualCode: COLOR_PICKER_MANUAL_CODE,
  },
  usage: { importBlock: COLOR_PICKER_USAGE_IMPORT, codeBlock: COLOR_PICKER_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoColorPickerPreviewComponent,
    codeData: COLOR_PICKER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'Without `zShowValue` the trigger is a square swatch. Pair it with a `<label>` through `zId`.',
      component: ZardDemoColorPickerBasicComponent,
      codeData: COLOR_PICKER_DEMO_BASIC,
    },
    {
      name: 'formats',
      description: '`zFormat` decides the string you get back — and the one typed in the text field.',
      component: ZardDemoColorPickerFormatsComponent,
      codeData: COLOR_PICKER_DEMO_FORMATS,
    },
    {
      name: 'alpha',
      description: '`zAlpha` adds an alpha slider; the value only carries alpha while the color is not opaque.',
      component: ZardDemoColorPickerAlphaComponent,
      codeData: COLOR_PICKER_DEMO_ALPHA,
    },
    {
      name: 'presets',
      description: 'Pass `zPresets` to offer a palette under the panel. The matching swatch is marked as pressed.',
      component: ZardDemoColorPickerPresetsComponent,
      codeData: COLOR_PICKER_DEMO_PRESETS,
    },
    {
      name: 'form',
      description: 'Works with `formControlName` / `ngModel`, including the disabled state of the control.',
      component: ZardDemoColorPickerFormComponent,
      codeData: COLOR_PICKER_DEMO_FORM,
    },
    {
      name: 'sizes',
      description: '`zSize` follows the button scale, so the picker lines up with the inputs around it.',
      component: ZardDemoColorPickerSizesComponent,
      codeData: COLOR_PICKER_DEMO_SIZES,
    },
  ],
};
