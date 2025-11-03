import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardKbdComponent } from './kbd.component';

describe('KbdComponent', () => {
  let component: ZardKbdComponent;
  let fixture: ComponentFixture<ZardKbdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardKbdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardKbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
