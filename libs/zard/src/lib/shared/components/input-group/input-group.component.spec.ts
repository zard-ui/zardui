import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  ZardInputGroupAddonComponent,
  ZardInputGroupButtonDirective,
  ZardInputGroupComponent,
  ZardInputGroupTextComponent,
} from './input-group.component';
import { ZardInputComponent } from '../input/input.component';

@Component({
  imports: [
    ZardInputGroupComponent,
    ZardInputGroupAddonComponent,
    ZardInputGroupButtonDirective,
    ZardInputGroupTextComponent,
    ZardInputComponent,
  ],
  template: `
    <z-input-group>
      <z-input-group-addon>
        <span z-input-group-text>https://</span>
      </z-input-group-addon>
      <input z-input placeholder="example.com" />
      <z-input-group-addon zAlign="inline-end">
        <button z-input-group-button>Go</button>
      </z-input-group-addon>
    </z-input-group>
  `,
})
class TestHostComponent {}

describe('ZardInputGroupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('renders the group with role and data-slot', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('[data-slot=input-group]');
    expect(group).toBeTruthy();
    expect(group.getAttribute('role')).toBe('group');
  });

  it('renders addons with data-align attribute', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const addons = fixture.nativeElement.querySelectorAll('[data-slot=input-group-addon]');
    expect(addons.length).toBe(2);
    expect(addons[0].getAttribute('data-align')).toBe('inline-start');
    expect(addons[1].getAttribute('data-align')).toBe('inline-end');
  });

  it('marks the inner input with data-slot=input-group-control', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('data-slot')).toBe('input-group-control');
  });

  it('focuses the input when the addon is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const startAddon = fixture.nativeElement.querySelector('[data-align=inline-start]');
    const input = fixture.nativeElement.querySelector('input');
    startAddon.click();

    expect(document.activeElement).toBe(input);
  });
});
