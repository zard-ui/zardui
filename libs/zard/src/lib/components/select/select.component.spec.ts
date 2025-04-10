import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardSelectComponent } from './select.component';

describe('ZardSelectComponent', () => {
  let component: ZardSelectComponent;
  let fixture: ComponentFixture<ZardSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
