import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';

import { ZardNavigationMenuTriggerDirective } from './navigation-menu-trigger.directive';
import { ZardNavigationMenuComponent } from './navigation-menu.component';
import { ZardNavigationMenuService } from './navigation-menu.service';

@Component({
  imports: [ZardNavigationMenuImports],
  template: `
    <z-navigation-menu [zViewport]="viewport" [zAlign]="align" [zHoverDelay]="hoverDelay">
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="first">First</button>

          <ng-template #first>
            <div z-navigation-menu-content data-testid="first-content">
              <a z-navigation-menu-link href="#">First link</a>
            </div>
          </ng-template>
        </li>
        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="second">Second</button>

          <ng-template #second>
            <div z-navigation-menu-content data-testid="second-content">
              <a z-navigation-menu-link href="#">Second link</a>
            </div>
          </ng-template>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" data-testid="bare-link">Docs</a>
        </li>
      </ul>

      <z-navigation-menu-indicator />
    </z-navigation-menu>
  `,
})
class TestComponent {
  viewport = true;
  align: 'start' | 'center' | 'end' = 'start';
  hoverDelay = 100;
}

describe('ZardNavigationMenuComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let root: HTMLElement;
  let service: ZardNavigationMenuService;
  let triggers: ZardNavigationMenuTriggerDirective[];

  beforeEach(async () => {
    // No MENU_STACK provider here on purpose — the root must be the one supplying it.
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const rootDebugElement = fixture.debugElement.query(By.directive(ZardNavigationMenuComponent));
    root = rootDebugElement.nativeElement;
    service = rootDebugElement.injector.get(ZardNavigationMenuService);
    triggers = fixture.debugElement
      .queryAll(By.directive(ZardNavigationMenuTriggerDirective))
      .map(debugElement => debugElement.injector.get(ZardNavigationMenuTriggerDirective));
  });

  /**
   * The shared viewport is portalled into a CDK overlay so clipping containers cannot cut it off,
   * which puts the active content outside the fixture.
   */
  function viewportContent(testId: string): Element | null {
    return document.querySelector(`.cdk-overlay-container [data-testid="${testId}"]`);
  }

  it('should create', () => {
    expect(root).toBeTruthy();
    expect(triggers.length).toBe(2);
  });

  it('should expose the viewport mode through data-viewport', () => {
    expect(root.getAttribute('data-viewport')).toBe('true');

    component.viewport = false;
    fixture.detectChanges();

    expect(root.getAttribute('data-viewport')).toBe('false');
  });

  it('should render the shared viewport only while zViewport is on', () => {
    expect(root.querySelector('z-navigation-menu-viewport')).not.toBeNull();

    component.viewport = false;
    fixture.detectChanges();

    expect(root.querySelector('z-navigation-menu-viewport')).toBeNull();
  });

  it('should push its inputs into the scoped service', () => {
    component.hoverDelay = 250;
    fixture.detectChanges();

    expect(service.viewport()).toBe(true);
    expect(service.hoverDelay()).toBe(250);
    expect(service.rootElement()).toBe(root);
  });

  it('should keep the CDK trigger inert in viewport mode', () => {
    expect(triggers[0]['cdkTrigger'].menuTemplateRef).toBeNull();

    component.viewport = false;
    fixture.detectChanges();

    expect(triggers[0]['cdkTrigger'].menuTemplateRef).toBe(triggers[0].zNavigationMenuTriggerFor());
  });

  it('should give each trigger a sequential index', () => {
    expect(triggers[0]['index']).toBe(0);
    expect(triggers[1]['index']).toBe(1);
  });

  it('should render the active template inside the shared viewport', () => {
    triggers[0].open();
    fixture.detectChanges();

    expect(service.isActive(0)).toBe(true);
    expect(viewportContent('first-content')).not.toBeNull();
    expect(viewportContent('second-content')).toBeNull();
  });

  it('should morph to the next trigger instead of closing', () => {
    triggers[0].open();
    fixture.detectChanges();

    triggers[1].open();
    fixture.detectChanges();

    expect(service.isOpen()).toBe(true);
    expect(service.isActive(1)).toBe(true);
    expect(viewportContent('second-content')).not.toBeNull();
  });

  it('should derive the slide direction from the trigger order', () => {
    triggers[0].open();
    fixture.detectChanges();
    expect(service.motion()).toBeNull();

    triggers[1].open();
    fixture.detectChanges();
    expect(service.motion()).toBe('from-end');

    triggers[0].open();
    fixture.detectChanges();
    expect(service.motion()).toBe('from-start');
  });

  it('should publish data-motion on the active content', () => {
    triggers[0].open();
    fixture.detectChanges();
    triggers[1].open();
    fixture.detectChanges();

    const content = viewportContent('second-content');

    expect(content?.getAttribute('data-motion')).toBe('from-end');
  });

  it('should render the built-in chevron inside a root', () => {
    const triggerElement = fixture.debugElement.query(By.directive(ZardNavigationMenuTriggerDirective)).nativeElement;
    const icon = triggerElement.querySelector('ng-icon');

    expect(icon).not.toBeNull();
    // Asserting on the svg, not just the host: an unresolved icon still renders an empty <ng-icon>.
    expect(icon?.querySelector('svg')).not.toBeNull();
    expect(icon?.className).toContain('rotate-180');
  });

  it('should support a link declared straight on an item, with no content above it', () => {
    const links = fixture.nativeElement.querySelectorAll('[z-navigation-menu-link]');

    // The link pulls in CdkMenuItem, which needs a MENU_STACK the root has to provide here.
    expect(links.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('[data-testid="bare-link"]')).not.toBeNull();
  });

  it('should mark the active trigger with data-state', () => {
    const triggerElement = fixture.debugElement.query(By.directive(ZardNavigationMenuTriggerDirective)).nativeElement;

    expect(triggerElement.getAttribute('data-state')).toBe('closed');

    triggers[0].open();
    fixture.detectChanges();

    expect(triggerElement.getAttribute('data-state')).toBe('open');
    expect(triggerElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('should close on Escape', () => {
    triggers[0].open();
    fixture.detectChanges();

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(service.isOpen()).toBe(false);
  });

  it('should schedule the close when the pointer leaves the whole bar', done => {
    component.hoverDelay = 20;
    fixture.detectChanges();

    triggers[0].open();
    fixture.detectChanges();

    root.dispatchEvent(new MouseEvent('mouseleave'));

    setTimeout(() => {
      expect(service.isOpen()).toBe(false);
      done();
    }, 40);
  });

  it('should cancel a scheduled close when the pointer comes back', done => {
    component.hoverDelay = 20;
    fixture.detectChanges();

    triggers[0].open();
    fixture.detectChanges();

    root.dispatchEvent(new MouseEvent('mouseleave'));
    root.dispatchEvent(new MouseEvent('mouseenter'));

    setTimeout(() => {
      expect(service.isOpen()).toBe(true);
      done();
    }, 40);
  });
});
