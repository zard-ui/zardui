import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { FORMS_REACTIVE_ARRAY } from '@generated/forms/reactive/array';
import { FORMS_REACTIVE_CHECKBOX } from '@generated/forms/reactive/checkbox';
import { FORMS_REACTIVE_COMPLEX } from '@generated/forms/reactive/complex';
import { FORMS_REACTIVE_DEMO } from '@generated/forms/reactive/demo';
import { FORMS_REACTIVE_INPUT } from '@generated/forms/reactive/input';
import { FORMS_REACTIVE_RADIO } from '@generated/forms/reactive/radio';
import { FORMS_REACTIVE_SELECT } from '@generated/forms/reactive/select';
import { FORMS_REACTIVE_SWITCH } from '@generated/forms/reactive/switch';
import { FORMS_REACTIVE_TEXTAREA } from '@generated/forms/reactive/textarea';
import {
  FORMS_REACTIVE_SNIPPET_ANATOMY,
  FORMS_REACTIVE_SNIPPET_ARRAY_MUTATE,
  FORMS_REACTIVE_SNIPPET_ARRAY_SETUP,
  FORMS_REACTIVE_SNIPPET_ARRAY_STRUCTURE,
  FORMS_REACTIVE_SNIPPET_ASYNC_VALIDATOR,
  FORMS_REACTIVE_SNIPPET_BIND,
  FORMS_REACTIVE_SNIPPET_CHANGES,
  FORMS_REACTIVE_SNIPPET_CUSTOM_VALIDATOR,
  FORMS_REACTIVE_SNIPPET_DISABLING,
  FORMS_REACTIVE_SNIPPET_ERRORS,
  FORMS_REACTIVE_SNIPPET_FORM_BUILDER,
  FORMS_REACTIVE_SNIPPET_RESET,
  FORMS_REACTIVE_SNIPPET_RUNTIME_VALIDATORS,
  FORMS_REACTIVE_SNIPPET_SCHEMA,
  FORMS_REACTIVE_SNIPPET_SETUP,
  FORMS_REACTIVE_SNIPPET_UPDATE_ON,
  FORMS_REACTIVE_SNIPPET_UPDATING,
  FORMS_REACTIVE_SNIPPET_VALIDATORS,
} from '@generated/forms/snippets/reactive';
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
import { ZardFormsReactiveArrayComponent } from '../demos/reactive/array';
import { ZardFormsReactiveCheckboxComponent } from '../demos/reactive/checkbox';
import { ZardFormsReactiveComplexComponent } from '../demos/reactive/complex';
import { ZardFormsReactiveDemoComponent } from '../demos/reactive/demo';
import { ZardFormsReactiveInputComponent } from '../demos/reactive/input';
import { ZardFormsReactiveRadioComponent } from '../demos/reactive/radio';
import { ZardFormsReactiveSelectComponent } from '../demos/reactive/select';
import { ZardFormsReactiveSwitchComponent } from '../demos/reactive/switch';
import { ZardFormsReactiveTextareaComponent } from '../demos/reactive/textarea';
import { FORM_APPROACHES } from '../forms.constant';

@Component({
  selector: 'z-reactive-forms',
  templateUrl: './reactive-forms.page.html',
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
export class ReactiveFormsPage implements OnInit {
  private readonly seoService = inject(SeoService);

  activeAnchor?: string;

  protected readonly demos = {
    demo: { component: ZardFormsReactiveDemoComponent, code: FORMS_REACTIVE_DEMO },
    input: { component: ZardFormsReactiveInputComponent, code: FORMS_REACTIVE_INPUT },
    textarea: { component: ZardFormsReactiveTextareaComponent, code: FORMS_REACTIVE_TEXTAREA },
    select: { component: ZardFormsReactiveSelectComponent, code: FORMS_REACTIVE_SELECT },
    checkbox: { component: ZardFormsReactiveCheckboxComponent, code: FORMS_REACTIVE_CHECKBOX },
    radio: { component: ZardFormsReactiveRadioComponent, code: FORMS_REACTIVE_RADIO },
    switch: { component: ZardFormsReactiveSwitchComponent, code: FORMS_REACTIVE_SWITCH },
    complex: { component: ZardFormsReactiveComplexComponent, code: FORMS_REACTIVE_COMPLEX },
    array: { component: ZardFormsReactiveArrayComponent, code: FORMS_REACTIVE_ARRAY },
  } as const;

  protected readonly snippets = {
    anatomy: FORMS_REACTIVE_SNIPPET_ANATOMY,
    schema: FORMS_REACTIVE_SNIPPET_SCHEMA,
    formBuilder: FORMS_REACTIVE_SNIPPET_FORM_BUILDER,
    setup: FORMS_REACTIVE_SNIPPET_SETUP,
    bind: FORMS_REACTIVE_SNIPPET_BIND,
    validators: FORMS_REACTIVE_SNIPPET_VALIDATORS,
    customValidator: FORMS_REACTIVE_SNIPPET_CUSTOM_VALIDATOR,
    asyncValidator: FORMS_REACTIVE_SNIPPET_ASYNC_VALIDATOR,
    updateOn: FORMS_REACTIVE_SNIPPET_UPDATE_ON,
    disabling: FORMS_REACTIVE_SNIPPET_DISABLING,
    updating: FORMS_REACTIVE_SNIPPET_UPDATING,
    runtimeValidators: FORMS_REACTIVE_SNIPPET_RUNTIME_VALIDATORS,
    changes: FORMS_REACTIVE_SNIPPET_CHANGES,
    errors: FORMS_REACTIVE_SNIPPET_ERRORS,
    reset: FORMS_REACTIVE_SNIPPET_RESET,
    arraySetup: FORMS_REACTIVE_SNIPPET_ARRAY_SETUP,
    arrayStructure: FORMS_REACTIVE_SNIPPET_ARRAY_STRUCTURE,
    arrayMutate: FORMS_REACTIVE_SNIPPET_ARRAY_MUTATE,
  } as const;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'demo', label: 'Demo', type: 'custom' },
      { id: 'approach', label: 'Approach', type: 'custom' },
      { id: 'anatomy', label: 'Anatomy', type: 'custom' },
      { id: 'form', label: 'Form', type: 'custom' },
      { id: 'validation', label: 'Validation', type: 'custom' },
      { id: 'control-state', label: 'Control State', type: 'custom' },
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
    const approach = FORM_APPROACHES.find(item => item.slug === 'reactive-forms');
    this.seoService.setDocsSeo(
      approach?.title ?? 'Reactive Forms',
      approach?.description ?? 'Build forms in Angular using Reactive Forms and zard/ui.',
      '/docs/forms/reactive-forms',
      'og-forms.jpg',
    );
  }
}
