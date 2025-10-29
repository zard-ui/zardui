import { Component, type DebugElement } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { render, screen } from '@testing-library/angular';

import { ZardEmptyComponent } from './empty.component';
import { emptyDescriptionVariants, emptyIconVariants, emptyTitleVariants, emptyVariants } from './empty.variants';

describe('ZardEmptyComponent', () => {
  let component: ZardEmptyComponent;
  let fixture: ComponentFixture<ZardEmptyComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardEmptyComponent],
    }).compileComponents();

    await render(ZardEmptyComponent);

    fixture = TestBed.createComponent(ZardEmptyComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default empty classes', () => {
    const cardElement = debugElement.nativeElement;
    expect(cardElement).toHaveClass(emptyVariants());
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const cardElement = debugElement.nativeElement;
    expect(cardElement).toHaveClass('custom-class');
  });

  it('should render image when provided', () => {
    fixture.componentRef.setInput('zImage', 'url');
    fixture.detectChanges();

    const imageElement = screen.getByAltText('Empty');
    expect(imageElement).toBeTruthy();
    expect(imageElement).toHaveAttribute('src', component.zImage());
    expect(imageElement).toHaveClass('mx-auto');
  });

  it('should render an ZardIcon when provided', () => {
    fixture.componentRef.setInput('zIcon', 'inbox');
    fixture.detectChanges();

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement).toHaveClass(emptyIconVariants());
    expect(iconElement).toContainHTML('<z-icon');
  });

  it('should render title when provided', () => {
    const title = 'No data';
    fixture.componentRef.setInput('zTitle', title);
    fixture.detectChanges();

    const titleElement = screen.getByText(title);
    expect(titleElement).toBeTruthy();
    expect(titleElement).toHaveClass(emptyTitleVariants());
  });

  it('should render description when provided', () => {
    const description = 'No data found';
    fixture.componentRef.setInput('zDescription', description);
    fixture.detectChanges();

    const titleElement = screen.getByText(description);
    expect(titleElement).toBeTruthy();
    expect(titleElement).toHaveClass(emptyDescriptionVariants());
  });

  it('should render template ref when provided for image', () => {
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

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const imageElement = hostFixture.debugElement.query(By.css('svg'));
    expect(imageElement).toBeTruthy();
    expect(imageElement.nativeNode).toContainHTML('<svg viewBox="0 0 10 10" />');
  });

  it('should render template ref when provided for title', () => {
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

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const titleElement = hostFixture.debugElement.query(By.css('span'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeNode).toHaveTextContent('Title');
  });

  it('should render template ref when provided for description', () => {
    @Component({
      selector: 'test-host',
      imports: [ZardEmptyComponent],
      template: `
        <z-empty [zDescription]="description" />

        <ng-template #description>
          <span>Description</span>
        </ng-template>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const descriptionElement = hostFixture.debugElement.query(By.css('span'));
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.nativeNode).toHaveTextContent('Description');
  });

  it('should render template ref when provided for actions', () => {
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

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const actionsElement = hostFixture.debugElement.query(By.css('button'));
    expect(actionsElement).toBeTruthy();
    expect(actionsElement.nativeNode).toContainHTML('<button z-button="">Action</button>');
  });
});
