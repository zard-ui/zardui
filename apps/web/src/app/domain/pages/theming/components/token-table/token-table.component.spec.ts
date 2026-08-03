import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TokenTableComponent } from './token-table.component';
import { BASE_COLORS } from '../../data/base-colors.data';
import { THEME_TOKENS, TOKEN_GROUPS } from '../../data/tokens.data';
import { ThemingClipboardService } from '../../services/theming-clipboard.service';

describe('TokenTableComponent', () => {
  let fixture: ComponentFixture<TokenTableComponent>;
  let clipboard: { copy: jest.Mock };

  const rows = () => fixture.debugElement.queryAll(By.css('tbody tr'));
  const tables = () => fixture.debugElement.queryAll(By.css('table'));
  const search = () => fixture.debugElement.query(By.css('input[type=search]')).nativeElement as HTMLInputElement;
  const modeButton = (label: string) =>
    fixture.debugElement
      .queryAll(By.css('[aria-label="Color scheme"] button'))
      .find(button => (button.nativeElement as HTMLElement).textContent?.trim() === label)!;

  const type = (value: string) => {
    const input = search();
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    clipboard = { copy: jest.fn().mockReturnValue(true) };

    await TestBed.configureTestingModule({
      imports: [TokenTableComponent],
      providers: [ThemingClipboardService, { provide: Clipboard, useValue: clipboard }],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenTableComponent);
    fixture.detectChanges();
  });

  it('renders every documented token', () => {
    expect(rows()).toHaveLength(THEME_TOKENS.length);
  });

  it('renders one table per token group', () => {
    expect(tables()).toHaveLength(TOKEN_GROUPS.length);
  });

  it('gives every table a caption and row headers', () => {
    for (const table of tables()) {
      expect(table.query(By.css('caption'))).toBeTruthy();
      expect(table.queryAll(By.css('th[scope="row"]')).length).toBeGreaterThan(0);
    }
  });

  it('shows light values by default', () => {
    const firstValue = rows()[0].query(By.css('td code')).nativeElement.textContent.trim();

    expect(firstValue).toBe(BASE_COLORS[0].light[THEME_TOKENS[0].name]);
  });

  it('switches every value to the dark palette', () => {
    modeButton('Dark').nativeElement.click();
    fixture.detectChanges();

    const firstValue = rows()[0].query(By.css('td code')).nativeElement.textContent.trim();

    expect(firstValue).toBe(BASE_COLORS[0].dark[THEME_TOKENS[0].name]);
  });

  it('filters by token name', () => {
    type('sidebar');

    const expected = THEME_TOKENS.filter(token => token.name.includes('sidebar')).length;
    expect(rows()).toHaveLength(expected);
  });

  it('filters by the component that consumes the token', () => {
    type('skeleton');

    const names = rows().map(row => row.query(By.css('th code')).nativeElement.textContent.trim());
    expect(names).toContain('--muted');
  });

  it('shows an empty state when nothing matches', () => {
    type('definitely-not-a-token');

    expect(rows()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('No token matches');
  });

  it('copies the token name when its button is clicked', () => {
    const button = rows()[0].query(By.css('th button')).nativeElement as HTMLButtonElement;
    button.click();

    expect(clipboard.copy).toHaveBeenCalledWith(`--${THEME_TOKENS[0].name}`);
  });

  it('copies the resolved value when the swatch is clicked', () => {
    const button = rows()[0].query(By.css('td button')).nativeElement as HTMLButtonElement;
    button.click();

    expect(clipboard.copy).toHaveBeenCalledWith(BASE_COLORS[0].light[THEME_TOKENS[0].name]);
  });
});
