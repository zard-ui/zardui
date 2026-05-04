import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardSeparatorComponent } from './separator.component';

describe('ZardSeparatorComponent', () => {
  let component: ZardSeparatorComponent;
  let fixture: ComponentFixture<ZardSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSeparatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render horizontal by default', () => {
    const separatorElement = fixture.nativeElement;
    expect(separatorElement.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should render vertical when set', () => {
    fixture.componentRef.setInput('zOrientation', 'vertical');
    fixture.detectChanges();

    const separatorElement = fixture.nativeElement;
    expect(separatorElement.getAttribute('data-orientation')).toBe('vertical');
  });

  it('is decorative by default with role="none"', () => {
    const separatorElement = fixture.nativeElement;
    expect(separatorElement.getAttribute('role')).toBe('none');
    expect(separatorElement.getAttribute('aria-orientation')).toBeNull();
  });

  it('exposes role="separator" when zDecorative is false', () => {
    fixture.componentRef.setInput('zDecorative', false);
    fixture.componentRef.setInput('zOrientation', 'vertical');
    fixture.detectChanges();

    const separatorElement = fixture.nativeElement;
    expect(separatorElement.getAttribute('role')).toBe('separator');
    expect(separatorElement.getAttribute('aria-orientation')).toBe('vertical');
  });
});
