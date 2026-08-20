import { Component, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardSidebarComponent, ZardSidebarGroupComponent, ZardSidebarGroupLabelComponent } from './sidebar.component';

describe('ZardSidebarComponent', () => {
  let component: ZardSidebarComponent;
  let fixture: ComponentFixture<ZardSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSidebarComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render aside element', () => {
    const asideElement = fixture.debugElement.query(By.css('aside'));
    expect(asideElement).toBeTruthy();
  });

  it('should apply default sidebar classes', () => {
    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.classList.contains('flex')).toBeTruthy();
    expect(asideElement.classList.contains('flex-col')).toBeTruthy();
  });

  it('should apply default width of 200px', () => {
    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.style.width).toBe('200px');
  });

  it('should apply custom numeric width', () => {
    fixture.componentRef.setInput('zWidth', 250);
    fixture.detectChanges();

    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.style.width).toBe('250px');
  });

  it('should apply custom string width', () => {
    fixture.componentRef.setInput('zWidth', '300');
    fixture.detectChanges();

    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.style.width).toBe('300px');
  });

  it('should apply collapsed width when collapsed', () => {
    fixture.componentRef.setInput('zCollapsed', true);
    fixture.detectChanges();

    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.style.width).toBe('64px');
  });

  it('should apply custom collapsed width', () => {
    fixture.componentRef.setInput('zCollapsed', true);
    fixture.componentRef.setInput('zCollapsedWidth', 80);
    fixture.detectChanges();

    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.style.width).toBe('80px');
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.classList.contains('custom-class')).toBeTruthy();
  });

  it('should set data-collapsed attribute when collapsed', () => {
    fixture.componentRef.setInput('zCollapsed', true);
    fixture.detectChanges();

    const asideElement = fixture.nativeElement.querySelector('aside');
    expect(asideElement.getAttribute('data-collapsed')).toBe('true');
  });

  it('should not render trigger by default', () => {
    const triggerElement = fixture.debugElement.query(By.css('[role="button"]'));
    expect(triggerElement).toBeFalsy();
  });

  it('should render default trigger when collapsible is true', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.detectChanges();

    const triggerElement = fixture.debugElement.query(By.css('[role="button"]'));
    expect(triggerElement).toBeTruthy();
  });

  it('should display correct chevron icon when not collapsed', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('ng-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.componentInstance.name()).toBe('lucideChevronLeft');
  });

  it('should display correct chevron icon when collapsed', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.componentRef.setInput('zCollapsed', true);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('ng-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.componentInstance.name()).toBe('lucideChevronRight');
  });

  it('should reverse chevron icon when zReverseArrow is true', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.componentRef.setInput('zReverseArrow', true);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('ng-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.componentInstance.name()).toBe('lucideChevronRight');
  });

  it('should emit zCollapsedChange when toggle is clicked', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.detectChanges();

    let emittedValue: boolean | undefined;
    component.zCollapsedChange.subscribe((value: boolean) => {
      emittedValue = value;
    });

    const triggerElement = fixture.debugElement.query(By.css('[role="button"]')).nativeElement;
    triggerElement.click();

    expect(emittedValue).toBe(true);
  });

  it('should toggle on Enter key', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.detectChanges();

    let emittedValue: boolean | undefined;
    component.zCollapsedChange.subscribe((value: boolean) => {
      emittedValue = value;
    });

    const triggerElement = fixture.debugElement.query(By.css('[role="button"]')).nativeElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    triggerElement.dispatchEvent(event);

    expect(emittedValue).toBe(true);
  });

  it('should toggle on Space key', () => {
    fixture.componentRef.setInput('zCollapsible', true);
    fixture.detectChanges();

    let emittedValue: boolean | undefined;
    component.zCollapsedChange.subscribe((value: boolean) => {
      emittedValue = value;
    });

    const triggerElement = fixture.debugElement.query(By.css('[role="button"]')).nativeElement;
    const event = new KeyboardEvent('keydown', { key: ' ' });
    triggerElement.dispatchEvent(event);

    expect(emittedValue).toBe(true);
  });

  it('should use custom trigger template when provided', () => {
    @Component({
      imports: [ZardSidebarComponent],
      template: `
        <z-sidebar [zCollapsible]="true" [zTrigger]="customTrigger">
          <ng-template #customTrigger>
            <button type="button" id="custom-trigger">Custom Trigger</button>
          </ng-template>
        </z-sidebar>
      `,
    })
    class TestHostComponent {
      readonly customTrigger = viewChild.required<TemplateRef<void>>('customTrigger');
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const customTriggerElement = hostFixture.debugElement.query(By.css('#custom-trigger'));
    expect(customTriggerElement).toBeTruthy();
    expect(customTriggerElement.nativeElement.textContent).toContain('Custom Trigger');
  });

  it('should render ng-content', () => {
    @Component({
      imports: [ZardSidebarComponent],
      template: `
        <z-sidebar>Test Sidebar Content</z-sidebar>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const contentWrapper = hostFixture.debugElement.query(By.css('.flex-1.overflow-auto'));
    expect(contentWrapper.nativeElement.textContent).toContain('Test Sidebar Content');
  });
});

describe('ZardSidebarGroupComponent', () => {
  let component: ZardSidebarGroupComponent;
  let fixture: ComponentFixture<ZardSidebarGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSidebarGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSidebarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-group-class');
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.classList.contains('custom-group-class')).toBeTruthy();
  });

  it('should render ng-content', () => {
    @Component({
      imports: [ZardSidebarGroupComponent],
      template: `
        <z-sidebar-group>Group Content</z-sidebar-group>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const divElement = hostFixture.debugElement.query(By.css('div'));
    expect(divElement.nativeElement.textContent).toContain('Group Content');
  });
});

describe('ZardSidebarGroupLabelComponent', () => {
  let component: ZardSidebarGroupLabelComponent;
  let fixture: ComponentFixture<ZardSidebarGroupLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSidebarGroupLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSidebarGroupLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-label-class');
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(divElement.classList.contains('custom-label-class')).toBeTruthy();
  });

  it('should render ng-content', () => {
    @Component({
      imports: [ZardSidebarGroupLabelComponent],
      template: `
        <z-sidebar-group-label>Label Text</z-sidebar-group-label>
      `,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const divElement = hostFixture.debugElement.query(By.css('div'));
    expect(divElement.nativeElement.textContent).toContain('Label Text');
  });
});
