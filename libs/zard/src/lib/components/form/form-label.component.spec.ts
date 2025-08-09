import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardFormLabelComponent } from './form-label.component';

describe('ZardFormLabelComponent', () => {
  let component: ZardFormLabelComponent;
  let fixture: ComponentFixture<ZardFormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default classes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('text-sm');
    expect(element.className).toContain('font-medium');
  });

  it('should show required indicator when zRequired is true', () => {
    fixture.componentRef.setInput('zRequired', true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain("after:content-['*']");
    expect(element.className).toContain('after:text-red-500');
  });

  it('should not show required indicator when zRequired is false', () => {
    fixture.componentRef.setInput('zRequired', false);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).not.toContain("after:content-['*']");
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-label-class');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('custom-label-class');
  });
});
