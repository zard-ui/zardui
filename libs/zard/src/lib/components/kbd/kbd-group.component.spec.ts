import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardKbdGroupComponent } from './kbd-group.component';
import { ZardKbdComponent } from './kbd.component';

// KBD Group Test Host Component
@Component({
  imports: [ZardKbdGroupComponent, ZardKbdComponent],
  template: `
    <z-kbd-group>
      <z-kbd>Ctrl</z-kbd>
      <z-kbd>Shift</z-kbd>
      <z-kbd>N</z-kbd>
    </z-kbd-group>
  `,
})
class KbdGroupTestHostComponent {}

describe('KbdGroupComponent', () => {
  let component: ZardKbdGroupComponent;
  let fixture: ComponentFixture<ZardKbdGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardKbdGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardKbdGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('kbd group content', () => {
  let fixture: ComponentFixture<KbdGroupTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardKbdComponent, ZardKbdGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KbdGroupTestHostComponent);
    fixture.detectChanges();
  });

  it('should render the projected Kbd components', () => {
    const kbdEls = fixture.debugElement.queryAll(By.css('z-kbd'));
    expect(kbdEls.length).toBe(3);
  });

  it('should render the correct order of projected keys', () => {
    const textContents = fixture.debugElement.queryAll(By.css('kbd')).map(el => el.nativeElement.textContent.trim());
    expect(textContents).toEqual(['Ctrl', 'Shift', 'N']);
  });

  it('should maintain semantic structure (kbd inside group)', () => {
    const groupDiv = fixture.debugElement.query(By.css('z-kbd-group')).nativeElement;
    const innerKbds = groupDiv.querySelectorAll('kbd');
    expect(innerKbds.length).toBe(3);
  });
});
