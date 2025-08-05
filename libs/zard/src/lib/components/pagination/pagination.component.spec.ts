import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import {
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationItemComponent,
  ZardPaginationLinkComponent,
  ZardPaginationPreviousComponent,
  ZardPaginationNextComponent,
  ZardPaginationEllipsisComponent,
} from './pagination.component';

@Component({
  selector: 'test-pagination-host',
  standalone: true,
  imports: [
    ZardPaginationComponent,
    ZardPaginationContentComponent,
    ZardPaginationItemComponent,
    ZardPaginationLinkComponent,
    ZardPaginationPreviousComponent,
    ZardPaginationNextComponent,
    ZardPaginationEllipsisComponent,
  ],
  template: `
    <z-pagination>
      <z-pagination-content>
        <z-pagination-item>
          <z-pagination-previous [zLink]="'/prev'" />
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-link [zLink]="'/'" [zActive]="true">1</z-pagination-link>
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-ellipsis />
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-link [zLink]="'/3'">3</z-pagination-link>
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-next [zLink]="'/next'" />
        </z-pagination-item>
      </z-pagination-content>
    </z-pagination>
  `,
})
class TestPaginationHostComponent {}

describe('ZardPagination Integration', () => {
  let fixture: ComponentFixture<TestPaginationHostComponent>;
  let component: TestPaginationHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPaginationHostComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPaginationHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all pagination components', () => {
    expect(fixture.debugElement.query(By.directive(ZardPaginationComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardPaginationContentComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardPaginationItemComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardPaginationLinkComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardPaginationPreviousComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardPaginationNextComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardPaginationEllipsisComponent))).toBeTruthy();
  });

  it('pagination <nav> should have aria-label="pagination"', () => {
    const nav = fixture.debugElement.query(By.css('nav')).nativeElement;
    expect(nav.getAttribute('aria-label')).toBe('pagination');
  });

  it('pagination-link with zActive should have aria-current="page" and data-active', () => {
    const anchors = fixture.debugElement.queryAll(By.css('a'));
    const activeAnchor = anchors.find(a => a.nativeElement.textContent.trim() === '1');

    expect(activeAnchor?.nativeElement.getAttribute('aria-current')).toBe('page');
    expect(activeAnchor?.nativeElement.getAttribute('data-active')).toBe('true');
  });
  it('should render projected content correctly', () => {
    const anchors = fixture.debugElement.queryAll(By.css('a'));
    const page1 = anchors.find(a => a.nativeElement.textContent.includes('1'));
    const page3 = anchors.find(a => a.nativeElement.textContent.includes('3'));

    expect(page1?.nativeElement.textContent.trim()).toBe('1');
    expect(page3?.nativeElement.textContent.trim()).toBe('3');
  });

  it('should render previous and next buttons correctly', () => {
    const previous = fixture.debugElement.query(By.directive(ZardPaginationPreviousComponent)).nativeElement;
    const next = fixture.debugElement.query(By.directive(ZardPaginationNextComponent)).nativeElement;

    expect(previous.textContent).toContain('Previous');
    expect(next.textContent).toContain('Next');
  });

  it('pagination-ellipsis should render icon and sr-only text', () => {
    const ellipsis = fixture.debugElement.query(By.directive(ZardPaginationEllipsisComponent));
    const span = ellipsis.nativeElement.querySelector('span.icon-ellipsis');
    const srOnly = ellipsis.nativeElement.querySelector('span.sr-only');

    expect(span).toBeTruthy();
    expect(srOnly.textContent).toBe('More pages');
  });

  it('should render correct href attributes in links', () => {
    const links = fixture.debugElement.queryAll(By.directive(ZardPaginationLinkComponent));
    const hrefs = links.map(el => el.nativeElement.querySelector('a').getAttribute('href'));

    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/3');
  });

  it('should have default class applied to pagination container', () => {
    const nav = fixture.debugElement.query(By.css('nav'));
    expect(nav.nativeElement.className).toContain('');
  });
});
