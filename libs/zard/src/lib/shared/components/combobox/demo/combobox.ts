import { COMBOBOX_DEMO_AUTO_HIGHLIGHT } from '@generated/components/combobox/demo/auto-highlight';
import { COMBOBOX_DEMO_CLEAR } from '@generated/components/combobox/demo/clear';
import { COMBOBOX_DEMO_CUSTOM_ITEMS } from '@generated/components/combobox/demo/custom-items';
import { COMBOBOX_DEMO_DISABLED } from '@generated/components/combobox/demo/disabled';
import { COMBOBOX_DEMO_GROUPS } from '@generated/components/combobox/demo/groups';
import { COMBOBOX_DEMO_INPUT_GROUP } from '@generated/components/combobox/demo/input-group';
import { COMBOBOX_DEMO_INVALID } from '@generated/components/combobox/demo/invalid';
import { COMBOBOX_DEMO_MULTIPLE } from '@generated/components/combobox/demo/multiple';
import { COMBOBOX_DEMO_POPUP } from '@generated/components/combobox/demo/popup';
import { COMBOBOX_DEMO_PREVIEW } from '@generated/components/combobox/demo/preview';
import { COMBOBOX_DEMO_SHORTHAND } from '@generated/components/combobox/demo/shorthand';
import { COMBOBOX_CLI_ADD } from '@generated/installation/cli/add-combobox';
import { COMBOBOX_MANUAL_CODE } from '@generated/installation/manual/combobox';
import { COMBOBOX_USAGE_IMPORT, COMBOBOX_USAGE_CODE } from '@generated/usage/combobox';

import { ZardDemoComboboxAutoHighlightComponent } from './auto-highlight';
import { ZardDemoComboboxClearComponent } from './clear';
import { ZardDemoComboboxCustomItemsComponent } from './custom-items';
import { ZardDemoComboboxDisabledComponent } from './disabled';
import { ZardDemoComboboxGroupsComponent } from './groups';
import { ZardDemoComboboxInputGroupComponent } from './input-group';
import { ZardDemoComboboxInvalidComponent } from './invalid';
import { ZardDemoComboboxMultipleComponent } from './multiple';
import { ZardDemoComboboxPopupComponent } from './popup';
import { ZardDemoComboboxPreviewComponent } from './preview';
import { ZardDemoComboboxShorthandComponent } from './shorthand';
import { COMBOBOX_API } from '../doc/api';

export const COMBOBOX = {
  api: COMBOBOX_API,
  componentName: 'combobox',
  componentType: 'combobox',
  description: 'Autocomplete input with a list of suggestions.',
  about: {
    description:
      '`z-combobox` is a multi-part composition: an editable trigger (`z-combobox-input`, or a standalone element carrying `[z-combobox-trigger]` for the popup pattern), a `z-combobox-content` popup positioned through the CDK overlay, and one `z-combobox-item` per option, optionally grouped with `z-combobox-group`/`z-combobox-label`. Reach for it when the list needs to be filtered by typing; use `z-select` for a closed list picked without search, and `z-command` for a standalone filterable action list that is not bound to a form value, such as inside a dialog for a command palette.',
  },
  installData: {
    cliAdd: COMBOBOX_CLI_ADD,
    manualCode: COMBOBOX_MANUAL_CODE,
  },
  usage: { importBlock: COMBOBOX_USAGE_IMPORT, codeBlock: COMBOBOX_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoComboboxPreviewComponent,
    codeData: COMBOBOX_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'multiple',
      description:
        '`zMultiple` turns the combobox into a multi-select. Selected values render as removable `z-combobox-chip`s inside `z-combobox-chips`, backed by an `input[z-combobox-chips-input]` that also opens the popup on focus; the popup stays open after each pick. Paired here with `zAutoHighlight` so `Enter` selects the top match without an extra arrow key press.',
      component: ZardDemoComboboxMultipleComponent,
      codeData: COMBOBOX_DEMO_MULTIPLE,
    },
    {
      name: 'clear',
      description:
        '`zShowClear` on `z-combobox-input` adds a `button[z-combobox-clear]` next to the chevron once a value is selected. It clears the selection and the query and returns focus to the input.',
      component: ZardDemoComboboxClearComponent,
      codeData: COMBOBOX_DEMO_CLEAR,
    },
    {
      name: 'groups',
      description:
        'Options organised into named sections with `z-combobox-group` and `z-combobox-label`, divided by `z-combobox-separator`. A group hides itself automatically once every item inside it is filtered out by the query.',
      component: ZardDemoComboboxGroupsComponent,
      codeData: COMBOBOX_DEMO_GROUPS,
    },
    {
      name: 'custom-items',
      description:
        'A `z-combobox-item` can project arbitrary content instead of plain text — here each item renders a `z-item` with a title and description. `zLabel` keeps driving the filter match and the closed-state text independently of the projected markup.',
      component: ZardDemoComboboxCustomItemsComponent,
      codeData: COMBOBOX_DEMO_CUSTOM_ITEMS,
    },
    {
      name: 'invalid',
      description:
        '`zInvalid` on `z-combobox` marks it invalid, setting `data-invalid` on the host and `aria-invalid` on the input. Composed here inside `z-field` with `z-field-label` and `z-field-error` for the full validation pattern.',
      component: ZardDemoComboboxInvalidComponent,
      codeData: COMBOBOX_DEMO_INVALID,
    },
    {
      name: 'disabled',
      description:
        '`zDisabled` on `z-combobox` disables the whole control; `zDisabled` on an individual `z-combobox-item` disables just that option while leaving the rest selectable.',
      component: ZardDemoComboboxDisabledComponent,
      codeData: COMBOBOX_DEMO_DISABLED,
    },
    {
      name: 'auto-highlight',
      description:
        '`zAutoHighlight` highlights the first matching, selectable item as soon as the query changes, so pressing `Enter` selects it without navigating with the arrow keys first. Compare with `popup`, where the popup itself — not the highlight — is the thing being customised.',
      component: ZardDemoComboboxAutoHighlightComponent,
      codeData: COMBOBOX_DEMO_AUTO_HIGHLIGHT,
    },
    {
      name: 'shorthand',
      description:
        'zard-only shorthand: pass `[options]` (or `[groups]`) straight to `z-combobox` and project nothing. With no `z-combobox-content` in the template, the root renders its own input and popup from the option list — no `z-combobox-input`, `z-combobox-item` or `z-combobox-content` markup needed. `(zComboSelected)` reports the option that was chosen. Trades the composition every other example uses for brevity.',
      component: ZardDemoComboboxShorthandComponent,
      codeData: COMBOBOX_DEMO_SHORTHAND,
    },
    {
      name: 'popup',
      description:
        'A standalone `button[z-button][z-combobox-trigger]` opens and anchors the popup, with `z-combobox-value` rendering the selected label inside it. The `z-combobox-input` moves inside `z-combobox-content` with `[zShowTrigger]="false"`, so typing only happens once the popup is open — unlike `preview`, where the input is always visible and drives the popup directly.',
      component: ZardDemoComboboxPopupComponent,
      codeData: COMBOBOX_DEMO_POPUP,
    },
    {
      name: 'input-group',
      description:
        'A `z-input-group-addon` projected into `z-combobox-input` adds a leading icon to the real `z-input-group` the input renders internally, shown together with grouped options.',
      component: ZardDemoComboboxInputGroupComponent,
      codeData: COMBOBOX_DEMO_INPUT_GROUP,
    },
  ],
};
