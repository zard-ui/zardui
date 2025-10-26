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

  it('breadcrumb-ellipsis should contain z-icon component', () => {
    const breadcrumbPageDebug = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent));
    const iconElement = breadcrumbPageDebug.query(By.css('z-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.componentInstance.zType()).toBe('ellipsis');
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

describe('BreadcrumbComponent - Custom Separator', () => {
  @Component({
    selector: 'test-separator-component',
    standalone: true,
    imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent],
    template: `
      <z-breadcrumb [zSeparator]="separator">
        <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
        <z-breadcrumb-item [routerLink]="['/docs']">Docs</z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>

      <ng-template #customTemplate>
        <span class="custom-separator">→</span>
      </ng-template>
    `,
  })
  class TestSeparatorComponent {
    @ViewChild('customTemplate', { static: true }) customTemplate!: TemplateRef<void>;
    separator: string | TemplateRef<void> | null = null;
  }

  let fixture: ComponentFixture<TestSeparatorComponent>;
  let component: TestSeparatorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSeparatorComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSeparatorComponent);
    component = fixture.componentInstance;
  });

  it('should render string separator when zSeparator is a string', () => {
    component.separator = '/';
    fixture.detectChanges();

    const separators = fixture.debugElement.queryAll(By.css('li[aria-hidden="true"][role="presentation"]'));
    expect(separators.length).toBe(2); // 3 items = 2 separators
    expect(separators[0].nativeElement.textContent.trim()).toBe('/');
  });

  it('should render template separator when zSeparator is a TemplateRef', () => {
    component.separator = component.customTemplate;
    fixture.detectChanges();

    const separators = fixture.debugElement.queryAll(By.css('li[aria-hidden="true"][role="presentation"] .custom-separator'));
    expect(separators.length).toBe(2); // 3 items = 2 separators
    expect(separators[0].nativeElement.textContent.trim()).toBe('→');
  });

  it('should render default chevron when zSeparator is null', () => {
    component.separator = null;
    fixture.detectChanges();

    const chevrons = fixture.debugElement.queryAll(By.css('li[aria-hidden="true"][role="presentation"] .icon-chevron-right'));
    expect(chevrons.length).toBe(2); // 3 items = 2 separators
  });

  it('should update separator dynamically when input changes', () => {
    component.separator = '/';
    fixture.detectChanges();

    let separatorText = fixture.debugElement.query(By.css('li[aria-hidden="true"][role="presentation"]')).nativeElement.textContent.trim();
    expect(separatorText).toBe('/');

    component.separator = '>';
    fixture.detectChanges();

    separatorText = fixture.debugElement.query(By.css('li[aria-hidden="true"][role="presentation"]')).nativeElement.textContent.trim();
    expect(separatorText).toBe('>');
  });
});

describe('BreadcrumbComponent - Alignment and Wrapping', () => {
  @Component({
    selector: 'test-alignment-component',
    standalone: true,
    imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent],
    template: `
      <z-breadcrumb [zAlign]="align" [zWrap]="wrap">
        <z-breadcrumb-item>Home</z-breadcrumb-item>
        <z-breadcrumb-item>Docs</z-breadcrumb-item>
      </z-breadcrumb>
    `,
  })
  class TestAlignmentComponent {
    align: 'start' | 'center' | 'end' = 'start';
    wrap: 'wrap' | 'nowrap' = 'wrap';
  }

  let fixture: ComponentFixture<TestAlignmentComponent>;
  let component: TestAlignmentComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAlignmentComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAlignmentComponent);
    component = fixture.componentInstance;
  });

  it('should apply default alignment (start) to breadcrumb list', () => {
    fixture.detectChanges();
    const ol = fixture.debugElement.query(By.css('ol')).nativeElement;
    expect(ol.classList).toContain('justify-start');
  });

  it('should apply center alignment when zAlign is center', () => {
    component.align = 'center';
    fixture.detectChanges();

    const ol = fixture.debugElement.query(By.css('ol')).nativeElement;
    expect(ol.classList).toContain('justify-center');
  });

  it('should apply end alignment when zAlign is end', () => {
    component.align = 'end';
    fixture.detectChanges();

    const ol = fixture.debugElement.query(By.css('ol')).nativeElement;
    expect(ol.classList).toContain('justify-end');
  });

  it('should apply default wrap behavior to breadcrumb list', () => {
    fixture.detectChanges();
    const ol = fixture.debugElement.query(By.css('ol')).nativeElement;
    expect(ol.classList).toContain('flex-wrap');
  });

  it('should apply nowrap when zWrap is nowrap', () => {
    component.wrap = 'nowrap';
    fixture.detectChanges();

    const ol = fixture.debugElement.query(By.css('ol')).nativeElement;
    expect(ol.classList).toContain('flex-nowrap');
  });
});

describe('BreadcrumbComponent - Size Variants', () => {
  @Component({
    selector: 'test-size-component',
    standalone: true,
    imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent],
    template: `
      <z-breadcrumb [zSize]="size">
        <z-breadcrumb-item>Home</z-breadcrumb-item>
      </z-breadcrumb>
    `,
  })
  class TestSizeComponent {
    size: 'sm' | 'md' | 'lg' = 'md';
  }

  let fixture: ComponentFixture<TestSizeComponent>;
  let component: TestSizeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSizeComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSizeComponent);
    component = fixture.componentInstance;
  });

  it('should apply small size class when zSize is sm', () => {
    component.size = 'sm';
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav')).nativeElement;
    expect(nav.classList).toContain('text-xs');
  });

  it('should apply medium size class when zSize is md', () => {
    component.size = 'md';
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav')).nativeElement;
    expect(nav.classList).toContain('text-sm');
  });

  it('should apply large size class when zSize is lg', () => {
    component.size = 'lg';
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav')).nativeElement;
    expect(nav.classList).toContain('text-base');
  });
});

describe('BreadcrumbEllipsisComponent - Color Variants', () => {
  @Component({
    selector: 'test-ellipsis-component',
    standalone: true,
    imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent],
    template: `
      <z-breadcrumb>
        <z-breadcrumb-item>Home</z-breadcrumb-item>
        <z-breadcrumb-item>
          <z-breadcrumb-ellipsis [zColor]="color" />
        </z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `,
  })
  class TestEllipsisComponent {
    color: 'muted' | 'strong' = 'muted';
  }

  let fixture: ComponentFixture<TestEllipsisComponent>;
  let component: TestEllipsisComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEllipsisComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestEllipsisComponent);
    component = fixture.componentInstance;
  });

  it('should apply default color (muted) to ellipsis', () => {
    fixture.detectChanges();
    const ellipsis = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent)).nativeElement;
    expect(ellipsis.classList).toContain('text-muted-foreground');
  });

  it('should apply strong color when zColor is strong', () => {
    component.color = 'strong';
    fixture.detectChanges();

    const ellipsis = fixture.debugElement.query(By.directive(ZardBreadcrumbEllipsisComponent)).nativeElement;
    expect(ellipsis.classList).toContain('text-foreground');
  });
});
