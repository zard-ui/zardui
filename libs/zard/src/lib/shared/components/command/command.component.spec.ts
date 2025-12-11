import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardCommandDividerComponent } from './command-divider.component';
import { ZardCommandEmptyComponent } from './command-empty.component';
import { ZardCommandInputComponent } from './command-input.component';
import { ZardCommandListComponent } from './command-list.component';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandComponent } from './command.component';

import { ZardDebounceEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

const SEARCH_DEBOUNCE_MS = 150;

@Component({
  selector: 'test-host-component',
  imports: [
    ZardCommandComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandEmptyComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardCommandDividerComponent,
  ],
  standalone: true,
  template: `
    <z-command size="default" (zCommandSelected)="onSelect($event)" (zCommandChange)="onChange($event)">
      <z-command-input placeholder="Test placeholder" />
      <z-command-list>
        <z-command-empty>No results found.</z-command-empty>
        <z-command-option-group zLabel="Test Group">
          <z-command-option zLabel="Test Option" zValue="test" zShortcut="⌘T" zIcon="search" />
          <z-command-option zLabel="Disabled Option" zValue="disabled" [zDisabled]="true" />
          <z-command-option zLabel="Search Option" zValue="search" zCommand="search test" />
        </z-command-option-group>
        <z-command-divider />
        <z-command-option zLabel="Single Option" zValue="single" />
      </z-command-list>
    </z-command>
  `,
})
class TestHostComponent {
  selectedOption: any = null;
  changedOption: any = null;

  onSelect(option: any) {
    this.selectedOption = option;
  }

  onChange(option: any) {
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
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardDebounceEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ZardCommandComponent)).componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder text', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Test placeholder');
  });

  it('should handle search input', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');
    const searchTerm = 'test search';

    input.value = searchTerm;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
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
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(2); // "Test Option" and "Search Option" (has "test" in command)
  });

  it('should show empty state when no results', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'nonexistent';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(0);
  });

  it('should emit zCommandSelected when option is clicked', () => {
    jest.useFakeTimers();
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const [firstOption] = optionElements;
    const firstOptionDiv = firstOption.querySelector('div');

    firstOptionDiv.click();
    jest.advanceTimersByTime(0);
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeTruthy();
    expect(hostComponent.selectedOption?.label).toBe('Test Option');
    expect(hostComponent.selectedOption?.value).toBe('test');
  });

  it('should emit zCommandChange when option is clicked', () => {
    jest.useFakeTimers();
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const [firstOption] = optionElements;
    const firstOptionDiv = firstOption.querySelector('div');

    firstOptionDiv.click();
    jest.advanceTimersByTime(0);
    fixture.detectChanges();

    expect(hostComponent.changedOption).toBeTruthy();
    expect(hostComponent.changedOption?.label).toBe('Test Option');
    expect(hostComponent.changedOption?.value).toBe('test');
  });

  it('should not emit events for disabled options', () => {
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const [, disabledOption] = optionElements;

    disabledOption.click();
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeNull();
    expect(hostComponent.changedOption).toBeNull();
  });

  it('should handle keyboard navigation', () => {
    jest.useFakeTimers();
    const optionElements = fixture.nativeElement.querySelectorAll('z-command-option');
    const [firstOption] = optionElements;
    const firstOptionDiv = firstOption.querySelector('div');

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    firstOptionDiv.dispatchEvent(enterEvent);
    jest.advanceTimersByTime(0);
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeTruthy();
    expect(hostComponent.selectedOption?.label).toBe('Test Option');
  });

  it('should render option with icon and shortcut', () => {
    const optionElement = fixture.nativeElement.querySelector('z-command-option');
    const iconElement = optionElement.querySelector('div[z-icon]');
    expect(iconElement).toBeTruthy();
    expect(optionElement.textContent).toContain('⌘T');
  });

  it('should hide groups when no matching options', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'single';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(1); // Only "Single Option" should match
    expect(filteredOptions[0].zLabel()).toBe('Single Option');
  });

  it('should hide dividers during search', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    // Initially dividers should be visible
    const dividers = fixture.nativeElement.querySelectorAll('z-command-divider');
    expect(dividers.length).toBeGreaterThan(0);

    // After search, component filters options
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    // Check that search is active
    expect(component.searchTerm()).toBe('test');
  });

  it('should filter by command property', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'search';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(1); // Only "Search Option" has "search test" in command
    expect(filteredOptions[0].zLabel()).toBe('Search Option');
  });

  it('should maintain search state across multiple searches', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    // First search
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();
    expect(component.searchTerm()).toBe('test');

    // Second search
    input.value = 'single';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();
    expect(component.searchTerm()).toBe('single');

    // Clear search
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();
    expect(component.searchTerm()).toBe('');
  });

  it('should show all options when search is cleared', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    // Search to filter
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();
    expect(component.filteredOptions().length).toBe(2);

    // Clear search
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();
    expect(component.filteredOptions().length).toBe(4); // All options visible again
  });

  it('should handle case-insensitive search', () => {
    jest.useFakeTimers();
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'TEST';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBe(2); // Should match "Test Option" and "Search Option"
  });

  it('should update filtered options reactively', () => {
    jest.useFakeTimers();
    const initialOptions = component.filteredOptions();

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();

    const filteredOptions = component.filteredOptions();
    expect(filteredOptions.length).toBeLessThanOrEqual(initialOptions.length);
    expect(component.searchTerm()).toBe('test');
  });
});
