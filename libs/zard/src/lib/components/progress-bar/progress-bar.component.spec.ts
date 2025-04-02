import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ZardProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ZardProgressBarComponent;
  let fixture: ComponentFixture<ZardProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZardProgressBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZardProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
