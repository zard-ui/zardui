import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardFormFieldComponent } from './form-field.component';

describe('ZardFormFieldComponent', () => {
  let component: ZardFormFieldComponent;
  let fixture: ComponentFixture<ZardFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default classes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('space-y-2');
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('custom-class');
  });

  it('should render content', () => {
    fixture.nativeElement.innerHTML = '<span>Test content</span>';
    expect(fixture.nativeElement.textContent).toContain('Test content');
  });
});
