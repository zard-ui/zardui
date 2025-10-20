import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { By } from '@angular/platform-browser';

import { ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent } from './breadcrumb.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
      <z-breadcrumb-item>
        <z-breadcrumb-ellipsis />
      </z-breadcrumb-item>
      <z-breadcrumb-item [routerLink]="['/components']">Components</z-breadcrumb-item>
      <z-breadcrumb-item>
        <span aria-current="page">Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
class TestHostComponent {}

describe('BreadcrumbComponents Integration', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all breadcrumb components', () => {
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbItemComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent))).toBeTruthy();
  });

  it('should have default classes for ZardBreadcrumbComponent', () => {
    const breadcrumDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbComponent));
    const nav = breadcrumDebug.nativeElement.querySelector('nav');
    expect(nav.classList).toContain('w-full');
    expect(nav.classList).toContain('text-sm');
  });

  it('should have default classes for breadcrumb list (ol element)', () => {
    const breadcrumbDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbComponent));
    const ol = breadcrumbDebug.nativeElement.querySelector('ol');
    expect(ol.classList).toContain('text-muted-foreground');
    expect(ol.classList).toContain('flex');
    expect(ol.classList).toContain('flex-wrap');
    expect(ol.classList).toContain('items-center');
    expect(ol.classList).toContain('gap-1.5');
    expect(ol.classList).toContain('break-words');
  });

  it('should have default classes for ZardBreadcrumbItemComponent', () => {
    const breadcrumItemDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbItemComponent));
    const li = breadcrumItemDebug.nativeElement.querySelector('li');
    expect(li.classList).toContain('inline-flex');
    expect(li.classList).toContain('items-center');
    expect(li.classList).toContain('gap-1.5');
  });

  it('should have default classes for ZardBreadcrumbEllipsisComponent', () => {
    const breadcrumDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent)).nativeElement;
    expect(breadcrumDebug.classList).toContain('flex');
  });

  it('should render projected content correctly', () => {
    const items = fixture.debugElement.queryAll(By.directive(ZardBreadcrumbItemComponent));
    const currentPage = fixture.debugElement.query(By.css('[aria-current="page"]')).nativeElement;

    expect(items[0].nativeElement.textContent.trim()).toBe('Home');
    expect(currentPage.textContent.trim()).toBe('Breadcrumb');
  });

  it('breadcrumb <nav> should have aria-label="breadcrumb"', () => {
    const nav = fixture.debugElement.query(By.css('nav')).nativeElement;
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('last breadcrumb item should have aria-current="page"', () => {
    const currentPage = fixture.debugElement.query(By.css('[aria-current="page"]'));
    expect(currentPage).toBeTruthy();
    expect(currentPage.nativeElement.textContent.trim()).toBe('Breadcrumb');
  });

  it('breadcrumb-ellipsis should contain the icon class', () => {
    const breadcrumbPageDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent));
    const span = breadcrumbPageDebug.nativeElement.querySelector('span');
    expect(span.classList).toContain('icon-ellipsis');
  });

  it('should support routerLink on breadcrumb items', () => {
    const items = fixture.debugElement.queryAll(By.directive(ZardBreadcrumbItemComponent));
    // We have 4 breadcrumb items: 2 links + 1 ellipsis container + 1 current page
    expect(items.length).toBe(4);
    // Verify items can be rendered
    expect(items[0].componentInstance).toBeTruthy();
  });

  it('should render separator between items except last one', () => {
    const separators = fixture.debugElement.queryAll(By.css('li[aria-hidden="true"][role="presentation"]'));
    // Should have 3 separators for 4 items
    expect(separators.length).toBe(3);
  });

  it('should render default chevron separator when zSeparator is not provided', () => {
    const separator = fixture.debugElement.query(By.css('li[aria-hidden="true"][role="presentation"] .icon-chevron-right'));
    expect(separator).toBeTruthy();
  });
});
