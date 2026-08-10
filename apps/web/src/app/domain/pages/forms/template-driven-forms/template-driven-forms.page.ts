import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import {
  FORMS_TEMPLATE_SNIPPET_ANATOMY,
  FORMS_TEMPLATE_SNIPPET_ARRAY_MUTATE,
  FORMS_TEMPLATE_SNIPPET_ARRAY_STRUCTURE,
  FORMS_TEMPLATE_SNIPPET_ASYNC_VALIDATOR,
  FORMS_TEMPLATE_SNIPPET_BIND,
  FORMS_TEMPLATE_SNIPPET_CROSS_FIELD,
  FORMS_TEMPLATE_SNIPPET_DISABLING,
  FORMS_TEMPLATE_SNIPPET_ERRORS,
  FORMS_TEMPLATE_SNIPPET_MODEL,
  FORMS_TEMPLATE_SNIPPET_MODEL_GROUP,
  FORMS_TEMPLATE_SNIPPET_RESET,
  FORMS_TEMPLATE_SNIPPET_SETUP,
  FORMS_TEMPLATE_SNIPPET_UPDATE_ON,
  FORMS_TEMPLATE_SNIPPET_VALIDATOR_DIRECTIVE,
  FORMS_TEMPLATE_SNIPPET_VALIDATORS,
} from '@generated/forms/snippets/template';
import { FORMS_TEMPLATE_ARRAY } from '@generated/forms/template/array';
import { FORMS_TEMPLATE_CHECKBOX } from '@generated/forms/template/checkbox';
import { FORMS_TEMPLATE_COMPLEX } from '@generated/forms/template/complex';
import { FORMS_TEMPLATE_DEMO } from '@generated/forms/template/demo';
import { FORMS_TEMPLATE_INPUT } from '@generated/forms/template/input';
import { FORMS_TEMPLATE_RADIO } from '@generated/forms/template/radio';
import { FORMS_TEMPLATE_SELECT } from '@generated/forms/template/select';
import { FORMS_TEMPLATE_SWITCH } from '@generated/forms/template/switch';
import { FORMS_TEMPLATE_TEXTAREA } from '@generated/forms/template/textarea';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { FormsSectionComponent } from '../components/forms-section.component';
import { FormsSubsectionComponent } from '../components/forms-subsection.component';
import { ZardFormsTemplateArrayComponent } from '../demos/template/array';
import { ZardFormsTemplateCheckboxComponent } from '../demos/template/checkbox';
import { ZardFormsTemplateComplexComponent } from '../demos/template/complex';
import { ZardFormsTemplateDemoComponent } from '../demos/template/demo';
import { ZardFormsTemplateInputComponent } from '../demos/template/input';
import { ZardFormsTemplateRadioComponent } from '../demos/template/radio';
import { ZardFormsTemplateSelectComponent } from '../demos/template/select';
import { ZardFormsTemplateSwitchComponent } from '../demos/template/switch';
import { ZardFormsTemplateTextareaComponent } from '../demos/template/textarea';
import { FORM_APPROACHES } from '../forms.constant';

@Component({
  selector: 'z-template-driven-forms',
  templateUrl: './template-driven-forms.page.html',
  imports: [
    CalloutComponent,
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
export class TemplateDrivenFormsPage implements OnInit {
  private readonly seoService = inject(SeoService);

  activeAnchor?: string;

  protected readonly demos = {
    demo: { component: ZardFormsTemplateDemoComponent, code: FORMS_TEMPLATE_DEMO },
    input: { component: ZardFormsTemplateInputComponent, code: FORMS_TEMPLATE_INPUT },
    textarea: { component: ZardFormsTemplateTextareaComponent, code: FORMS_TEMPLATE_TEXTAREA },
    select: { component: ZardFormsTemplateSelectComponent, code: FORMS_TEMPLATE_SELECT },
    checkbox: { component: ZardFormsTemplateCheckboxComponent, code: FORMS_TEMPLATE_CHECKBOX },
    radio: { component: ZardFormsTemplateRadioComponent, code: FORMS_TEMPLATE_RADIO },
    switch: { component: ZardFormsTemplateSwitchComponent, code: FORMS_TEMPLATE_SWITCH },
    complex: { component: ZardFormsTemplateComplexComponent, code: FORMS_TEMPLATE_COMPLEX },
    array: { component: ZardFormsTemplateArrayComponent, code: FORMS_TEMPLATE_ARRAY },
  } as const;

  protected readonly snippets = {
    anatomy: FORMS_TEMPLATE_SNIPPET_ANATOMY,
    model: FORMS_TEMPLATE_SNIPPET_MODEL,
    setup: FORMS_TEMPLATE_SNIPPET_SETUP,
    bind: FORMS_TEMPLATE_SNIPPET_BIND,
    modelGroup: FORMS_TEMPLATE_SNIPPET_MODEL_GROUP,
    validators: FORMS_TEMPLATE_SNIPPET_VALIDATORS,
    crossField: FORMS_TEMPLATE_SNIPPET_CROSS_FIELD,
    validatorDirective: FORMS_TEMPLATE_SNIPPET_VALIDATOR_DIRECTIVE,
    asyncValidator: FORMS_TEMPLATE_SNIPPET_ASYNC_VALIDATOR,
    updateOn: FORMS_TEMPLATE_SNIPPET_UPDATE_ON,
    disabling: FORMS_TEMPLATE_SNIPPET_DISABLING,
    errors: FORMS_TEMPLATE_SNIPPET_ERRORS,
    reset: FORMS_TEMPLATE_SNIPPET_RESET,
    arrayStructure: FORMS_TEMPLATE_SNIPPET_ARRAY_STRUCTURE,
    arrayMutate: FORMS_TEMPLATE_SNIPPET_ARRAY_MUTATE,
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
    const approach = FORM_APPROACHES.find(item => item.slug === 'template-driven-forms');
    this.seoService.setDocsSeo(
      approach?.title ?? 'Template-driven Forms',
      approach?.description ?? 'Build forms in Angular using Template-driven Forms and zard/ui.',
      '/docs/forms/template-driven-forms',
      'og-forms.jpg',
    );
  }
}
