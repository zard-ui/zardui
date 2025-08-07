import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDividerComponent } from './divider.component';

describe('ZardDividerComponent', () => {
  let component: ZardDividerComponent;
  let fixture: ComponentFixture<ZardDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render horizontal by default', () => {
    const dividerElement = fixture.nativeElement;
    expect(dividerElement.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should render vertical when set', () => {
    fixture.componentRef.setInput('zOrientation', 'vertical');
    fixture.detectChanges();

    const dividerElement = fixture.nativeElement;
    expect(dividerElement.getAttribute('aria-orientation')).toBe('vertical');
  });
});
