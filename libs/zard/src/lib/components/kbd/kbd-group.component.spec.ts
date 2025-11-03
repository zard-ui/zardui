import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardKbdGroupComponent } from './kbd-group.component';

describe('KbdGroupComponent', () => {
  let component: ZardKbdGroupComponent;
  let fixture: ComponentFixture<ZardKbdGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardKbdGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardKbdGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
