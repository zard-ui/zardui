import { type ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZardProgressComponent } from './progress.component';

describe('ZardProgressComponent', () => {
  let component: ZardProgressComponent;
  let fixture: ComponentFixture<ZardProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ZardProgressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZardProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function indicator(): HTMLElement {
    return fixture.nativeElement.querySelector('[data-slot="progress-indicator"]');
  }

  it('clamps negative values to 0', () => {
    fixture.componentRef.setInput('value', -50);
    fixture.detectChanges();
    expect(indicator().style.transform).toEqual('translateX(-100%)');
    expect(fixture.nativeElement.getAttribute('aria-valuenow')).toEqual('0');
  });

  it('clamps values above 100 to 100', () => {
    fixture.componentRef.setInput('value', 120);
    fixture.detectChanges();
    expect(indicator().style.transform).toEqual('translateX(-0%)');
    expect(fixture.nativeElement.getAttribute('aria-valuenow')).toEqual('100');
  });

  it('translates the indicator according to the value', () => {
    fixture.componentRef.setInput('value', 78);
    fixture.detectChanges();
    expect(indicator().style.transform).toEqual('translateX(-22%)');
    expect(fixture.nativeElement.getAttribute('aria-valuenow')).toEqual('78');
  });

  it('exposes the progressbar role on the host', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('progressbar');
  });
});
