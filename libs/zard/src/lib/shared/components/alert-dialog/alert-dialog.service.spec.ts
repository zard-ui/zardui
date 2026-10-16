import { Overlay } from '@angular/cdk/overlay';
import { EventEmitter } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ZardAlertDialogService } from './alert-dialog.service';

describe('ZardAlertDialogService', () => {
  let service: ZardAlertDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZardAlertDialogService, Overlay],
    });

    service = TestBed.inject(ZardAlertDialogService);
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(overlay => overlay.remove());
  });

  const click = (testId: string) => {
    TestBed.tick();
    // The newest dialog is the last one in the overlay container.
    const buttons = document.querySelectorAll<HTMLButtonElement>(`[data-testid="${testId}"]`);
    buttons[buttons.length - 1].click();
  };

  /**
   * An alert dialog has no content component, so the instance the shared overlay
   * ref hands to the footer callbacks was always null and `zData` reached no one.
   * The callbacks get the dialog's `zData` instead: it is what tells them which
   * record the user confirmed (#724).
   */
  describe('footer callbacks', () => {
    it('passes zData to zOnOk', fakeAsync(() => {
      const zOnOk = jest.fn();

      service.confirm({ zTitle: 'Delete run?', zData: { runId: 'run-1' }, zOnOk });
      click('z-alert-ok-button');
      tick(200);

      expect(zOnOk).toHaveBeenCalledWith({ runId: 'run-1' });
    }));

    it('passes zData to zOnCancel', fakeAsync(() => {
      const zOnCancel = jest.fn();

      service.confirm({ zTitle: 'Delete run?', zData: { runId: 'run-1' }, zOnCancel });
      click('z-alert-cancel-button');
      tick(200);

      expect(zOnCancel).toHaveBeenCalledWith({ runId: 'run-1' });
    }));

    it('emits zData through an EventEmitter callback', fakeAsync(() => {
      const zOnOk = new EventEmitter<{ runId: string }>();
      const received: { runId: string }[] = [];
      zOnOk.subscribe(data => received.push(data));

      service.confirm({ zTitle: 'Delete run?', zData: { runId: 'run-1' }, zOnOk });
      click('z-alert-ok-button');
      tick(200);

      expect(received).toEqual([{ runId: 'run-1' }]);
    }));

    it('passes undefined when no zData is given', fakeAsync(() => {
      const zOnOk = jest.fn();

      service.confirm({ zTitle: 'Continue?', zOnOk });
      click('z-alert-ok-button');
      tick(200);

      expect(zOnOk).toHaveBeenCalledWith(undefined);
    }));

    it('still closes after zOnOk and keeps the dialog open when it returns false', fakeAsync(() => {
      const closing = service.confirm({ zTitle: 'Continue?', zData: { id: 1 }, zOnOk: () => undefined });
      click('z-alert-ok-button');
      tick(200);
      expect(closing.isClosing()).toBe(true);

      const staying = service.confirm({ zTitle: 'Continue?', zData: { id: 2 }, zOnOk: () => false });
      click('z-alert-ok-button');
      tick(200);
      expect(staying.isClosing()).toBe(false);

      staying.close();
      tick(200);
    }));
  });
});
