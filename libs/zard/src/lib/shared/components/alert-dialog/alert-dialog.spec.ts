import { type ComponentRef, type EmbeddedViewRef, Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

@Component({
  template: '<div>Test Content</div>',
})
class TestComponent {}

describe(ZardAlertDialogComponent.name, () => {
  const setup = async (config: Partial<ZardAlertDialogOptions<unknown>> = {}) => {
    const result = await render(ZardAlertDialogComponent, {
      providers: [
        {
          provide: ZardAlertDialogOptions,
          useValue: {
            zTitle: undefined,
            zDescription: undefined,
            zContent: undefined,
            zCancelText: 'Cancel',
            zOkText: 'Continue',
            zOkDisabled: false,
            zOkDestructive: false,
            zCustomClasses: undefined,
            zWidth: undefined,
            ...config,
          } satisfies ZardAlertDialogOptions<unknown>,
        },
      ],
    });

    const component = result.fixture.componentInstance;
    const okEmitSpy = jest.spyOn(component.okTriggered, 'emit');
    const cancelEmitSpy = jest.spyOn(component.cancelTriggered, 'emit');

    return { ...result, okEmitSpy, cancelEmitSpy };
  };

  describe('Host attributes and accessibility', () => {
    it('sets role="alertdialog" and aria-modal="true"', async () => {
      const { fixture } = await setup();

      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute('role')).toBe('alertdialog');
      expect(host.getAttribute('aria-modal')).toBe('true');
    });

    it('connects aria-labelledby to title id when zTitle is provided', async () => {
      const { fixture } = await setup({ zTitle: 'Test' });

      const host = fixture.nativeElement as HTMLElement;
      const title = screen.getByTestId('z-alert-title');
      expect(host.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'));
    });

    it('connects aria-describedby to description id when zDescription is provided', async () => {
      const { fixture } = await setup({ zDescription: 'Test desc' });

      const host = fixture.nativeElement as HTMLElement;
      const desc = screen.getByTestId('z-alert-description');
      expect(host.getAttribute('aria-describedby')).toBe(desc.getAttribute('id'));
    });

    it('omits aria-labelledby/describedby when title/description not provided', async () => {
      const { fixture } = await setup();

      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute('aria-labelledby')).toBeNull();
      expect(host.getAttribute('aria-describedby')).toBeNull();
    });

    it('applies zWidth to style.width', async () => {
      const { fixture } = await setup({ zWidth: '500px' });

      const host = fixture.nativeElement as HTMLElement;
      expect(host.style.width).toBe('500px');
    });

    it('applies computed classes including zCustomClasses', async () => {
      const { fixture } = await setup({ zCustomClasses: 'custom-class' });

      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Title and description rendering', () => {
    it('renders title/description when provided and connects aria attributes to their ids', async () => {
      const { fixture } = await setup({
        zTitle: 'Test Title',
        zDescription: 'Test Description',
      });

      const host = fixture.nativeElement as HTMLElement;
      const title = screen.getByTestId('z-alert-title');
      const description = screen.getByTestId('z-alert-description');

      expect(title).toHaveTextContent('Test Title');
      expect(description).toHaveTextContent('Test Description');

      expect(host.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'));
      expect(host.getAttribute('aria-describedby')).toBe(description.getAttribute('id'));
    });

    it('does not render title/description blocks when not provided', async () => {
      await setup({ zTitle: undefined, zDescription: undefined });

      expect(screen.queryByTestId('z-alert-title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('z-alert-description')).not.toBeInTheDocument();
    });
  });

  describe('Content rendering', () => {
    it('renders string content into the content container via innerHTML', async () => {
      await setup({ zContent: '<strong>Hello</strong>' });

      const content = screen.getByTestId('z-alert-content');
      expect(content.innerHTML).toContain('<strong>Hello</strong>');
    });

    it('does not render string content container when zContent is not a string', async () => {
      await setup({ zContent: TestComponent });

      expect(screen.queryByTestId('z-alert-content')).not.toBeInTheDocument();
    });
  });

  describe('Button rendering and behavior', () => {
    it('renders OK button with correct text and emits okTriggered on click', async () => {
      const user = userEvent.setup();
      const { okEmitSpy } = await setup({ zOkText: 'OK' });

      await user.click(screen.getByTestId('z-alert-ok-button'));

      expect(okEmitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('z-alert-ok-button')).toHaveTextContent('OK');
    });

    it('renders Cancel button with correct text and emits cancelTriggered on click', async () => {
      const user = userEvent.setup();
      const { cancelEmitSpy } = await setup({ zCancelText: 'Nope' });

      await user.click(screen.getByTestId('z-alert-cancel-button'));

      expect(cancelEmitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('z-alert-cancel-button')).toHaveTextContent('Nope');
    });

    it('hides OK button when zOkText is null', async () => {
      await setup({ zOkText: null });

      expect(screen.queryByTestId('z-alert-ok-button')).not.toBeInTheDocument();
    });

    it('hides Cancel button when zCancelText is null', async () => {
      await setup({ zCancelText: null });

      expect(screen.queryByTestId('z-alert-cancel-button')).not.toBeInTheDocument();
    });

    it('disables OK button when zOkDisabled is true', async () => {
      await setup({ zOkDisabled: true });

      expect(screen.getByTestId('z-alert-ok-button')).toBeDisabled();
    });

    it('applies destructive button styling when zOkDestructive is true', async () => {
      await setup({ zOkDestructive: true });

      const button = screen.getByTestId('z-alert-ok-button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('applies default button styling when zOkDestructive is false', async () => {
      await setup({ zOkDestructive: false });

      const button = screen.getByTestId('z-alert-ok-button');
      expect(button).toHaveClass('bg-primary');
    });
  });

  describe('Portal attachment methods', () => {
    it('attachComponentPortal throws error if content already attached', async () => {
      const { fixture } = await setup();
      const component = fixture.componentInstance;
      const mockPortal = {} as any;

      jest.spyOn(component.portalOutlet(), 'hasAttached').mockReturnValue(false);
      jest.spyOn(component.portalOutlet(), 'attachComponentPortal').mockReturnValue({} as ComponentRef<any>);

      expect(() => component.attachComponentPortal(mockPortal)).not.toThrow();

      jest.spyOn(component.portalOutlet(), 'hasAttached').mockReturnValue(true);
      expect(() => component.attachComponentPortal(mockPortal)).toThrow(
        'Attempting to attach alert dialog content after content is already attached',
      );
    });

    it('attachTemplatePortal throws error if content already attached', async () => {
      const { fixture } = await setup();
      const component = fixture.componentInstance;
      const mockPortal = {} as any;

      jest.spyOn(component.portalOutlet(), 'hasAttached').mockReturnValue(false);
      jest.spyOn(component.portalOutlet(), 'attachTemplatePortal').mockReturnValue({} as EmbeddedViewRef<any>);

      expect(() => component.attachTemplatePortal(mockPortal)).not.toThrow();

      jest.spyOn(component.portalOutlet(), 'hasAttached').mockReturnValue(true);
      expect(() => component.attachTemplatePortal(mockPortal)).toThrow(
        'Attempting to attach alert dialog content after content is already attached',
      );
    });
  });

  describe('Utility methods', () => {
    it('getNativeElement returns the host element', async () => {
      const { fixture } = await setup();
      const component = fixture.componentInstance;

      expect(component.getNativeElement()).toBe(fixture.nativeElement);
    });
  });
});
