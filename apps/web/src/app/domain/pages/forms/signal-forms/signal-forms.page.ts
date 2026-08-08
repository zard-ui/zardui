import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { FORMS_SIGNAL_ARRAY } from '@generated/forms/signal/array';
import { FORMS_SIGNAL_CHECKBOX } from '@generated/forms/signal/checkbox';
import { FORMS_SIGNAL_COMPLEX } from '@generated/forms/signal/complex';
import { FORMS_SIGNAL_DEMO } from '@generated/forms/signal/demo';
import { FORMS_SIGNAL_INPUT } from '@generated/forms/signal/input';
import { FORMS_SIGNAL_RADIO } from '@generated/forms/signal/radio';
import { FORMS_SIGNAL_SELECT } from '@generated/forms/signal/select';
import { FORMS_SIGNAL_SWITCH } from '@generated/forms/signal/switch';
import { FORMS_SIGNAL_TEXTAREA } from '@generated/forms/signal/textarea';
import {
  FORMS_SIGNAL_SNIPPET_ANATOMY,
  FORMS_SIGNAL_SNIPPET_ARRAY_MUTATE,
  FORMS_SIGNAL_SNIPPET_ARRAY_SCHEMA,
  FORMS_SIGNAL_SNIPPET_ARRAY_STRUCTURE,
  FORMS_SIGNAL_SNIPPET_ASYNC,
  FORMS_SIGNAL_SNIPPET_CUSTOM_VALIDATE,
  FORMS_SIGNAL_SNIPPET_DEBOUNCE,
  FORMS_SIGNAL_SNIPPET_ERRORS,
  FORMS_SIGNAL_SNIPPET_FIELD_STATE,
  FORMS_SIGNAL_SNIPPET_RESET,
  FORMS_SIGNAL_SNIPPET_REUSABLE_SCHEMA,
  FORMS_SIGNAL_SNIPPET_SCHEMA,
  FORMS_SIGNAL_SNIPPET_SERVER_ERRORS,
  FORMS_SIGNAL_SNIPPET_SETUP,
  FORMS_SIGNAL_SNIPPET_STANDARD_SCHEMA,
  FORMS_SIGNAL_SNIPPET_VALIDATORS,
} from '@generated/forms/snippets/signal';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { FormsSectionComponent } from '../components/forms-section.component';
import { FormsSubsectionComponent } from '../components/forms-subsection.component';
import { ZardFormsSignalArrayComponent } from '../demos/signal/array';
import { ZardFormsSignalCheckboxComponent } from '../demos/signal/checkbox';
import { ZardFormsSignalComplexComponent } from '../demos/signal/complex';
import { ZardFormsSignalDemoComponent } from '../demos/signal/demo';
import { ZardFormsSignalInputComponent } from '../demos/signal/input';
import { ZardFormsSignalRadioComponent } from '../demos/signal/radio';
import { ZardFormsSignalSelectComponent } from '../demos/signal/select';
import { ZardFormsSignalSwitchComponent } from '../demos/signal/switch';
import { ZardFormsSignalTextareaComponent } from '../demos/signal/textarea';
import { FORM_APPROACHES } from '../forms.constant';

@Component({
  selector: 'z-signal-forms',
  templateUrl: './signal-forms.page.html',
  imports: [
    CodeBlockComponent,
    DocContentComponent,
    DocHeadingComponent,
    FormsSectionComponent,
    FormsSubsectionComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardCodeBoxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormsPage implements OnInit {
  private readonly seoService = inject(SeoService);

  activeAnchor?: string;

  protected readonly demos = {
    demo: { component: ZardFormsSignalDemoComponent, code: FORMS_SIGNAL_DEMO },
    input: { component: ZardFormsSignalInputComponent, code: FORMS_SIGNAL_INPUT },
    textarea: { component: ZardFormsSignalTextareaComponent, code: FORMS_SIGNAL_TEXTAREA },
    select: { component: ZardFormsSignalSelectComponent, code: FORMS_SIGNAL_SELECT },
    checkbox: { component: ZardFormsSignalCheckboxComponent, code: FORMS_SIGNAL_CHECKBOX },
    radio: { component: ZardFormsSignalRadioComponent, code: FORMS_SIGNAL_RADIO },
    switch: { component: ZardFormsSignalSwitchComponent, code: FORMS_SIGNAL_SWITCH },
    complex: { component: ZardFormsSignalComplexComponent, code: FORMS_SIGNAL_COMPLEX },
    array: { component: ZardFormsSignalArrayComponent, code: FORMS_SIGNAL_ARRAY },
  } as const;

  protected readonly snippets = {
    anatomy: FORMS_SIGNAL_SNIPPET_ANATOMY,
    schema: FORMS_SIGNAL_SNIPPET_SCHEMA,
    setup: FORMS_SIGNAL_SNIPPET_SETUP,
    validators: FORMS_SIGNAL_SNIPPET_VALIDATORS,
    customValidate: FORMS_SIGNAL_SNIPPET_CUSTOM_VALIDATE,
    async: FORMS_SIGNAL_SNIPPET_ASYNC,
    standardSchema: FORMS_SIGNAL_SNIPPET_STANDARD_SCHEMA,
    fieldState: FORMS_SIGNAL_SNIPPET_FIELD_STATE,
    reusableSchema: FORMS_SIGNAL_SNIPPET_REUSABLE_SCHEMA,
    debounce: FORMS_SIGNAL_SNIPPET_DEBOUNCE,
    serverErrors: FORMS_SIGNAL_SNIPPET_SERVER_ERRORS,
    errors: FORMS_SIGNAL_SNIPPET_ERRORS,
    reset: FORMS_SIGNAL_SNIPPET_RESET,
    arraySchema: FORMS_SIGNAL_SNIPPET_ARRAY_SCHEMA,
    arrayStructure: FORMS_SIGNAL_SNIPPET_ARRAY_STRUCTURE,
    arrayMutate: FORMS_SIGNAL_SNIPPET_ARRAY_MUTATE,
  } as const;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'demo', label: 'Demo', type: 'custom' },
      { id: 'approach', label: 'Approach', type: 'custom' },
      { id: 'anatomy', label: 'Anatomy', type: 'custom' },
      { id: 'form', label: 'Form', type: 'custom' },
      { id: 'validation', label: 'Validation', type: 'custom' },
      { id: 'schema-logic', label: 'Schema Logic', type: 'custom' },
      { id: 'displaying-errors', label: 'Displaying Errors', type: 'custom' },
      {
        id: 'field-types',
        label: 'Field Types',
        type: 'custom',
        children: [
          { id: 'field-input', label: 'Input', type: 'custom' },
          { id: 'field-textarea', label: 'Textarea', type: 'custom' },
          { id: 'field-select', label: 'Select', type: 'custom' },
          { id: 'field-checkbox', label: 'Checkbox', type: 'custom' },
          { id: 'field-radio', label: 'Radio Group', type: 'custom' },
          { id: 'field-switch', label: 'Switch', type: 'custom' },
          { id: 'field-complex', label: 'Complex Forms', type: 'custom' },
        ],
      },
      { id: 'resetting', label: 'Resetting the Form', type: 'custom' },
      { id: 'array-fields', label: 'Array Fields', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    const approach = FORM_APPROACHES.find(item => item.slug === 'signal-forms');
    this.seoService.setDocsSeo(
      approach?.title ?? 'Signal Forms',
      approach?.description ?? 'Build forms in Angular using Signal Forms and zard/ui.',
      '/docs/forms/signal-forms',
      'og-forms.jpg',
    );
  }
}
