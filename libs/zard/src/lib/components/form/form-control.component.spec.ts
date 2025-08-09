import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardFormControlComponent } from './form-control.component';

describe('ZardFormControlComponent', () => {
  let component: ZardFormControlComponent;
  let fixture: ComponentFixture<ZardFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default classes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toBe('');
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-control-class');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('custom-control-class');
  });

  it('should render content', () => {
    fixture.nativeElement.innerHTML = '<input type="text">';
    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });
});
