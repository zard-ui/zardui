import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardInputDirective } from './input.directive';

describe('InputComponent', () => {
  let component: ZardInputDirective;
  let fixture: ComponentFixture<ZardInputDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardInputDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardInputDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
