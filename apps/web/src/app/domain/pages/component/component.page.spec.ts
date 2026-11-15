import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { ComponentData } from '@doc/shared/constants/components.constant';

import { ComponentPage } from './component.page';

@Component({ template: '' })
class TestDemoComponent {}

const CODE_DATA = {
  html: '<pre></pre>',
  code: '',
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

describe('ComponentPage', () => {
  let component: ComponentPage;
  let fixture: ComponentFixture<ComponentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders accessibility after examples and immediately before the API', () => {
    const data: ComponentData = {
      componentName: 'questionnaire',
      description: 'Questionnaire documentation.',
      examples: [{ name: 'default', component: TestDemoComponent, codeData: CODE_DATA }],
      accessibility: ['Use labelled native controls.'],
      api: [{ selector: 'z-questionnaire', props: [], outputs: [] }],
    };

    component.componentData.set(data);
    fixture.detectChanges();

    const sections = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('#examples, #accessibility, #api'),
    ).map(section => section.id);

    expect(sections).toEqual(['examples', 'accessibility', 'api']);
  });

  it('renders backtick-delimited accessibility references as inline code', () => {
    const data: ComponentData = {
      componentName: 'questionnaire',
      description: 'Questionnaire documentation.',
      examples: [{ name: 'default', component: TestDemoComponent, codeData: CODE_DATA }],
      accessibility: [
        'Each `z-questionnaire-item` renders a fieldset.',
        'Give `z-questionnaire-input` an accessible name.',
      ],
    };

    component.componentData.set(data);
    fixture.detectChanges();

    const accessibility = (fixture.nativeElement as HTMLElement).querySelector('#accessibility') as HTMLElement;
    const code = Array.from(accessibility.querySelectorAll('code'));

    expect(code.map(element => element.textContent)).toEqual(['z-questionnaire-item', 'z-questionnaire-input']);
    expect(accessibility.textContent).not.toContain('`');
    expect(accessibility.textContent).toContain('Each z-questionnaire-item renders a fieldset.');
  });

  it('renders extended usage guidance and additional code blocks', () => {
    const data: ComponentData = {
      componentName: 'questionnaire',
      description: 'Questionnaire documentation.',
      examples: [{ name: 'default', component: TestDemoComponent, codeData: CODE_DATA }],
      usage: {
        importBlock: { ...CODE_DATA, code: 'imports' },
        codeBlock: { ...CODE_DATA, code: 'items' },
        description: 'Define the collection once, then project it into the parts.',
        additionalBlocks: [
          { ...CODE_DATA, code: 'template' },
          { ...CODE_DATA, code: 'submit' },
        ],
      },
    };

    component.componentData.set(data);
    fixture.detectChanges();

    const usage = (fixture.nativeElement as HTMLElement).querySelector('#usage') as HTMLElement;

    expect(usage.textContent).toContain('Define the collection once, then project it into the parts.');
    expect(usage.querySelectorAll('z-code-block')).toHaveLength(4);
  });
});
