import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbListComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
  ZardBreadcrumbEllipsisComponent,
} from './breadcrumb.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [
    ZardBreadcrumbComponent,
    ZardBreadcrumbListComponent,
    ZardBreadcrumbItemComponent,
    ZardBreadcrumbLinkComponent,
    ZardBreadcrumbPageComponent,
    ZardBreadcrumbSeparatorComponent,
    ZardBreadcrumbEllipsisComponent,
  ],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list>
        <z-breadcrumb-item>
          <z-breadcrumb-link zType="underline" zLink="/">Home</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator>/</z-breadcrumb-separator>
        <z-breadcrumb-item>
          <z-breadcrumb-ellipsis />
        </z-breadcrumb-item>
        <z-breadcrumb-separator>/</z-breadcrumb-separator>
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/components">Components</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator>/</z-breadcrumb-separator>
        <z-breadcrumb-item>
          <z-breadcrumb-page>Breadcrumb</z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
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
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbListComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbItemComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbLinkComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbPageComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbSeparatorComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent))).toBeTruthy();
  });

  it('should have default classes for ZardBreadcrumbComponent', () => {
    const breadcrumDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbComponent));
    const nav = breadcrumDebug.nativeElement.querySelector('nav');
    expect(nav.classList).toContain('w-full');
    expect(nav.classList).toContain('text-sm');
  });

  it('should have default classes for ZardBreadcrumbListComponent', () => {
    const breadcrumListDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbListComponent));
    const ol = breadcrumListDebug.nativeElement.querySelector('ol');
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
    expect(li.classList).toContain('flex');
    expect(li.classList).toContain('items-center');
    expect(li.classList).toContain('gap-1.5');
    expect(li.classList).toContain('transition-colors');
  });

  it('should have default classes for ZardBreadcrumbLinkComponent', () => {
    const breadcrumLinkDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbLinkComponent));
    const link = breadcrumLinkDebug.nativeElement.querySelector('a');
    expect(link.classList).toContain('flex');
    expect(link.classList).toContain('items-center');
    expect(link.classList).toContain('gap-1');
    expect(link.classList).toContain('transition-colors');
    expect(link.classList).toContain('focus:outline-none');
    expect(link.classList).toContain('focus:ring-2');
    expect(link.classList).toContain('focus:ring-ring');
    expect(link.classList).toContain('focus:ring-offset-2');
  });

  it('should have default classes for ZardBreadcrumbPageComponent', () => {
    const breadcrumPageDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbPageComponent));
    const page = breadcrumPageDebug.nativeElement.querySelector('span');
    expect(page.classList).toContain('flex');
    expect(page.classList).toContain('items-center');
    expect(page.classList).toContain('gap-1');
    expect(page.classList).toContain('focus:outline-none');
    expect(page.classList).toContain('focus:ring-2');
    expect(page.classList).toContain('focus:ring-ring');
    expect(page.classList).toContain('focus:ring-offset-2');
  });

  it('should have default classes for ZardBreadcrumbSeparatorComponent', () => {
    const breadcrumDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbSeparatorComponent));
    const li = breadcrumDebug.nativeElement.querySelector('li');
    expect(li.classList).toContain('select-none');
  });

  it('should have default classes for ZardBreadcrumbEllipsisComponent', () => {
    const breadcrumDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent)).nativeElement;
    expect(breadcrumDebug.classList).toContain('flex');
  });

  it('should render projected content correctly', () => {
    const link = fixture.debugElement.queryAll(By.directive(ZardBreadcrumbLinkComponent))[0].nativeElement;
    const page = fixture.debugElement.query(By.directive(ZardBreadcrumbPageComponent)).nativeElement;
    const separator = fixture.debugElement.query(By.directive(ZardBreadcrumbSeparatorComponent)).nativeElement;

    expect(link.textContent.trim()).toBe('Home');
    expect(page.textContent.trim()).toBe('Breadcrumb');
    expect(separator.textContent.trim()).toBe('/');
  });

  it('breadcrumb <nav> should have aria-label="breadcrumb"', () => {
    const nav = fixture.debugElement.query(By.css('nav')).nativeElement;
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('breadcrumb-page component should have aria-current="page"', () => {
    const breadcrumbPageDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbPageComponent));
    const span = breadcrumbPageDebug.nativeElement.querySelector('span');
    expect(span.getAttribute('aria-current')).toBe('page');
  });

  it('breadcrumb-ellipsis should contain the icon class', () => {
    const breadcrumbPageDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent));
    const span = breadcrumbPageDebug.nativeElement.querySelector('span');
    expect(span.classList).toContain('icon-ellipsis');
  });

  it('should render the correct routerLink and projected content', () => {
    const debug = fixture.debugElement.query(By.directive(ZardBreadcrumbLinkComponent));
    const anchor = debug.nativeElement.querySelector('a');

    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/');
    expect(anchor.textContent.trim()).toContain('Home');
  });

  it('should render separator content correctly', () => {
    const separator = fixture.debugElement.query(By.directive(ZardBreadcrumbSeparatorComponent)).nativeElement;
    expect(separator.textContent.trim()).toBe('/');
  });

  it('should have zType set to "underline"', () => {
    const debug = fixture.debugElement.query(By.directive(ZardBreadcrumbLinkComponent));
    const instance = debug.componentInstance;
    expect(instance.zType()).toBe('underline');
  });
});
