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
    it('updates attribute when value changes', async () => {
      fixture.componentRef.setInput('zValue', 'new-value');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('value', 'new-value');
    });
  });

  describe('zDisabled input', () => {
    it('sets data-disabled when disabled', async () => {
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-disabled', '');
    });

    it('removes data-disabled when enabled', async () => {
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).not.toHaveAttribute('data-disabled');
    });
  });

  describe('custom class input', () => {
    it('applies custom class to host element', async () => {
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
      expect(hostElement).toHaveClass('min-h-9');
      expect(hostElement).toHaveClass('py-1.5');
    });

    it('applies correct classes for small size', () => {
      component.zSize.set('sm');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('min-h-8');
      expect(hostElement).toHaveClass('py-1');
    });

    it('applies correct classes for large size', () => {
      component.zSize.set('lg');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('min-h-10');
      expect(hostElement).toHaveClass('py-2');
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
      expect(hostElement).toHaveClass('pl-6.5');
      expect(hostElement).toHaveClass('pr-2');
    });
  });

  describe('selected state attributes', () => {
    it('sets data-selected when in selected values', async () => {
      (component as any).select.set({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-selected', '');
    });

    it('sets aria-selected true when selected', async () => {
      (component as any).select.set({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected false when not selected', async () => {
      (component as any).select.set({
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
    it('stores select host reference when set', () => {
      const mockSelectHost = {
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      };

      component.setSelectHost(mockSelectHost);

      expect(component['select']()).toBe(mockSelectHost);
    });

    it('triggers selectItem on click when not disabled', async () => {
      const mockSelectHost = {
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      };
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      await user.click(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.selectItem).toHaveBeenCalledWith('test-value', '');
    });

    it('skips selectItem when disabled', async () => {
      const mockSelectHost = {
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      };
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      await user.click(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.selectItem).not.toHaveBeenCalled();
    });

    it('triggers navigateTo on hover when not disabled', async () => {
      const mockSelectHost = {
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      };
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      await user.hover(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.navigateTo).toHaveBeenCalled();
    });

    it('skips navigateTo on hover when disabled', async () => {
      const mockSelectHost = {
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      };
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      await user.hover(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.navigateTo).not.toHaveBeenCalled();
    });
  });

  describe('check icon visibility', () => {
    it('displays check icon when selected', async () => {
      (component as any).select.set({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[aria-hidden="true"]'));
      expect(iconElement).toBeTruthy();
    });

    it('hides check icon when not selected', async () => {
      (component as any).select.set({
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[aria-hidden="true"]'));
      expect(iconElement).toBeFalsy();
    });
  });
});
