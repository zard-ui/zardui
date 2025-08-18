import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardCardComponent } from './card.component';

describe('ZardCardComponent', () => {
  let component: ZardCardComponent;
  let fixture: ComponentFixture<ZardCardComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default card classes', () => {
    const cardElement = debugElement.nativeElement;
    expect(cardElement.classList.contains('rounded-lg')).toBeTruthy();
    expect(cardElement.classList.contains('border')).toBeTruthy();
    expect(cardElement.classList.contains('bg-card')).toBeTruthy();
    expect(cardElement.classList.contains('text-card-foreground')).toBeTruthy();
    expect(cardElement.classList.contains('shadow-sm')).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const cardElement = debugElement.nativeElement;
    expect(cardElement.classList.contains('custom-class')).toBeTruthy();
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('zTitle', 'Test Title');
    fixture.detectChanges();

    const titleElement = debugElement.query(By.css('.text-2xl.font-semibold'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
  });

  it('should not render header when title is not provided', () => {
    const headerElement = debugElement.query(By.css('.flex.flex-col.space-y-1\\.5.pb-0.gap-1\\.5'));
    expect(headerElement).toBeFalsy();
  });

  it('should render description when both title and description are provided', () => {
    fixture.componentRef.setInput('zTitle', 'Test Title');
    fixture.componentRef.setInput('zDescription', 'Test Description');
    fixture.detectChanges();

    const descriptionElement = debugElement.query(By.css('.text-sm.text-muted-foreground'));
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.nativeElement.textContent.trim()).toBe('Test Description');
  });

  it('should not render description when only description is provided without title', () => {
    fixture.componentRef.setInput('zDescription', 'Test Description');
    fixture.detectChanges();

    const descriptionElement = debugElement.query(By.css('.text-sm.text-muted-foreground'));
    expect(descriptionElement).toBeFalsy();
  });

  it('should render body content with correct classes', () => {
    const bodyElement = debugElement.query(By.css('.block.mt-6'));
    expect(bodyElement).toBeTruthy();
  });

  it('should render ng-content in body', () => {
    @Component({
      selector: 'test-host',
      standalone: true,
      imports: [ZardCardComponent],
      template: `<z-card>Test Content</z-card>`,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const bodyElement = hostFixture.debugElement.query(By.css('.block.mt-6'));
    expect(bodyElement.nativeElement.textContent).toContain('Test Content');
  });

  it('should support template ref for title', () => {
    @Component({
      selector: 'test-host',
      standalone: true,
      imports: [ZardCardComponent],
      template: `
        <z-card [zTitle]="titleTemplate">
          <ng-template #titleTemplate>
            <span class="custom-title">Custom Title Template</span>
          </ng-template>
        </z-card>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const customTitleElement = hostFixture.debugElement.query(By.css('.custom-title'));
    expect(customTitleElement).toBeTruthy();
    expect(customTitleElement.nativeElement.textContent).toBe('Custom Title Template');
  });

  it('should support template ref for description', () => {
    @Component({
      selector: 'test-host',
      standalone: true,
      imports: [ZardCardComponent],
      template: `
        <z-card zTitle="Title" [zDescription]="descriptionTemplate">
          <ng-template #descriptionTemplate>
            <span class="custom-description">Custom Description Template</span>
          </ng-template>
        </z-card>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const customDescriptionElement = hostFixture.debugElement.query(By.css('.custom-description'));
    expect(customDescriptionElement).toBeTruthy();
    expect(customDescriptionElement.nativeElement.textContent).toBe('Custom Description Template');
  });

  it('should have correct CSS classes structure when fully populated', () => {
    fixture.componentRef.setInput('zTitle', 'Test Title');
    fixture.componentRef.setInput('zDescription', 'Test Description');
    fixture.detectChanges();

    const headerElement = debugElement.query(By.css('.flex.flex-col.space-y-1\\.5.pb-0.gap-1\\.5'));
    const bodyElement = debugElement.query(By.css('.block.mt-6'));

    expect(headerElement).toBeTruthy();
    expect(bodyElement).toBeTruthy();
  });
});
