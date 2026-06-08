import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import { ZardCardComponent } from './card.component';
import { ZardCardImports } from './card.imports';

describe('ZardCardComponent', () => {
  it('renders with default variant classes', async () => {
    const { debugElement } = await render(ZardCardComponent);

    const card = debugElement.nativeElement;
    expect(card).toHaveClass('rounded-xl', 'bg-card', 'text-card-foreground');
    expect(card).toHaveClass('flex', 'flex-col', 'py-4');
  });

  it('applies custom classes', async () => {
    const { debugElement } = await render(ZardCardComponent, {
      componentInputs: { class: 'custom-class' },
    });

    expect(debugElement.nativeElement).toHaveClass('custom-class');
  });

  it('projects content via ng-content', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: '<div z-card>Projected content</div>',
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Projected content')).toBeInTheDocument();
  });

  it('sets data-size attribute based on zSize input', async () => {
    const { debugElement } = await render(ZardCardComponent, {
      componentInputs: { zSize: 'sm' },
    });

    expect(debugElement.nativeElement).toHaveAttribute('data-size', 'sm');
  });
});

describe('ZardCardHeaderComponent', () => {
  it('renders with header variant classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-header>Header</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toHaveClass('grid', 'items-start', 'gap-1', 'px-4');
  });

  it('applies border-b when zHeaderBorder is true', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-header [zHeaderBorder]="true">Header</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-header"]')).toHaveClass('border-b');
  });

  it('omits border-b when zHeaderBorder is false', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-header>Header</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-header"]')).not.toHaveClass('border-b');
  });
});

describe('ZardCardTitleComponent', () => {
  it('renders string title via zTitle input', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-title zTitle="Test Title"></div></div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders template reference for zTitle', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card>
          <div z-card-title [zTitle]="titleTpl">
            <ng-template #titleTpl><span>Custom Title</span></ng-template>
          </div>
        </div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('applies title variant classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-title zTitle="Title"></div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-title"]')).toHaveClass('font-medium');
  });

  it('applies custom classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-title zTitle="Title" class="w-full"></div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-title"]')).toHaveClass('w-full');
  });
});

describe('ZardCardDescriptionComponent', () => {
  it('renders string description via zDescription input', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-description zDescription="Test Desc"></div></div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Test Desc')).toBeInTheDocument();
  });

  it('renders template reference for zDescription', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card>
          <div z-card-description [zDescription]="descTpl">
            <ng-template #descTpl><span>Custom Desc</span></ng-template>
          </div>
        </div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Custom Desc')).toBeInTheDocument();
  });

  it('applies description variant classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-description zDescription="Desc"></div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-description"]')).toHaveClass('text-muted-foreground');
  });
});

describe('ZardCardActionComponent', () => {
  it('projects content via ng-content', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-action>Action label</div></div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Action label')).toBeInTheDocument();
  });

  it('applies action variant classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-action>Edit</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-action"]')).toHaveClass('col-start-2', 'self-start');
  });

  it('applies custom classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-action class="w-full">Edit</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-action"]')).toHaveClass('w-full');
  });
});

describe('ZardCardContentComponent', () => {
  it('renders with content variant classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-content>Body</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-content"]')).toHaveClass('px-4');
  });

  it('applies custom classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-content class="w-full">Body</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-content"]')).toHaveClass('w-full');
  });

  it('projects content via ng-content', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-content>Projected body</div></div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Projected body')).toBeInTheDocument();
  });
});

describe('ZardCardFooterComponent', () => {
  it('renders with footer variant classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-footer>Footer</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toHaveClass('flex', 'items-center', 'p-4');
  });

  it('applies border-t when zFooterBorder is true', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-footer [zFooterBorder]="true">Footer</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-footer"]')).toHaveClass('border-t');
  });

  it('applies custom classes', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-footer class="w-full">Footer</div></div>
      `,
    })
    class TestHostComponent {}

    const { container } = await render(TestHostComponent);

    expect(container.querySelector('[data-slot="card-footer"]')).toHaveClass('w-full');
  });

  it('projects content via ng-content', async () => {
    @Component({
      selector: 'test-host',
      imports: [...ZardCardImports],
      template: `
        <div z-card><div z-card-footer>Footer content</div></div>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
