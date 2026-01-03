import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardScrollToTopComponent } from './scroll-to-top.component';

// Mock window.scrollTo for test environment
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

describe('ZardScrollToTopComponent', () => {
  let component: ZardScrollToTopComponent;
  let fixture: ComponentFixture<ZardScrollToTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardScrollToTopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardScrollToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden initially', () => {
    expect(component.visible()).toBe(false);
  });

  it('should show when scrollY > 200', () => {
    Object.defineProperty(window, 'scrollY', { value: 300, configurable: true });
    component['onScroll']();
    expect(component.visible()).toBe(true);
  });

  it('should call window.scrollTo on click', () => {
    component.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
