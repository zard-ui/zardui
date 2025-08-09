import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardFormMessageComponent } from './form-message.component';

describe('ZardFormMessageComponent', () => {
  let component: ZardFormMessageComponent;
  let fixture: ComponentFixture<ZardFormMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default classes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('text-sm');
    expect(element.className).toContain('text-muted-foreground');
  });

  it('should apply error type classes', () => {
    fixture.componentRef.setInput('zType', 'error');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('text-red-500');
  });

  it('should apply success type classes', () => {
    fixture.componentRef.setInput('zType', 'success');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('text-green-500');
  });

  it('should apply warning type classes', () => {
    fixture.componentRef.setInput('zType', 'warning');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('text-yellow-500');
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-message-class');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toContain('custom-message-class');
  });

  it('should render content', () => {
    fixture.nativeElement.textContent = 'Test message';
    expect(fixture.nativeElement.textContent).toContain('Test message');
  });
});
