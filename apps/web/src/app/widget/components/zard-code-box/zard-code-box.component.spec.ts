import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardCodeBoxComponent } from './zard-code-box.component';

describe('ZardCodeBoxComponent', () => {
  let component: ZardCodeBoxComponent;
  let fixture: ComponentFixture<ZardCodeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCodeBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCodeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
