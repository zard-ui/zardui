import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardPaginationComponent } from './pagination.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardPaginationComponent],
  template: `
    <z-pagination
      [zPageIndex]="pageIndex"
      [zTotal]="totalPages"
      [zSize]="'default'"
      (zPageIndexChange)="onPageChange($event)"
      [class]="customClass"
    ></z-pagination>
  `,
})
class TestHostComponent {
  pageIndex = 1;
  totalPages = 5;
  lastEmittedPage: number | null = null;
  customClass = 'custom-pagination-class';

  onPageChange(page: number) {
    this.lastEmittedPage = page;
    this.pageIndex = page;
  }
}

describe('ZardPaginationComponent Integration (Jest)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let nativeEl: HTMLElement;

  const getButtons = (): NodeListOf<HTMLButtonElement> => nativeEl.querySelectorAll('z-pagination-button > button');

  const getPrevButton = (): HTMLButtonElement | null => getButtons()[0] ?? null;

  const getNextButton = (): HTMLButtonElement | null => {
    const buttons = getButtons();
    return buttons[buttons.length - 1] ?? null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render the correct number of page buttons (including prev and next)', () => {
    const pageButtons = nativeEl.querySelectorAll('z-pagination-button');
    // prev + next + page buttons
    expect(pageButtons.length).toBe(hostComponent.totalPages + 2);
  });

  it('should highlight the current page using aria-current', () => {
    const activeButton = Array.from(getButtons()).find(btn => btn.getAttribute('aria-current') === 'page');

    expect(activeButton).toBeTruthy();
    expect(activeButton!.textContent?.trim()).toBe(hostComponent.pageIndex.toString());
  });

  it('should emit zPageIndexChange when clicking a different page button', () => {
    const page3Button = Array.from(getButtons()).find(btn => btn.textContent?.trim() === '3');
    expect(page3Button).toBeTruthy();

    page3Button!.click();
    fixture.detectChanges();

    expect(hostComponent.lastEmittedPage).toBe(3);
    expect(hostComponent.pageIndex).toBe(3);
  });

  it('should not emit zPageIndexChange when clicking the active page button', () => {
    const activeButton = Array.from(getButtons()).find(btn => btn.getAttribute('aria-current') === 'page');
    expect(activeButton).toBeTruthy();

    hostComponent.lastEmittedPage = null;
    activeButton!.click();
    fixture.detectChanges();

    expect(hostComponent.lastEmittedPage).toBeNull();
  });

  describe('Previous button behavior', () => {
    it('should disable "Previous" button on first page and not emit', () => {
      const prevBtn = getPrevButton();
      expect(prevBtn).toBeTruthy();
      expect(prevBtn!.getAttribute('aria-disabled')).toBe('true');

      hostComponent.lastEmittedPage = null;
      prevBtn!.click();
      fixture.detectChanges();

      expect(hostComponent.lastEmittedPage).toBeNull();
    });

    it('should enable "Previous" button on page > 1 and emit page change', () => {
      hostComponent.pageIndex = 2;
      fixture.detectChanges();

      const prevBtn = getPrevButton();
      expect(prevBtn).toBeTruthy();
      expect(prevBtn!.getAttribute('aria-disabled')).toBeNull();

      hostComponent.lastEmittedPage = null;
      prevBtn!.click();
      fixture.detectChanges();

      expect(hostComponent.lastEmittedPage).toBe(1);
    });
  });

  describe('Next button behavior', () => {
    it('should disable "Next" button on last page and not emit', () => {
      hostComponent.pageIndex = hostComponent.totalPages;
      fixture.detectChanges();

      const nextBtn = getNextButton();
      expect(nextBtn).toBeTruthy();
      expect(nextBtn!.getAttribute('aria-disabled')).toBe('true');

      hostComponent.lastEmittedPage = null;
      nextBtn!.click();
      fixture.detectChanges();

      expect(hostComponent.lastEmittedPage).toBeNull();
    });

    it('should enable "Next" button on page < total and emit page change', () => {
      hostComponent.pageIndex = hostComponent.totalPages - 1;
      fixture.detectChanges();

      const nextBtn = getNextButton();
      expect(nextBtn).toBeTruthy();
      expect(nextBtn!.getAttribute('aria-disabled')).toBeNull();

      hostComponent.lastEmittedPage = null;
      nextBtn!.click();
      fixture.detectChanges();

      expect(hostComponent.lastEmittedPage).toBe(hostComponent.totalPages);
    });
  });

  it('should apply custom class to pagination root element', () => {
    const paginationHost = nativeEl.querySelector('z-pagination');

    expect(paginationHost).toBeTruthy();
    expect(paginationHost!.classList).toContain(hostComponent.customClass);
  });
});
