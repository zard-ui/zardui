import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardInputComponent } from './input.component';

describe('InputComponent', () => {
  let component: ZardInputComponent;
  let fixture: ComponentFixture<ZardInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
