import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardCommandComponent } from './command.component';
import { ZardCommandDividerComponent } from './command-divider.component';
import { ZardCommandInputComponent } from './command-input.component';
import { ZardCommandListComponent } from './command-list.component';
import { ZardCommandEmptyComponent } from './command-empty.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [
    ZardCommandComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandEmptyComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardCommandDividerComponent,
  ],
  template: `
    <z-command>
      <z-command-input placeholder="Search..."></z-command-input>
      <z-command-list>
        <z-command-empty>No results found.</z-command-empty>
        <z-command-option-group zLabel="Group 1">
          <z-command-option zLabel="Option 1" zValue="opt1"></z-command-option>
        </z-command-option-group>

        <z-command-divider class="test-divider"></z-command-divider>

        <z-command-option-group zLabel="Group 2">
          <z-command-option zLabel="Option 2" zValue="opt2"></z-command-option>
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
})
class TestHostComponent {}

@Component({
  selector: 'standalone-test',
  standalone: true,
  imports: [ZardCommandDividerComponent],
  template: `<z-command-divider class="standalone-divider"></z-command-divider>`,
})
class StandaloneTestComponent {}

describe('ZardCommandDividerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ZardCommandDividerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, StandaloneTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.query(By.directive(ZardCommandDividerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show divider when no search term', () => {
    const dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
    expect(dividerElement).toBeTruthy();
    expect(dividerElement.getAttribute('role')).toBe('separator');
  });

  it('should hide divider during search', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'option';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
    expect(dividerElement).toBeFalsy();
  });

  it('should show divider when search is cleared', () => {
    const input = fixture.nativeElement.querySelector('input');

    // Search first
    input.value = 'option';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    let dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
    expect(dividerElement).toBeFalsy();

    // Clear search
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
    expect(dividerElement).toBeTruthy();
  });

  it('should work without command component context', () => {
    const standaloneFixture = TestBed.createComponent(StandaloneTestComponent);
    standaloneFixture.detectChanges();

    const dividerElement = standaloneFixture.nativeElement.querySelector('div');
    expect(dividerElement).toBeTruthy();
    expect(dividerElement.getAttribute('role')).toBe('separator');
  });

  it('should have correct CSS classes', () => {
    const dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
    expect(dividerElement.getAttribute('role')).toBe('separator');
    expect(dividerElement.className).toContain('-mx-1');
    expect(dividerElement.className).toContain('my-1');
    expect(dividerElement.className).toContain('h-px');
    expect(dividerElement.className).toContain('bg-border');
  });

  it('should support custom CSS classes', () => {
    const dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
    expect(dividerElement.className).toContain('test-divider');
  });

  it('should respond to search term changes reactively', () => {
    const input = fixture.nativeElement.querySelector('input');

    // Multiple search changes
    const searchTerms = ['opt1', 'opt2', 'nonexistent', ''];

    searchTerms.forEach(term => {
      input.value = term;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const dividerElement = fixture.nativeElement.querySelector('z-command-divider div');
      if (term === '') {
        expect(dividerElement).toBeTruthy(); // Should show when no search
      } else {
        expect(dividerElement).toBeFalsy(); // Should hide during search
      }
    });
  });
});
