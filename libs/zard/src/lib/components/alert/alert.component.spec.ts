import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardAlertComponent } from './alert.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert zTitle="Test Title" zDescription="Test Description" zIcon="info" class="custom-class"></z-alert> `,
})
class TestHostComponent {}

describe('ZardAlertComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent));
    expect(alert).toBeTruthy();
  });

  it('should render title and description', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const titleElement = alert.querySelector('[data-slot="alert-title"]');
    const descriptionElement = alert.querySelector('[data-slot="alert-description"]');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Test Title');
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should apply custom classes', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    expect(alert.classList).toContain('custom-class');
    expect(alert.getAttribute('data-slot')).toBe('alert');
    expect(alert.getAttribute('role')).toBe('alert');
  });

  it('should render only description when title is omitted', () => {
    @Component({
      selector: 'test-host-description-only',
      standalone: true,
      imports: [ZardAlertComponent],
      template: ` <z-alert zDescription="Only description provided"></z-alert> `,
    })
    class TestHostDescriptionOnly {}

    const descOnlyFixture = TestBed.createComponent(TestHostDescriptionOnly);
    descOnlyFixture.detectChanges();

    const alert = descOnlyFixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const titleElement = alert.querySelector('[data-slot="alert-title"]');
    const descriptionElement = alert.querySelector('[data-slot="alert-description"]');

    expect(titleElement).toBeNull();
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.textContent).toContain('Only description provided');
  });

  it('should render only title when description is omitted', () => {
    @Component({
      selector: 'test-host-title-only',
      standalone: true,
      imports: [ZardAlertComponent],
      template: ` <z-alert zTitle="Only title provided"></z-alert> `,
    })
    class TestHostTitleOnly {}

    const titleOnlyFixture = TestBed.createComponent(TestHostTitleOnly);
    titleOnlyFixture.detectChanges();

    const alert = titleOnlyFixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const titleElement = alert.querySelector('[data-slot="alert-title"]');
    const descriptionElement = alert.querySelector('[data-slot="alert-description"]');

    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Only title provided');
    expect(descriptionElement).toBeNull();
  });

  it('should not render title when empty string is provided', () => {
    @Component({
      selector: 'test-host-empty-title',
      standalone: true,
      imports: [ZardAlertComponent],
      template: ` <z-alert zTitle="" zDescription="Description with empty title"></z-alert> `,
    })
    class TestHostEmptyTitle {}

    const emptyTitleFixture = TestBed.createComponent(TestHostEmptyTitle);
    emptyTitleFixture.detectChanges();

    const alert = emptyTitleFixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const titleElement = alert.querySelector('[data-slot="alert-title"]');
    const descriptionElement = alert.querySelector('[data-slot="alert-description"]');

    expect(titleElement).toBeNull();
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.textContent).toContain('Description with empty title');
  });

  it('should not render description when empty string is provided', () => {
    @Component({
      selector: 'test-host-empty-description',
      standalone: true,
      imports: [ZardAlertComponent],
      template: ` <z-alert zTitle="Title with empty description" zDescription=""></z-alert> `,
    })
    class TestHostEmptyDescription {}

    const emptyDescFixture = TestBed.createComponent(TestHostEmptyDescription);
    emptyDescFixture.detectChanges();

    const alert = emptyDescFixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const titleElement = alert.querySelector('[data-slot="alert-title"]');
    const descriptionElement = alert.querySelector('[data-slot="alert-description"]');

    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Title with empty description');
    expect(descriptionElement).toBeNull();
  });

  it('should render icon when zIcon is provided', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const iconElement = alert.querySelector('[data-slot="alert-icon"]');
    const iconComponent = alert.querySelector('z-icon');

    expect(iconElement).toBeTruthy();
    expect(iconComponent).toBeTruthy();
  });

  it('should not render icon when zIcon is omitted', () => {
    @Component({
      selector: 'test-host-no-icon',
      standalone: true,
      imports: [ZardAlertComponent],
      template: ` <z-alert zTitle="No icon" zDescription="Alert without icon"></z-alert> `,
    })
    class TestHostNoIcon {}

    const noIconFixture = TestBed.createComponent(TestHostNoIcon);
    noIconFixture.detectChanges();

    const alert = noIconFixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const iconElement = alert.querySelector('[data-slot="alert-icon"]');

    expect(iconElement).toBeNull();
  });

  it('should render destructive icon automatically for destructive type', () => {
    @Component({
      selector: 'test-host-destructive',
      standalone: true,
      imports: [ZardAlertComponent],
      template: ` <z-alert zType="destructive" zTitle="Error" zDescription="Something went wrong"></z-alert> `,
    })
    class TestHostDestructive {}

    const destructiveFixture = TestBed.createComponent(TestHostDestructive);
    destructiveFixture.detectChanges();

    const alert = destructiveFixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const iconElement = alert.querySelector('[data-slot="alert-icon"]');
    const iconComponent = alert.querySelector('z-icon');

    expect(iconElement).toBeTruthy();
    expect(iconComponent).toBeTruthy();
  });
});
