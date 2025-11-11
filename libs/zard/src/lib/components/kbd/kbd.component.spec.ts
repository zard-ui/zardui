import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardKbdComponent } from './kbd.component';

// KBD Test Host Component
@Component({
  imports: [ZardKbdComponent],
  template: `
    <div class="flex items-center gap-2">
      <z-kbd>Ctrl</z-kbd>
      <span>+</span>
      <z-kbd>X</z-kbd>
    </div>
  `,
})
class KbdTestHostComponent {}

describe('KbdComponent', () => {
  let component: ZardKbdComponent;
  let fixture: ComponentFixture<ZardKbdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardKbdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardKbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('kbd content', () => {
  let fixture: ComponentFixture<KbdTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardKbdComponent, KbdTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KbdTestHostComponent);
    fixture.detectChanges();
  });

  it('should render projected text content', () => {
    const kbdEls = fixture.debugElement.queryAll(By.css('kbd'));
    expect(kbdEls.length).toBe(2);
    expect(kbdEls[0].nativeElement.textContent.trim()).toBe('Ctrl');
    expect(kbdEls[1].nativeElement.textContent.trim()).toBe('X');
  });

  it('should maintain semantic kbd tag', () => {
    const kbdEl = fixture.debugElement.query(By.css('kbd')).nativeElement;
    expect(kbdEl.tagName.toLowerCase()).toBe('kbd');
  });

  it('should be accessible via role', () => {
    const kbdEl = fixture.debugElement.query(By.css('kbd')).nativeElement;
    expect(kbdEl.getAttribute('role')).toBeNull();
  });
});
