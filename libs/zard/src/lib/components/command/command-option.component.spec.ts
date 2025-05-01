import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCommandOptionComponent } from './command-option.component';

describe('ZardCommandOptionComponent', () => {
  let component: ZardCommandOptionComponent;
  let fixture: ComponentFixture<ZardCommandOptionComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCommandOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCommandOptionComponent);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;

    // Set required inputs
    component.zLabel.set('Test Option');
    component.zValue.set('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label text', () => {
    expect(hostElement.textContent).toContain('Test Option');
  });

  it('should handle disabled state', () => {
    component.zDisabled.set(true);
    fixture.detectChanges();
    expect(hostElement.querySelector('div')?.classList.contains('opacity-50')).toBeTruthy();
  });

  it('should handle selected state', () => {
    component.zSelected.set(true);
    fixture.detectChanges();
    expect(hostElement.querySelector('div')?.classList.contains('bg-slate-100')).toBeTruthy();
  });

  it('should display icon when provided', () => {
    component.zIcon.set('icon-test');
    fixture.detectChanges();
    expect(hostElement.querySelector('i')?.classList.contains('icon-test')).toBeTruthy();
  });

  it('should display command when provided', () => {
    component.zCommand.set('Test Command');
    fixture.detectChanges();
    expect(hostElement.textContent).toContain('Test Command');
  });

  it('should display shortcut when provided', () => {
    component.zShortcut.set('⌘K');
    fixture.detectChanges();
    expect(hostElement.querySelector('kbd')?.textContent).toBe('⌘K');
  });
});
