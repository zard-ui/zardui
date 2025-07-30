import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardCommandDividerComponent } from './command-divider.component';
import { ZardCommandEmptyComponent } from './command-empty.component';
import { ZardCommandInputComponent } from './command-input.component';
import { ZardCommandListComponent } from './command-list.component';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandComponent } from './command.component';

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
    <z-command size="default" (zOnSelect)="onSelect($event)" (zOnChange)="onChange($event)">
      <z-command-input placeholder="Test placeholder"></z-command-input>
      <z-command-list>
        <z-command-empty>No results found.</z-command-empty>
        <z-command-option-group zLabel="Test Group">
          <z-command-option zLabel="Test Option" zValue="test" zShortcut="⌘T" zIcon='<div class="icon-test"></div>'></z-command-option>
          <z-command-option zLabel="Disabled Option" zValue="disabled" [zDisabled]="true"></z-command-option>
          <z-command-option zLabel="Search Option" zValue="search" zCommand="search test"></z-command-option>
        </z-command-option-group>
        <z-command-divider></z-command-divider>
        <z-command-option zLabel="Single Option" zValue="single"></z-command-option>
      </z-command-list>
    </z-command>
  `,
})
class TestHostComponent {
  selectedOption: unknown = null;
  changedOption: unknown = null;

  onSelect(option: unknown) {
    this.selectedOption = option;
  }

  onChange(option: unknown) {
    this.changedOption = option;
  }
}

describe('ZardCommandComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ZardCommandComponent;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ZardCommandComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder text', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Test placeholder');
  });

  it('should handle search input', () => {
    const input = fixture.nativeElement.querySelector('input');
    const searchTerm = 'test search';

    input.value = searchTerm;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.searchTerm()).toBe(searchTerm);
  });

  it('should have proper ARIA attributes', () => {
    const commandElement = fixture.nativeElement.querySelector('[role="combobox"]');
    expect(commandElement).toBeTruthy();
    expect(commandElement.getAttribute('aria-expanded')).toBe('true');
    expect(commandElement.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('should render command options', () => {
    const options = fixture.nativeElement.querySelectorAll('z-command-option');
    expect(options.length).toBe(4);
  });

  it('should render command group', () => {
    const group = fixture.nativeElement.querySelector('z-command-option-group');
    expect(group).toBeTruthy();
    expect(group.textContent).toContain('Test Group');
  });

  it('should render divider', () => {
    const divider = fixture.nativeElement.querySelector('z-command-divider');
    expect(divider).toBeTruthy();
  });

  it('should filter options based on search term', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(2); // "Test Option" and "Search Option" (has "test" in command)
  });

  it('should show empty state when no results', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'nonexistent';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emptyElement = fixture.nativeElement.querySelector('z-command-empty');
    expect(emptyElement).toBeTruthy();
    expect(emptyElement.textContent).toContain('No results found');
  });

  it('should emit zOnSelect when option is clicked', () => {
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const firstOption = optionElements[0];

    firstOption.click();
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeTruthy();
    expect((hostComponent.selectedOption as any)?.label).toBe('Test Option');
    expect((hostComponent.selectedOption as any)?.value).toBe('test');
  });

  it('should emit zOnChange when option is clicked', () => {
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const firstOption = optionElements[0];

    firstOption.click();
    fixture.detectChanges();

    expect(hostComponent.changedOption).toBeTruthy();
    expect((hostComponent.changedOption as any)?.label).toBe('Test Option');
    expect((hostComponent.changedOption as any)?.value).toBe('test');
  });

  it('should not emit events for disabled options', () => {
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const disabledOption = optionElements[1]; // "Disabled Option"

    disabledOption.click();
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeNull();
    expect(hostComponent.changedOption).toBeNull();
  });

  it('should handle keyboard navigation', () => {
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const firstOption = optionElements[0];

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    firstOption.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeTruthy();
    expect((hostComponent.selectedOption as any)?.label).toBe('Test Option');
  });

  it('should render option with icon and shortcut', () => {
    const optionElement = fixture.nativeElement.querySelector('z-command-option');
    expect(optionElement.innerHTML).toContain('icon-test');
    expect(optionElement.textContent).toContain('⌘T');
  });

  it('should hide groups when no matching options', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'single';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // The group should be hidden or not rendered when no options match
    const visibleOptions = fixture.nativeElement.querySelectorAll('z-command-option:not([style*="display: none"])');
    expect(visibleOptions.length).toBe(1); // Only "Single Option" should be visible
  });

  it('should hide dividers during search', () => {
    const input = fixture.nativeElement.querySelector('input');

    // Initially dividers should be visible
    const dividers = fixture.nativeElement.querySelectorAll('z-command-divider');
    expect(dividers.length).toBeGreaterThan(0);

    // After search, dividers should be hidden
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Dividers should be hidden during search (shadcn/ui behavior)
    const visibleDividers = fixture.nativeElement.querySelectorAll('z-command-divider > div');
    expect(visibleDividers.length).toBe(0);
  });

  it('should filter by command property', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'search';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(1); // Only "Search Option" has "search test" in command
    expect(filteredOptions[0].zLabel()).toBe('Search Option');
  });

  it('should maintain search state across multiple searches', () => {
    const input = fixture.nativeElement.querySelector('input');

    // First search
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchTerm()).toBe('test');

    // Second search
    input.value = 'single';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchTerm()).toBe('single');

    // Clear search
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchTerm()).toBe('');
  });

  it('should show all options when search is cleared', () => {
    const input = fixture.nativeElement.querySelector('input');

    // Search to filter
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.filteredOptions().length).toBe(2);

    // Clear search
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.filteredOptions().length).toBe(4); // All options visible again
  });

  it('should handle case-insensitive search', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'TEST';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(2); // Should match "Test Option" and "Search Option"
  });

  it('should update filtered options reactively', () => {
    const initialOptions = component.filteredOptions();

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBeLessThanOrEqual(initialOptions.length);
    expect(component.searchTerm()).toBe('test');
  });
});
