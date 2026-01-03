import { type ComponentRef } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardScrollToTopComponent } from './scroll-to-top.component';

// Mock window.scrollTo for test environment
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

describe('ZardScrollToTopComponent', () => {
  let component: ZardScrollToTopComponent;
  let fixture: ComponentFixture<ZardScrollToTopComponent>;
  let componentRef: ComponentRef<ZardScrollToTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardScrollToTopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardScrollToTopComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden initially', () => {
    expect(component.visible()).toBe(false);
  });

  it('should show when scrollY > 200', async () => {
    Object.defineProperty(window, 'scrollY', { value: 300, configurable: true });
    // Wait for setTimeout in constructor
    await new Promise(resolve => setTimeout(resolve, 10));
    component['onScroll']();
    expect(component.visible()).toBe(true);
  });

  it('should hide when scrollY <= 200', async () => {
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    // Wait for setTimeout in constructor
    await new Promise(resolve => setTimeout(resolve, 10));
    component['onScroll']();
    expect(component.visible()).toBe(false);
  });

  it('should call window.scrollTo on click when target is window', () => {
    component.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should apply default variant classes', () => {
    const classes = component['classes']();
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
  });

  it('should apply outline variant classes', () => {
    componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    const classes = component['classes']();
    expect(classes).toContain('border');
    expect(classes).toContain('bg-background');
  });

  it('should apply subtle variant classes', () => {
    componentRef.setInput('variant', 'subtle');
    fixture.detectChanges();
    const classes = component['classes']();
    expect(classes).toContain('bg-muted');
    expect(classes).toContain('text-muted-foreground');
  });

  it('should apply small size classes', () => {
    componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const classes = component['classes']();
    expect(classes).toContain('h-8');
    expect(classes).toContain('w-8');
  });

  it('should apply large size classes', () => {
    componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const classes = component['classes']();
    expect(classes).toContain('h-12');
    expect(classes).toContain('w-12');
  });

  it('should apply custom classes', () => {
    componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();
    const classes = component['classes']();
    expect(classes).toContain('custom-class');
  });

  it('should apply correct icon size for small button', () => {
    componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const iconClasses = component['iconClasses']();
    expect(iconClasses).toContain('h-4');
    expect(iconClasses).toContain('w-4');
  });

  it('should apply correct icon size for large button', () => {
    componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const iconClasses = component['iconClasses']();
    expect(iconClasses).toContain('h-6');
    expect(iconClasses).toContain('w-6');
  });

  it('should cleanup event listener on destroy', async () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    // Wait for setTimeout in constructor to attach listener
    await new Promise(resolve => setTimeout(resolve, 10));
    component.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
