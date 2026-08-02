import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { render } from '@testing-library/angular';

import {
  ZardFieldComponent,
  ZardFieldContentComponent,
  ZardFieldDescriptionComponent,
  ZardFieldErrorComponent,
  ZardFieldGroupComponent,
  ZardFieldLabelComponent,
  ZardFieldLegendComponent,
  ZardFieldSeparatorComponent,
  ZardFieldSetComponent,
  ZardFieldTitleComponent,
} from './field.component';

describe('ZardFieldComponent', () => {
  it('creates a vertical field with role group', async () => {
    @Component({
      imports: [ZardFieldComponent],
      template: `
        <z-field>content</z-field>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const field = fixture.debugElement.query(By.directive(ZardFieldComponent)).nativeElement as HTMLElement;
    expect(field.getAttribute('role')).toBe('group');
    expect(field.getAttribute('data-slot')).toBe('field');
    expect(field.getAttribute('data-orientation')).toBe('vertical');
    expect(field.className).toContain('flex-col');
  });

  it('applies horizontal orientation', async () => {
    @Component({
      imports: [ZardFieldComponent],
      template: `
        <z-field zOrientation="horizontal">content</z-field>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const field = fixture.debugElement.query(By.directive(ZardFieldComponent)).nativeElement as HTMLElement;
    expect(field.getAttribute('data-orientation')).toBe('horizontal');
    expect(field.className).toContain('flex-row');
  });
});

describe('ZardFieldSetComponent', () => {
  it('renders with data-slot=field-set', async () => {
    @Component({
      imports: [ZardFieldSetComponent],
      template: `
        <fieldset z-field-set>content</fieldset>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const fs = fixture.debugElement.query(By.directive(ZardFieldSetComponent)).nativeElement as HTMLElement;
    expect(fs.tagName).toBe('FIELDSET');
    expect(fs.getAttribute('data-slot')).toBe('field-set');
  });
});

describe('ZardFieldLegendComponent', () => {
  it('uses variant=legend by default', async () => {
    @Component({
      imports: [ZardFieldLegendComponent],
      template: `
        <legend z-field-legend>Legend</legend>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldLegendComponent)).nativeElement as HTMLElement;
    expect(el.getAttribute('data-variant')).toBe('legend');
  });

  it('accepts variant=label', async () => {
    @Component({
      imports: [ZardFieldLegendComponent],
      template: `
        <legend z-field-legend zVariant="label">Legend</legend>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldLegendComponent)).nativeElement as HTMLElement;
    expect(el.getAttribute('data-variant')).toBe('label');
  });
});

describe('ZardFieldErrorComponent', () => {
  it('renders single error message', async () => {
    @Component({
      imports: [ZardFieldErrorComponent],
      template: `
        <z-field-error [zErrors]="errors" />
      `,
    })
    class Host {
      errors = [{ message: 'Required field' }];
    }

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldErrorComponent)).nativeElement as HTMLElement;
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.textContent?.trim()).toBe('Required field');
  });

  it('renders multiple errors as a list and dedupes by message', async () => {
    @Component({
      imports: [ZardFieldErrorComponent],
      template: `
        <z-field-error [zErrors]="errors" />
      `,
    })
    class Host {
      errors = [{ message: 'Too short' }, { message: 'Too short' }, { message: 'Must be a number' }];
    }

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldErrorComponent)).nativeElement as HTMLElement;
    const items = el.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent?.trim()).toBe('Too short');
    expect(items[1].textContent?.trim()).toBe('Must be a number');
  });

  it('falls back to projected content when no errors are provided', async () => {
    @Component({
      imports: [ZardFieldErrorComponent],
      template: `
        <z-field-error>Custom message</z-field-error>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldErrorComponent)).nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('Custom message');
  });
});

describe('ZardFieldSeparatorComponent', () => {
  it('renders the separator line without content by default', async () => {
    @Component({
      imports: [ZardFieldSeparatorComponent],
      template: `
        <z-field-separator />
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldSeparatorComponent)).nativeElement as HTMLElement;
    expect(el.getAttribute('data-content')).toBe('false');
    expect(el.querySelector('[data-slot=field-separator-content]')).toBeNull();
  });

  it('renders content span when zContent is provided', async () => {
    @Component({
      imports: [ZardFieldSeparatorComponent],
      template: `
        <z-field-separator zContent="or" />
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.directive(ZardFieldSeparatorComponent)).nativeElement as HTMLElement;
    expect(el.getAttribute('data-content')).toBe('true');
    const content = el.querySelector('[data-slot=field-separator-content]');
    expect(content?.textContent?.trim()).toBe('or');
  });
});

describe('Field accessory components', () => {
  it('group, content, label, title and description carry their data-slot', async () => {
    @Component({
      imports: [
        ZardFieldGroupComponent,
        ZardFieldContentComponent,
        ZardFieldLabelComponent,
        ZardFieldTitleComponent,
        ZardFieldDescriptionComponent,
      ],
      template: `
        <div z-field-group>
          <div z-field-content>
            <label z-field-label>Email</label>
            <p z-field-description>Help text</p>
          </div>
          <div z-field-title>Title</div>
        </div>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const group = fixture.debugElement.query(By.directive(ZardFieldGroupComponent)).nativeElement as HTMLElement;
    const content = fixture.debugElement.query(By.directive(ZardFieldContentComponent)).nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.directive(ZardFieldLabelComponent)).nativeElement as HTMLElement;
    const title = fixture.debugElement.query(By.directive(ZardFieldTitleComponent)).nativeElement as HTMLElement;
    const desc = fixture.debugElement.query(By.directive(ZardFieldDescriptionComponent)).nativeElement as HTMLElement;

    expect(group.getAttribute('data-slot')).toBe('field-group');
    expect(content.getAttribute('data-slot')).toBe('field-content');
    expect(label.getAttribute('data-slot')).toBe('field-label');
    expect(title.getAttribute('data-slot')).toBe('field-label');
    expect(desc.getAttribute('data-slot')).toBe('field-description');
  });
});
