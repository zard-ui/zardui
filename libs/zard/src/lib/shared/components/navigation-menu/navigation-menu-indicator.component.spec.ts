import { Component, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardNavigationMenuIndicatorComponent } from './navigation-menu-indicator.component';
import { ZardNavigationMenuService } from './navigation-menu.service';

@Component({
  imports: [ZardNavigationMenuIndicatorComponent],
  template: `
    <div class="relative">
      <button #trigger type="button">Trigger</button>
      <z-navigation-menu-indicator />
    </div>

    <ng-template #content />
  `,
  providers: [ZardNavigationMenuService],
})
class TestComponent {
  readonly content = viewChild.required<TemplateRef<void>>('content');
}

describe('ZardNavigationMenuIndicatorComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let indicator: HTMLElement;
  let service: ZardNavigationMenuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const debugElement = fixture.debugElement.query(By.directive(ZardNavigationMenuIndicatorComponent));
    indicator = debugElement.nativeElement;
    service = debugElement.injector.get(ZardNavigationMenuService);
  });

  it('should create hidden and out of the accessibility tree', () => {
    expect(indicator).toBeTruthy();
    expect(indicator.getAttribute('data-state')).toBe('hidden');
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the rotated arrow', () => {
    expect(indicator.querySelector('.rotate-45')).not.toBeNull();
  });

  it('should become visible once a trigger owns the viewport', () => {
    service.open({
      index: 0,
      template: component.content(),
      element: fixture.nativeElement.querySelector('button'),
    });
    fixture.detectChanges();

    expect(indicator.getAttribute('data-state')).toBe('visible');
    expect(indicator.style.opacity).toBe('1');
  });

  it('should hide again when the viewport closes', () => {
    service.open({
      index: 0,
      template: component.content(),
      element: fixture.nativeElement.querySelector('button'),
    });
    fixture.detectChanges();

    service.close();
    fixture.detectChanges();

    expect(indicator.getAttribute('data-state')).toBe('hidden');
    expect(indicator.style.opacity).toBe('0');
  });
});
