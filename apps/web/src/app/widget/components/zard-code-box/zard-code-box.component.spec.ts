import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardCodeBoxComponent } from './zard-code-box.component';

const translations: ZardRtlTranslations<{ text: string }> = {
  en: { dir: 'ltr', values: { text: 'Hello' } },
  ar: { dir: 'rtl', values: { text: 'مرحبا' } },
  he: { dir: 'rtl', values: { text: 'שלום' } },
};

@Component({
  selector: 'z-test-rtl-demo',
  template: `
    <span data-testid="text">{{ i18n.t().text }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RtlDemoComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

describe('ZardCodeBoxComponent', () => {
  let component: ZardCodeBoxComponent;
  let fixture: ComponentFixture<ZardCodeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCodeBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCodeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('previews', () => {
    const preview = () => fixture.nativeElement.querySelector('[data-slot="preview"]') as HTMLElement;
    const header = () => fixture.nativeElement.querySelector('[data-slot="rtl-preview-header"]');

    function render(type?: 'rtl') {
      fixture.componentRef.setInput('dynamicComponent', RtlDemoComponent);
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
    }

    it('forces an ordinary preview to ltr, with no language header', () => {
      render();

      expect(preview().getAttribute('dir')).toBe('ltr');
      expect(preview().hasAttribute('data-lang')).toBe(false);
      expect(header()).toBeNull();
    });

    it('renders the RTL preview in Arabic by default', () => {
      render('rtl');

      expect(header()).not.toBeNull();
      expect(preview().getAttribute('dir')).toBe('rtl');
      expect(preview().getAttribute('data-lang')).toBe('ar');
      expect(preview().querySelector('[data-testid="text"]')?.textContent).toBe('مرحبا');
    });

    it('follows the selected language live', () => {
      render('rtl');

      component.language.set('en');
      fixture.detectChanges();
      expect(preview().getAttribute('dir')).toBe('ltr');
      expect(preview().getAttribute('data-lang')).toBe('en');
      expect(preview().querySelector('[data-testid="text"]')?.textContent).toBe('Hello');

      component.language.set('he');
      fixture.detectChanges();
      expect(preview().getAttribute('dir')).toBe('rtl');
      expect(preview().getAttribute('data-lang')).toBe('he');
      expect(preview().querySelector('[data-testid="text"]')?.textContent).toBe('שלום');
    });
  });
});
