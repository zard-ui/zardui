import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCommandDividerComponent } from './command-divider.component';

describe('ZardCommandDividerComponent', () => {
  let component: ZardCommandDividerComponent;
  let fixture: ComponentFixture<ZardCommandDividerComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCommandDividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCommandDividerComponent);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hr element with correct classes', () => {
    const hr = hostElement.querySelector('hr');
    expect(hr).toBeTruthy();
    expect(hr?.classList.contains('my-2')).toBeTruthy();
    expect(hr?.classList.contains('border-t')).toBeTruthy();
    expect(hr?.classList.contains('border-slate-200')).toBeTruthy();
  });
});
