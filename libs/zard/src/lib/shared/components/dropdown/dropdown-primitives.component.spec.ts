import { Component } from '@angular/core';
import { fakeAsync, flush, type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core';

import {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from './dropdown-primitives.component';
import { ZardDropdownService } from './dropdown.service';

@Component({
  imports: [
    ZardDropdownMenuCheckboxItemComponent,
    ZardDropdownMenuGroupComponent,
    ZardDropdownMenuRadioGroupComponent,
    ZardDropdownMenuRadioItemComponent,
    ZardDropdownMenuSeparatorComponent,
    ZardDropdownMenuShortcutComponent,
  ],
  template: `
    <div z-dropdown-menu-group>
      <z-dropdown-menu-checkbox-item [(zChecked)]="statusBar">Status Bar</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-radio-group [(zValue)]="panelPosition">
        <z-dropdown-menu-radio-item zValue="top">Top</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="bottom">Bottom</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
    </div>
  `,
})
class DropdownPrimitivesHostComponent {
  statusBar = true;
  panelPosition = 'bottom';
}

describe('Dropdown menu primitives', () => {
  let fixture: ComponentFixture<DropdownPrimitivesHostComponent>;
  let component: DropdownPrimitivesHostComponent;

  beforeEach(async () => {
    const mockDropdownService = {
      closeAndFocusTrigger: jest.fn(),
    } as unknown as jest.Mocked<ZardDropdownService>;

    await TestBed.configureTestingModule({
      imports: [DropdownPrimitivesHostComponent],
      providers: [
        {
          provide: ZardDropdownService,
          useValue: mockDropdownService,
        },
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownPrimitivesHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sets shadcn-aligned static roles and data slots', () => {
    const group = fixture.nativeElement.querySelector('[z-dropdown-menu-group]');
    const separator = fixture.nativeElement.querySelector('z-dropdown-menu-separator');
    const shortcut = fixture.nativeElement.querySelector('z-dropdown-menu-shortcut');

    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAttribute('data-slot', 'dropdown-menu-group');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('data-slot', 'dropdown-menu-separator');
    expect(shortcut).toHaveAttribute('aria-hidden', 'true');
    expect(shortcut).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
  });

  it('toggles checkbox items with menuitemcheckbox semantics', fakeAsync(() => {
    const checkboxItem = fixture.nativeElement.querySelector('z-dropdown-menu-checkbox-item');

    expect(checkboxItem).toHaveAttribute('role', 'menuitemcheckbox');
    expect(checkboxItem).toHaveAttribute('aria-checked', 'true');

    checkboxItem.click();
    flush();
    fixture.detectChanges();

    expect(component.statusBar).toBe(false);
    expect(checkboxItem).toHaveAttribute('aria-checked', 'false');
  }));

  it('selects radio items with menuitemradio semantics', fakeAsync(() => {
    const radioItems = fixture.nativeElement.querySelectorAll('z-dropdown-menu-radio-item');

    expect(radioItems[0]).toHaveAttribute('role', 'menuitemradio');
    expect(radioItems[0]).toHaveAttribute('aria-checked', 'false');
    expect(radioItems[1]).toHaveAttribute('aria-checked', 'true');

    radioItems[0].click();
    flush();
    fixture.detectChanges();

    expect(component.panelPosition).toBe('top');
    expect(radioItems[0]).toHaveAttribute('aria-checked', 'true');
    expect(radioItems[1]).toHaveAttribute('aria-checked', 'false');
  }));
});
