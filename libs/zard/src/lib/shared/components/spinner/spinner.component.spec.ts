import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardSpinnerComponent } from './spinner.component';

describe('ZardSpinnerComponent', () => {
  let component: ZardSpinnerComponent;
  let fixture: ComponentFixture<ZardSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
