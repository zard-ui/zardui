import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZardProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ZardProgressBarComponent;
  let fixture: ComponentFixture<ZardProgressBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ZardProgressBarComponent],
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

  it('should not have negative width', () => {
    fixture.componentRef.setInput('progress', -50);
    fixture.detectChanges();
    const barDiv: HTMLElement = fixture.nativeElement.querySelector('#bar');
    expect(barDiv.style.width).toEqual('0%');
  });

  it('should not have width > 100', () => {
    fixture.componentRef.setInput('progress', 120);
    fixture.detectChanges();
    const barDiv: HTMLElement = fixture.nativeElement.querySelector('#bar');
    expect(barDiv.style.width).toEqual('100%');
  });

  it('should set the right width', () => {
    fixture.componentRef.setInput('progress', 78);
    fixture.detectChanges();
    const barDiv: HTMLElement = fixture.nativeElement.querySelector('#bar');
    expect(barDiv.style.width).toEqual('78%');
  });

  it('should override variants by user input', () => {
    fixture.componentRef.setInput('barClass', 'bg-red-500');
    fixture.detectChanges();
    const barDiv: HTMLElement = fixture.nativeElement.querySelector('#bar');
    expect(barDiv.classList).toContain('bg-red-500');
  });
});
