import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardAlertDialogContainerComponent, ZardAlertDialogOptions } from './alert-dialog-container.component';

describe(ZardAlertDialogContainerComponent.name, () => {
  const setup = async (config: Partial<ZardAlertDialogOptions<unknown>> = {}) => {
    const result = await render(ZardAlertDialogContainerComponent, {
      providers: [
        {
          provide: ZardAlertDialogOptions,
          useValue: {
            zCancelText: 'Cancel',
            zOkText: 'Continue',
            zOkDisabled: false,
            zOkDestructive: false,
            ...config,
          } satisfies ZardAlertDialogOptions<unknown>,
        },
      ],
    });

    // The title and description register their ids after the first render.
    await result.fixture.whenStable();
    result.fixture.detectChanges();

    const component = result.fixture.componentInstance;
    const okEmitSpy = jest.spyOn(component.okTriggered, 'emit');
    const cancelEmitSpy = jest.spyOn(component.cancelTriggered, 'emit');
    const panel = (result.fixture.nativeElement as HTMLElement).querySelector('z-alert-dialog-panel') as HTMLElement;

    return { ...result, component, okEmitSpy, cancelEmitSpy, panel };
  };

  describe('Panel attributes and accessibility', () => {
    it('sets role="alertdialog" and aria-modal="true" on the panel', async () => {
      const { panel } = await setup();

      expect(panel.getAttribute('role')).toBe('alertdialog');
      expect(panel.getAttribute('aria-modal')).toBe('true');
    });

    it('connects aria-labelledby to the title id when zTitle is provided', async () => {
      const { panel } = await setup({ zTitle: 'Test' });
      const title = screen.getByTestId('z-alert-title');

      expect(title.getAttribute('id')).toBeTruthy();
      expect(panel.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'));
    });

    it('connects aria-describedby to the description id when zDescription is provided', async () => {
      const { panel } = await setup({ zDescription: 'Test desc' });
      const description = screen.getByTestId('z-alert-description');

      expect(panel.getAttribute('aria-describedby')).toBe(description.getAttribute('id'));
    });

    it('omits aria-labelledby/describedby when title/description are not provided', async () => {
      const { panel } = await setup();

      expect(panel.getAttribute('aria-labelledby')).toBeNull();
      expect(panel.getAttribute('aria-describedby')).toBeNull();
    });

    it('applies zWidth, zSize and zCustomClasses to the panel', async () => {
      const { panel } = await setup({ zWidth: '500px', zSize: 'sm', zCustomClasses: 'custom-class' });

      expect(panel.style.width).toBe('500px');
      expect(panel.getAttribute('data-size')).toBe('sm');
      expect(panel.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Title and description rendering', () => {
    it('renders the title and the description', async () => {
      await setup({ zTitle: 'Test Title', zDescription: 'Test Description' });

      expect(screen.getByTestId('z-alert-title')).toHaveTextContent('Test Title');
      expect(screen.getByTestId('z-alert-description')).toHaveTextContent('Test Description');
    });

    it('keeps inline markup in the description', async () => {
      await setup({ zDescription: 'View <a href="#">Settings</a> first.' });

      expect(screen.getByTestId('z-alert-description').querySelector('a')).toHaveTextContent('Settings');
    });

    it('does not render title/description blocks when not provided', async () => {
      await setup();

      expect(screen.queryByTestId('z-alert-title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('z-alert-description')).not.toBeInTheDocument();
    });
  });

  describe('Button rendering and behavior', () => {
    it('renders the OK button and emits okTriggered on click', async () => {
      const user = userEvent.setup();
      const { okEmitSpy } = await setup({ zOkText: 'OK' });

      await user.click(screen.getByTestId('z-alert-ok-button'));

      expect(okEmitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('z-alert-ok-button')).toHaveTextContent('OK');
    });

    it('renders the Cancel button and emits cancelTriggered on click', async () => {
      const user = userEvent.setup();
      const { cancelEmitSpy } = await setup({ zCancelText: 'Nope' });

      await user.click(screen.getByTestId('z-alert-cancel-button'));

      expect(cancelEmitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('z-alert-cancel-button')).toHaveTextContent('Nope');
    });

    it('hides a button whose text is null', async () => {
      await setup({ zOkText: null, zCancelText: null });

      expect(screen.queryByTestId('z-alert-ok-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('z-alert-cancel-button')).not.toBeInTheDocument();
    });

    it('disables the OK button when zOkDisabled is true', async () => {
      await setup({ zOkDisabled: true });

      expect(screen.getByTestId('z-alert-ok-button')).toBeDisabled();
    });

    it('styles the OK button as destructive when zOkDestructive is true', async () => {
      await setup({ zOkDestructive: true });

      expect(screen.getByTestId('z-alert-ok-button')).toHaveClass('bg-destructive/10');
    });

    it('styles the OK button as primary by default', async () => {
      await setup({ zOkDestructive: false });

      expect(screen.getByTestId('z-alert-ok-button')).toHaveClass('bg-primary');
    });
  });

  describe('Host contract', () => {
    it('requestClose reports through cancelTriggered', async () => {
      const { component, cancelEmitSpy } = await setup();

      component.requestClose();

      expect(cancelEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('leave marks the panel as closed so the exit transition plays', async () => {
      const { component, fixture, panel } = await setup();

      expect(panel.getAttribute('data-state')).toBe('open');

      component.leave();
      fixture.detectChanges();

      expect(panel.getAttribute('data-state')).toBe('closed');
    });

    it('getNativeElement returns the host element', async () => {
      const { component, fixture } = await setup();

      expect(component.getNativeElement()).toBe(fixture.nativeElement);
    });
  });
});
