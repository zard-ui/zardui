import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardBadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: ZardBadgeComponent;
  let fixture: ComponentFixture<ZardBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
