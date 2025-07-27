import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { ZardTooltipDirective, ZardTooltipModule } from './tooltip';

@Component({
  template: `
    <div #hoverTooltip zTooltip="Test Hover"></div>
    <div #clickTooltip zTooltip="Test Click" zTrigger="click"></div>

    <div #topTooltip zTooltip="Test Click"></div>
    <div #bottomTooltip zTooltip="Test Click" zPosition="bottom"></div>
    <div #leftTooltip zTooltip="Test Click" zPosition="left"></div>
    <div #rightTooltip zTooltip="Test Click" zPosition="right"></div>
  `,
  imports: [ZardTooltipModule],
  standalone: true,
})
class TestHostComponent {
  @ViewChild('hoverTooltip', { static: false }) hoverTooltip!: ElementRef;
  @ViewChild('hoverTooltip', { static: false, read: ZardTooltipDirective }) hoverTooltipDirective!: ZardTooltipDirective;

  @ViewChild('clickTooltip', { static: false }) clickTooltip!: ElementRef;
  @ViewChild('clickTooltip', { static: false, read: ZardTooltipDirective }) clickTooltipDirective!: ZardTooltipDirective;

  @ViewChild('topTooltip', { static: false }) topTooltip!: ElementRef;
  @ViewChild('bottomTooltip', { static: false }) bottomTooltip!: ElementRef;
  @ViewChild('leftTooltip', { static: false }) leftTooltip!: ElementRef;
  @ViewChild('rightTooltip', { static: false }) rightTooltip!: ElementRef;

  @ViewChild('topTooltip', { static: false, read: ZardTooltipDirective }) topTooltipDirective!: ZardTooltipDirective;
  @ViewChild('bottomTooltip', { static: false, read: ZardTooltipDirective }) bottomTooltipDirective!: ZardTooltipDirective;
  @ViewChild('leftTooltip', { static: false, read: ZardTooltipDirective }) leftTooltipDirective!: ZardTooltipDirective;
  @ViewChild('rightTooltip', { static: false, read: ZardTooltipDirective }) rightTooltipDirective!: ZardTooltipDirective;
}

describe('ZardTooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function waitingForTooltipToggling(): void {
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
  }

  describe('visibility', () => {
    it('should show and hide the tooltip on hover', fakeAsync(() => {
      const tooltipTitle = 'Test Hover';
      const triggerElement = component.hoverTooltip.nativeElement;

      triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(tooltipTitle);

      const overlayElement = component.hoverTooltipDirective.nativeElement;
      overlayElement.dispatchEvent(new MouseEvent('mouseleave'));
      waitingForTooltipToggling();

      expect(overlayContainerElement.textContent).not.toContain(tooltipTitle);
    }));

    it('should show and hide the tooltip on click', fakeAsync(() => {
      const tooltipTitle = 'Test Click';
      const triggerElement = component.clickTooltip.nativeElement;

      triggerElement.dispatchEvent(new MouseEvent('click'));
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(tooltipTitle);

      document.body.click();
      waitingForTooltipToggling();

      expect(overlayContainerElement.textContent).not.toContain(tooltipTitle);
    }));
  });

  describe('position', () => {
    it('should show the tooltip on top', fakeAsync(() => {
      const triggerElement = component.topTooltip.nativeElement;

      triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
      waitingForTooltipToggling();

      const overlayElement = component.topTooltipDirective.overlayElement;
      expect(overlayElement.getAttribute('data-side')).toBe('top');
    }));

    it('should show the tooltip on bottom', fakeAsync(() => {
      const triggerElement = component.bottomTooltip.nativeElement;

      triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
      waitingForTooltipToggling();

      const overlayElement = component.bottomTooltipDirective.overlayElement;
      expect(overlayElement.getAttribute('data-side')).toBe('bottom');
    }));

    it('should show the tooltip on left', fakeAsync(() => {
      const triggerElement = component.leftTooltip.nativeElement;

      triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
      waitingForTooltipToggling();

      const overlayElement = component.leftTooltipDirective.overlayElement;
      expect(overlayElement.getAttribute('data-side')).toBe('left');
    }));

    it('should show the tooltip on right', fakeAsync(() => {
      const triggerElement = component.rightTooltip.nativeElement;

      triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
      waitingForTooltipToggling();

      const overlayElement = component.rightTooltipDirective.overlayElement;
      expect(overlayElement.getAttribute('data-side')).toBe('right');
    }));
  });

  describe('events', () => {
    it('should emit zOnShow and zOnHide events', fakeAsync(() => {
      const triggerElement = component.hoverTooltip.nativeElement;
      const spyOnShow = jest.spyOn(component.hoverTooltipDirective.zOnShow, 'emit');
      const spyOnHide = jest.spyOn(component.hoverTooltipDirective.zOnHide, 'emit');

      triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
      waitingForTooltipToggling();

      expect(spyOnShow).toHaveBeenCalled();

      const overlayElement = component.hoverTooltipDirective.nativeElement;
      overlayElement.dispatchEvent(new MouseEvent('mouseleave'));
      waitingForTooltipToggling();

      expect(spyOnHide).toHaveBeenCalled();
    }));
  });
});
