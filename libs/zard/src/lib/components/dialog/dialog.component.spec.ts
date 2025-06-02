import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDialogComponent } from './dialog.component';

describe('ZardDialogComponent', () => {
  let component: ZardDialogComponent;
  let fixture: ComponentFixture<ZardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
