import { Component } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { render, screen } from '@testing-library/angular';

import { ZardEmptyComponent } from './empty.component';
import { emptyDescriptionVariants, emptyIconVariants, emptyTitleVariants, emptyVariants } from './empty.variants';

describe('ZardEmptyComponent', () => {
  it('should render with default empty classes', async () => {
    const fixture: ComponentFixture<ZardEmptyComponent> = (await render(ZardEmptyComponent)).fixture;

    const emptyElement = fixture.debugElement.nativeElement;
    expect(emptyElement).toHaveClass(emptyVariants());
  });

  it('should apply custom classes', async () => {
    const fixture: ComponentFixture<ZardEmptyComponent> = (
      await render(ZardEmptyComponent, { inputs: { class: 'custom-class' } })
    ).fixture;

    const emptyElement = fixture.debugElement.nativeElement;
    expect(emptyElement).toHaveClass('custom-class');
  });

  it('should render image when provided', async () => {
    const url = 'url';
    await render(ZardEmptyComponent, { inputs: { zImage: url } });

    const imageElement = screen.getByAltText('Empty');
    expect(imageElement).toBeVisible();
    expect(imageElement).toHaveAttribute('src', url);
    expect(imageElement).toHaveClass('mx-auto');
  });

  it('should render an ZardIcon when provided', async () => {
    await render(ZardEmptyComponent, { inputs: { zIcon: 'inbox' } });

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeVisible();
    expect(iconElement).toHaveClass(emptyIconVariants());

    const zIcon = iconElement.querySelector('z-icon');
    expect(zIcon).toBeVisible();
    expect(zIcon).toHaveAttribute('zsize', 'xl');
  });

  it('should render title when provided', async () => {
    const title = 'No data';
    await render(ZardEmptyComponent, { inputs: { zTitle: title } });

    const titleElement = screen.getByText(title);
    expect(titleElement).toBeVisible();
    expect(titleElement).toHaveClass(emptyTitleVariants());
  });

  it('should render description when provided', async () => {
    const description = 'No data found';
    await render(ZardEmptyComponent, { inputs: { zDescription: description } });

    const descriptionElement = screen.getByText(description);
    expect(descriptionElement).toBeVisible();
    expect(descriptionElement).toHaveClass(emptyDescriptionVariants());
  });

  it('should render image over icon when both are provided', async () => {
    await render(ZardEmptyComponent, { inputs: { zIcon: 'inbox', zImage: 'url' } });

    const imageElement = screen.getByAltText('Empty');
    const iconElement = screen.queryByTestId('icon');
    expect(imageElement).toBeVisible();
    expect(imageElement).toHaveAttribute('src', 'url');
    expect(iconElement).toBeNull();
  });

  it('should render template ref when provided for image', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardEmptyComponent],
      template: `
        <z-empty [zImage]="image" />

        <ng-template #image>
          <svg viewBox="0 0 10 10"></svg>
        </ng-template>
      `,
    })
    class TestHostComponent {}

    const hostFixture = (await render(TestHostComponent)).fixture;

    const imageElement = hostFixture.debugElement.query(By.css('svg'));
    expect(imageElement).toBeTruthy();
    expect(imageElement.nativeElement.tagName.toLowerCase()).toBe('svg');
    expect(imageElement.nativeElement).toHaveAttribute('viewBox', '0 0 10 10');
  });

  it('should render template ref when provided for title', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardEmptyComponent],
      template: `
        <z-empty [zTitle]="title" />

        <ng-template #title>
          <span>Title</span>
        </ng-template>
      `,
    })
    class TestHostComponent {}

    const hostFixture = (await render(TestHostComponent)).fixture;

    const titleElement = hostFixture.debugElement.query(By.css('span')).nativeElement;
    expect(titleElement).toBeVisible();
    expect(titleElement).toHaveTextContent('Title');
  });

  it('should render template ref when provided for description', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardEmptyComponent],
      template: `
        <z-empty [zDescription]="description" />

        <ng-template #description>
          <span class="text-orange-400">Description</span>
        </ng-template>
      `,
    })
    class TestHostComponent {}

    const hostFixture = (await render(TestHostComponent)).fixture;

    const descriptionElement = hostFixture.debugElement.query(By.css('span')).nativeElement;
    expect(descriptionElement).toBeVisible();
    expect(descriptionElement).toHaveTextContent('Description');
    expect(descriptionElement).toHaveClass('text-orange-400');
  });

  it('should render template ref when provided for actions', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardEmptyComponent],
      template: `
        <z-empty [zActions]="[action]" />

        <ng-template #action>
          <button z-button>Action</button>
        </ng-template>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    const btn = screen.getByRole('button', { name: 'Action' });
    expect(btn).toBeVisible();
    expect(btn).toHaveAttribute('z-button');
  });
});
