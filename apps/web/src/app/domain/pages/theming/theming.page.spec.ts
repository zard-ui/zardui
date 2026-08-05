import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { BASE_COLORS } from './data/base-colors.data';
import { THEME_TOKENS } from './data/tokens.data';
import { ThemingPage } from './theming.page';

describe('ThemingPage', () => {
  let component: ThemingPage;
  let fixture: ComponentFixture<ThemingPage>;
  let clipboard: { copy: jest.Mock };

  beforeEach(async () => {
    clipboard = { copy: jest.fn().mockReturnValue(true) };

    await TestBed.configureTestingModule({
      imports: [ThemingPage],
      providers: [provideRouter([]), { provide: Clipboard, useValue: clipboard }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation', () => {
    const sectionIds = () =>
      fixture.debugElement
        .queryAll(By.css('[scrollSpyItem]'))
        .map(el => (el.nativeElement as HTMLElement).getAttribute('id'));

    it('has a navigation entry for every section in the template', () => {
      const configured = component.navigationConfig.items.map(item => item.id);

      for (const id of sectionIds()) {
        expect(configured).toContain(id);
      }
    });

    it('has a section in the template for every navigation entry', () => {
      const rendered = sectionIds();

      for (const item of component.navigationConfig.items) {
        expect(rendered).toContain(item.id);
      }
    });

    it('keeps the anchor ids unique', () => {
      const ids = component.navigationConfig.items.map(item => item.id);

      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('heading structure', () => {
    it('renders exactly one h1', () => {
      expect(fixture.debugElement.queryAll(By.css('h1'))).toHaveLength(1);
    });

    it('never skips a heading level', () => {
      const levels = fixture.debugElement
        .queryAll(By.css('h1, h2, h3, h4, h5, h6'))
        .map(el => Number((el.nativeElement as HTMLElement).tagName[1]));

      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('token reference', () => {
    it('renders every documented token', () => {
      expect(fixture.debugElement.queryAll(By.css('z-token-table tbody tr'))).toHaveLength(THEME_TOKENS.length);
    });

    it('announces the same count in the prose', () => {
      expect(component.tokenCount).toBe(THEME_TOKENS.length);
    });
  });

  describe('base colors', () => {
    it('offers a code block for each CLI preset', () => {
      for (const theme of BASE_COLORS) {
        expect(component.baseColorBlocks[theme.id]).toBeDefined();
      }
    });

    it('copies the swatch value when a swatch is clicked', () => {
      const swatch = fixture.debugElement.query(By.css('z-base-color-preview button[aria-label^="Copy "]'));
      (swatch.nativeElement as HTMLButtonElement).click();

      expect(clipboard.copy).toHaveBeenCalledWith(BASE_COLORS[0].light['background']);
    });
  });

  describe('tables', () => {
    it('gives every table a caption', () => {
      const tables = fixture.debugElement.queryAll(By.css('table'));

      expect(tables.length).toBeGreaterThan(0);
      for (const table of tables) {
        expect(table.query(By.css('caption'))).toBeTruthy();
      }
    });
  });
});
