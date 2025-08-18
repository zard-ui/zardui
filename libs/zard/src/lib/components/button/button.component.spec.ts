import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ZardButtonComponent;
  let fixture: ComponentFixture<ZardButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
