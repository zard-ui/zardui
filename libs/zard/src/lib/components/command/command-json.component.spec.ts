import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardCommandJsonComponent } from './command-json.component';
import { ZardCommandConfig, ZardCommandOption } from './command.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardCommandJsonComponent],
  template: ` <z-command-json [config]="commandConfig" (zOnSelect)="onSelect($event)" (zOnChange)="onChange($event)"> </z-command-json> `,
})
class TestHostComponent {
  selectedOption: ZardCommandOption | null = null;
  changedOption: ZardCommandOption | null = null;
  lastAction = '';

  commandConfig: ZardCommandConfig = {
    placeholder: 'Test placeholder',
    emptyText: 'No results found.',
    dividers: true,
    groups: [
      {
        label: 'File Actions',
        options: [
          {
            label: 'New File',
            value: 'new',
            icon: '<div class="icon-file-plus"></div>',
            shortcut: '⌘N',
            key: 'n',
            action: () => {
              this.lastAction = 'New file created!';
            },
          },
          {
            label: 'Open File',
            value: 'open',
            icon: '<div class="icon-folder-open"></div>',
            shortcut: '⌘O',
            key: 'o',
          },
          {
            label: 'Search File',
            value: 'search',
            command: 'search files',
            key: 's',
          },
        ],
      },
      {
        label: 'Tools',
        options: [
          {
            label: 'Terminal',
            value: 'terminal',
            icon: '<div class="icon-terminal"></div>',
            key: 't',
          },
          {
            label: 'Settings',
            value: 'settings',
            disabled: true,
          },
        ],
      },
    ],
  };

  onSelect(option: ZardCommandOption) {
    this.selectedOption = option;
  }

  onChange(option: ZardCommandOption) {
    this.changedOption = option;
  }
}

describe('ZardCommandJsonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ZardCommandJsonComponent;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ZardCommandJsonComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder text', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Test placeholder');
  });

  it('should render all groups and options', () => {
    const groups = fixture.nativeElement.querySelectorAll('z-command-option-group');
    expect(groups.length).toBe(2);

    const options = fixture.nativeElement.querySelectorAll('z-command-option');
    expect(options.length).toBe(5);
  });

  it('should render icons and shortcuts', () => {
    const firstOption = fixture.nativeElement.querySelector('z-command-option');
    expect(firstOption.innerHTML).toContain('icon-file-plus');
    expect(firstOption.textContent).toContain('⌘N');
  });

  it('should filter options based on search', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'file';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredGroups = component.filteredGroups();
    expect(filteredGroups.length).toBe(1); // Only "File Actions" group
    expect(filteredGroups[0].visibleOptions.length).toBe(3); // All file-related options
  });

  it('should filter by command property', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'search files';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredGroups = component.filteredGroups();
    expect(filteredGroups[0].visibleOptions.length).toBe(1);
    expect(filteredGroups[0].visibleOptions[0].label).toBe('Search File');
  });

  it('should hide empty groups during search', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'nonexistent';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredGroups = component.filteredGroups();
    expect(filteredGroups.length).toBe(0); // No groups with matching options
  });

  it('should execute option action when clicked', () => {
    const firstOption = fixture.nativeElement.querySelector('z-command-option');

    firstOption.click();
    fixture.detectChanges();

    expect(hostComponent.lastAction).toBe('New file created!');
  });

  it('should emit zOnSelect and zOnChange events', () => {
    const firstOption = fixture.nativeElement.querySelector('z-command-option');

    firstOption.click();
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeTruthy();
    expect(hostComponent.selectedOption?.label).toBe('New File');
    expect(hostComponent.changedOption).toBeTruthy();
    expect(hostComponent.changedOption?.value).toBe('new');
  });

  it('should execute global onSelect callback', () => {
    const secondOption = fixture.nativeElement.querySelectorAll('z-command-option')[1];

    secondOption.click();
    fixture.detectChanges();

    expect(hostComponent.lastAction).toBe('Global: Open File');
  });

  it('should not execute actions for disabled options', () => {
    const disabledOption = fixture.nativeElement.querySelectorAll('z-command-option')[4]; // Settings

    disabledOption.click();
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeNull();
    expect(hostComponent.changedOption).toBeNull();
  });

  it('should handle keyboard shortcuts', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'n', metaKey: true });
    component.handleKeydown(keyEvent);
    fixture.detectChanges();

    expect(hostComponent.lastAction).toBe('New file created!');
  });

  it('should handle keyboard shortcuts for options without actions', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'o', metaKey: true });
    component.handleKeydown(keyEvent);
    fixture.detectChanges();

    expect(hostComponent.selectedOption).toBeTruthy();
    expect(hostComponent.selectedOption?.value).toBe('open');
  });

  it('should hide dividers during search', () => {
    const input = fixture.nativeElement.querySelector('input');

    // Initially should have dividers
    const dividers = fixture.nativeElement.querySelectorAll('z-command-divider');
    expect(dividers.length).toBeGreaterThan(0);

    // After search, dividers should be hidden
    input.value = 'file';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const visibleDividers = fixture.nativeElement.querySelectorAll('z-command-divider > div');
    expect(visibleDividers.length).toBe(0);
  });

  it('should show correct dividers count based on visible groups', () => {
    const filteredGroups = component.filteredGroups();
    const expectedDividers = Math.max(0, filteredGroups.length - 1);

    const dividers = fixture.nativeElement.querySelectorAll('z-command-divider');
    expect(dividers.length).toBe(expectedDividers);
  });

  it('should render empty text when no results', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'nonexistent';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emptyElement = fixture.nativeElement.querySelector('z-command-empty');
    expect(emptyElement.textContent).toContain('No results found');
  });

  it('should handle case-insensitive search', () => {
    const input = fixture.nativeElement.querySelector('input');

    input.value = 'FILE';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const filteredGroups = component.filteredGroups();
    expect(filteredGroups[0].visibleOptions.length).toBe(3); // Should match all file options
  });

  it('should support configuration without shortcuts', () => {
    hostComponent.commandConfig = {
      groups: [
        {
          label: 'Simple',
          options: [
            {
              label: 'Simple Option',
              value: 'simple',
            },
          ],
        },
      ],
    };
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('z-command-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Simple Option');
  });
});
