import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import userEvent from '@testing-library/user-event';

import { ZardSelectItemComponent } from './select-item.component';

describe('ZardSelectItemComponent', () => {
  let fixture: ComponentFixture<ZardSelectItemComponent>;
  let component: ZardSelectItemComponent;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSelectItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSelectItemComponent);
    component = fixture.componentInstance;
    user = userEvent.setup();
    fixture.componentRef.setInput('zValue', 'test-value');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has correct role and tabindex', () => {
    const hostElement = fixture.nativeElement as HTMLElement;

    expect(hostElement).toHaveAttribute('role', 'option');
    expect(hostElement).toHaveAttribute('tabindex', '-1');
  });

  describe('zValue input', () => {
    it('updates attribute when value changes', () => {
      fixture.componentRef.setInput('zValue', 'new-value');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('value', 'new-value');
    });
  });

  describe('zDisabled input', () => {
    it('sets data-disabled when disabled', () => {
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-disabled', '');
      expect(hostElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('removes data-disabled when enabled', () => {
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).not.toHaveAttribute('data-disabled');
    });
  });

  describe('custom class input', () => {
    it('applies custom class to host element', () => {
      fixture.componentRef.setInput('class', 'custom-class');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('custom-class');
    });
  });

  describe('variant styling', () => {
    it('applies correct classes for default size', () => {
      component.zSize.set('default');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('py-1.5');
      expect(hostElement).toHaveClass('text-sm');
      expect(hostElement).not.toHaveClass('min-h-9');
    });

    it('applies correct classes for small size', () => {
      component.zSize.set('sm');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('py-1');
      expect(hostElement).toHaveClass('text-xs');
      expect(hostElement).not.toHaveClass('min-h-8');
    });

    it('applies correct classes for large size', () => {
      component.zSize.set('lg');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('py-2');
      expect(hostElement).toHaveClass('text-base');
      expect(hostElement).not.toHaveClass('min-h-10');
    });

    it('uses the shadcn select item structure', () => {
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('w-full');
      expect(hostElement).toHaveClass('cursor-default');
      expect(hostElement).not.toHaveClass('mb-0.5');
      expect(hostElement).not.toHaveClass('text-nowrap');
      expect(hostElement.className).toContain('focus:bg-accent');
      expect(hostElement.className).toContain('focus:text-accent-foreground');
      expect(hostElement.className).not.toContain('hover:bg-accent');
    });

    it('applies correct classes for normal mode', () => {
      component.zMode.set('normal');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('pr-8');
      expect(hostElement).toHaveClass('pl-2');
    });

    it('applies correct classes for compact mode', () => {
      component.zMode.set('compact');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('pr-8');
      expect(hostElement).toHaveClass('pl-2');
      expect(hostElement).not.toHaveClass('pl-6.5');
    });
  });

  describe('selected state attributes', () => {
    it('sets data-selected when in selected values', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-selected', '');
    });

    it('does not style the selected state as the highlighted state', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-selected', '');
      expect(hostElement.className).toContain('data-highlighted:bg-accent');
      expect(hostElement.className).not.toContain('data-selected:bg-accent');
      expect(hostElement.className).not.toContain('data-selected:text-accent-foreground');
    });

    it('renders the shadcn indicator slot before text while positioning it on the trailing side', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      const text = hostElement.querySelector('[data-slot="select-item-text"]') as HTMLElement;
      const indicator = hostElement.querySelector('[data-slot="select-item-indicator"]') as HTMLElement;
      expect(text).toBeTruthy();
      expect(indicator).toBeTruthy();
      expect(indicator.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(indicator).toHaveClass('right-2');
      expect(indicator.className).not.toContain('left-2');
    });

    it('keeps the selected indicator color aligned with the item text', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      const indicator = hostElement.querySelector('[data-slot="select-item-indicator"]') as HTMLElement;
      const icon = hostElement.querySelector('[data-testid="check-icon"]') as HTMLElement;
      expect(indicator).toBeTruthy();
      expect(icon).toHaveClass('text-current');
      expect(hostElement.className).toContain('[&_svg:not([class*="text-"])]:text-muted-foreground');
    });

    it('sets aria-selected true when selected', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected false when not selected', () => {
      component.setSelectHost({
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('select host integration', () => {
    const createMockSelectHost = () => ({
      selectedValue: () => [] as string[],
      selectItem: jest.fn(),
      navigateTo: jest.fn(),
    });

    it('stores select host reference when set', () => {
      const mockSelectHost = createMockSelectHost();

      component.setSelectHost(mockSelectHost);

      expect(component['select']()).toBe(mockSelectHost);
    });

    it('triggers selectItem on click when not disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      await user.click(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.selectItem).toHaveBeenCalledWith('test-value', '');
    });

    it('skips selectItem when disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      await user.click(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.selectItem).not.toHaveBeenCalled();
    });

    it('triggers navigateTo on hover when not disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      await user.hover(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.navigateTo).toHaveBeenCalled();
    });

    it('skips navigateTo on hover when disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      await user.hover(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.navigateTo).not.toHaveBeenCalled();
    });
  });

  describe('check icon visibility', () => {
    it('displays check icon when selected', async () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[data-testid="check-icon"]'));
      expect(iconElement).toBeTruthy();
    });

    it('hides check icon when not selected', async () => {
      component.setSelectHost({
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[data-testid="check-icon"]'));
      expect(iconElement).toBeFalsy();
    });
  });
});
