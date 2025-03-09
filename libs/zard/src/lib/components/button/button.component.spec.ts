import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardButtonDirective } from './button.component';

describe('ButtonComponent', () => {
  let component: ZardButtonDirective;
  let fixture: ComponentFixture<ZardButtonDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardButtonDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardButtonDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
