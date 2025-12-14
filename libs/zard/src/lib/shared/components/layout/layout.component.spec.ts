import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default vertical direction when no sidebar is present', () => {
    const element = fixture.nativeElement;
    expect(element.classList.contains('flex-col')).toBeTruthy();
  });

  it('should auto-detect horizontal direction when sidebar is present', async () => {
    @Component({
      imports: [LayoutComponent, SidebarComponent],
      standalone: true,
      template: `
        <z-layout>
          <z-sidebar />
        </z-layout>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const layoutElement = hostFixture.nativeElement.querySelector('z-layout');
    expect(layoutElement.classList.contains('flex-row')).toBeTruthy();
  });

  it('should respect explicit zDirection input', () => {
    fixture.componentRef.setInput('zDirection', 'vertical');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.classList.contains('flex-col')).toBeTruthy();
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.classList.contains('custom-class')).toBeTruthy();
  });

  it('should render ng-content', () => {
    @Component({
      imports: [LayoutComponent],
      standalone: true,
      template: `
        <z-layout>Test Content</z-layout>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const layoutElement = hostFixture.nativeElement.querySelector('z-layout');
    expect(layoutElement.textContent).toContain('Test Content');
  });
});
