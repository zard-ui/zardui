import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardComponent } from './zard.component';

describe('ZardComponent', () => {
  let component: ZardComponent;
  let fixture: ComponentFixture<ZardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
