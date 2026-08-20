import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { toast } from 'ngx-sonner';

import { ZardSonnerComponent } from './sonner.component';

describe('ZardSonnerComponent', () => {
  let fixture: ComponentFixture<ZardSonnerComponent>;
  let host: HTMLElement;
  let showPopover: jest.Mock;
  let hidePopover: jest.Mock;

  const openedPopovers: Element[] = [];

  beforeAll(() => {
    // happy-dom does not implement the Popover API, so the top layer is
    // simulated by tracking the promotion order of the popovers.
    showPopover = jest.fn(function (this: Element) {
      if (openedPopovers.includes(this)) {
        throw new Error('InvalidStateError');
      }
      openedPopovers.push(this);
    });
    hidePopover = jest.fn(function (this: Element) {
      const index = openedPopovers.indexOf(this);
      if (index === -1) {
        throw new Error('InvalidStateError');
      }
      openedPopovers.splice(index, 1);
    });

    HTMLElement.prototype.showPopover = showPopover as unknown as HTMLElement['showPopover'];
    HTMLElement.prototype.hidePopover = hidePopover as unknown as HTMLElement['hidePopover'];
  });

  beforeEach(async () => {
    openedPopovers.length = 0;
    showPopover.mockClear();
    hidePopover.mockClear();
    toast.dismiss();

    await TestBed.configureTestingModule({ imports: [ZardSonnerComponent] }).compileComponents();

    fixture = TestBed.createComponent(ZardSonnerComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should promote the toaster to the top layer', () => {
    expect(host.getAttribute('popover')).toBe('manual');
    expect(openedPopovers).toContain(host);
  });

  it('should re-promote the toaster when a toast is dispatched', () => {
    showPopover.mockClear();

    toast.success('Saved!');
    fixture.detectChanges();

    expect(hidePopover).toHaveBeenCalled();
    expect(showPopover).toHaveBeenCalled();
    expect(openedPopovers.at(-1)).toBe(host);
  });

  it('should re-promote the toaster when another element enters the top layer', () => {
    toast.success('Saved!');
    fixture.detectChanges();

    const dialog = document.createElement('div');
    document.body.appendChild(dialog);
    openedPopovers.push(dialog);
    expect(openedPopovers.at(-1)).toBe(dialog);

    dialog.dispatchEvent(Object.assign(new Event('toggle', { bubbles: false }), { newState: 'open' }));

    expect(openedPopovers.at(-1)).toBe(host);

    dialog.remove();
  });

  it('should keep the toaster out of the top layer when disabled', () => {
    fixture.componentRef.setInput('topLayer', false);
    fixture.detectChanges();

    expect(host.hasAttribute('popover')).toBe(false);
    expect(openedPopovers).not.toContain(host);
  });
});
