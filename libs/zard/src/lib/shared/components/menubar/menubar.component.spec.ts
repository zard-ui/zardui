import '@testing-library/jest-dom';

import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import userEvent from '@testing-library/user-event';

import { ZardDropdownService } from '@/shared/components/dropdown/dropdown.service';
import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardMenubarTriggerDirective } from './menubar-trigger.directive';
import { ZardMenubarImports } from './menubar.imports';

@Component({
  imports: [ZardMenubarImports],
  template: `
    <button type="button" data-testid="before">Before</button>

    <z-menubar data-testid="bar" [class]="barClass()">
      <button type="button" z-menubar-trigger data-testid="file" [zMenubarMenu]="fileMenu" [(zVisible)]="fileVisible">
        File
      </button>
      <button type="button" z-menubar-trigger data-testid="edit" [zMenubarMenu]="editMenu" [zDisabled]="editDisabled()">
        Edit
      </button>
      <button type="button" z-menubar-trigger data-testid="view" [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger data-testid="profiles" class="text-primary" [zMenubarMenu]="profilesMenu">
        Profiles
      </button>
    </z-menubar>

    <button type="button" data-testid="after">After</button>
    <input data-testid="outside-input" aria-label="Outside" />

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item data-testid="new-tab" (click)="selected.set('new-tab')">
        New Tab
        <z-dropdown-menu-shortcut>T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item data-testid="new-window">New Window</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu" data-testid="share">Share</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent">
        <z-dropdown-menu-item data-testid="email">Email link</z-dropdown-menu-item>
        <z-dropdown-menu-item data-testid="messages">Messages</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-item data-testid="print">Print</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent">
      <z-dropdown-menu-item data-testid="undo">Undo</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent">
      <z-dropdown-menu-checkbox-item data-testid="bookmarks" [(zChecked)]="bookmarks">
        Always Show Bookmarks
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-item data-testid="reload">Reload</z-dropdown-menu-item>
      <z-dropdown-menu-item data-testid="zoom">Zoom</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent">
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy" data-testid="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit" data-testid="benoit">Benoit</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestHostComponent {
  readonly barClass = signal('');
  readonly editDisabled = signal(false);
  readonly selected = signal('');
  fileVisible = false;
  bookmarks = false;
  profile = 'andy';
  readonly file = viewChild.required(ZardMenubarTriggerDirective);
}

@Component({
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger data-testid="first-trigger" [zMenubarMenu]="menu" [(zVisible)]="visible">
        File
      </button>
    </z-menubar>
    <z-dropdown-menu-content #menu="zDropdownMenuContent">
      <z-dropdown-menu-item>New Tab</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class InitiallyOpenHostComponent {
  readonly visible = signal(true);
}

describe('ZardMenubarComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let dropdown: ZardDropdownService;
  let user: ReturnType<typeof userEvent.setup>;

  const byId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;
  const openMenus = () => document.querySelectorAll('[data-slot="dropdown-menu-content"]');
  const flush = async () => {
    await new Promise(resolve => setTimeout(resolve, 5));
    fixture.detectChanges();
  };

  async function setup(providers: unknown[] = []) {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true },
        ...(providers as never[]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    dropdown = TestBed.inject(ZardDropdownService);
    user = userEvent.setup();
  }

  afterEach(() => {
    dropdown?.close();
    fixture?.destroy();
  });

  describe('bar', () => {
    beforeEach(() => setup());

    it('renders a horizontal menubar', () => {
      const bar = byId('bar');
      expect(bar).toHaveAttribute('role', 'menubar');
      expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
      expect(bar).toHaveAttribute('data-slot', 'menubar');
    });

    it('has the shadcn bar surface', () => {
      expect(byId('bar')).toHaveClass('flex', 'h-8', 'items-center', 'gap-0.5', 'rounded-lg', 'border', 'p-0.75');
      expect(byId('bar')).not.toHaveClass('shadow-xs', 'bg-background');
    });

    it('merges the custom class last', () => {
      host.barClass.set('h-12 rounded-md');
      fixture.detectChanges();

      expect(byId('bar')).toHaveClass('h-12', 'rounded-md');
      expect(byId('bar')).not.toHaveClass('h-8', 'rounded-lg');
    });
  });

  describe('trigger attributes', () => {
    beforeEach(() => setup());

    it('exposes the menuitem semantics of a menubar trigger', () => {
      const file = byId('file');
      expect(file).toHaveAttribute('role', 'menuitem');
      expect(file).toHaveAttribute('aria-haspopup', 'menu');
      expect(file).toHaveAttribute('aria-expanded', 'false');
      expect(file).toHaveAttribute('data-state', 'closed');
      expect(file).toHaveAttribute('data-slot', 'menubar-trigger');
    });

    it('has the shadcn trigger styling including the open state', () => {
      expect(byId('file')).toHaveClass('rounded-sm', 'px-1.5', 'py-0.5', 'text-sm', 'font-medium');
      expect(byId('file')).toHaveClass('hover:bg-muted', 'focus-visible:bg-muted', 'aria-expanded:bg-muted');
    });

    it('reflects the open menu in aria-expanded and data-state', async () => {
      await user.click(byId('file'));
      fixture.detectChanges();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('file')).toHaveAttribute('data-state', 'open');
      expect(byId('view')).toHaveAttribute('aria-expanded', 'false');
    });

    it('marks a disabled trigger', () => {
      host.editDisabled.set(true);
      fixture.detectChanges();

      expect(byId('edit')).toHaveAttribute('aria-disabled', 'true');
      expect(byId('edit')).toHaveAttribute('data-disabled');
      expect(byId('edit')).toBeDisabled();
      expect(byId('file')).not.toHaveAttribute('aria-disabled');
    });

    it('merges the custom class of the trigger after the variants', () => {
      expect(byId('profiles')).toHaveClass('text-primary', 'rounded-sm', 'px-1.5');
    });
  });

  describe('roving tabindex', () => {
    beforeEach(() => setup());

    it('keeps a single tab stop: the first trigger', () => {
      expect(byId('file')).toHaveAttribute('tabindex', '0');
      expect(byId('edit')).toHaveAttribute('tabindex', '-1');
      expect(byId('view')).toHaveAttribute('tabindex', '-1');
      expect(byId('profiles')).toHaveAttribute('tabindex', '-1');
    });

    it('moves the tab stop to the focused trigger', () => {
      byId('view').focus();
      fixture.detectChanges();

      expect(byId('view')).toHaveAttribute('tabindex', '0');
      expect(byId('file')).toHaveAttribute('tabindex', '-1');
    });

    it('falls back to the first enabled trigger when the active one is disabled', () => {
      byId('edit').focus();
      host.editDisabled.set(true);
      fixture.detectChanges();

      expect(byId('edit')).toHaveAttribute('tabindex', '-1');
      expect(byId('file')).toHaveAttribute('tabindex', '0');
    });

    it('leaves the bar with Tab', async () => {
      byId('file').focus();
      await user.tab();
      expect(byId('after')).toHaveFocus();

      await user.tab({ shift: true });
      expect(byId('file')).toHaveFocus();
      await user.tab({ shift: true });
      expect(byId('before')).toHaveFocus();
    });
  });

  describe('pointer', () => {
    beforeEach(() => setup());

    it('opens the menu on click and closes it on a second click', async () => {
      await user.click(byId('file'));
      await flush();
      expect(openMenus()).toHaveLength(1);
      expect(byId('new-tab')).toBeInTheDocument();

      await user.click(byId('file'));
      await flush();
      expect(openMenus()).toHaveLength(0);
    });

    it('does not open a disabled trigger', async () => {
      host.editDisabled.set(true);
      fixture.detectChanges();

      byId('edit').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await flush();

      expect(openMenus()).toHaveLength(0);
    });

    it('keeps the menu surface focused (not a row) after a pointer opening', async () => {
      await user.click(byId('file'));
      await flush();

      expect(document.activeElement).toHaveAttribute('role', 'menu');
    });

    it('does nothing when a trigger is hovered while no menu is open', async () => {
      byId('view').dispatchEvent(new MouseEvent('mouseenter'));
      await flush();

      expect(openMenus()).toHaveLength(0);
    });

    it('switches the open menu instantly when a sibling trigger is hovered', async () => {
      await user.click(byId('file'));
      await flush();

      byId('view').dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(openMenus()).toHaveLength(1);
      expect(byId('view')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('file')).toHaveAttribute('aria-expanded', 'false');
      expect(byId('bookmarks')).toBeInTheDocument();
      expect(byId('new-tab')).toBeNull();
    });

    it('skips a disabled sibling when hovering', async () => {
      host.editDisabled.set(true);
      fixture.detectChanges();
      await user.click(byId('file'));
      await flush();

      byId('edit').dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('edit')).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on an outside click', async () => {
      await user.click(byId('file'));
      await flush();

      await user.click(byId('after'));
      await flush();

      expect(openMenus()).toHaveLength(0);
      expect(byId('file')).toHaveAttribute('aria-expanded', 'false');
    });

    it('moves from one menu to another by clicking a sibling trigger', async () => {
      await user.click(byId('file'));
      await flush();
      // A bare click: with a real pointer, hovering the trigger would already have switched to it.
      byId('view').click();
      await flush();

      expect(byId('view')).toHaveAttribute('aria-expanded', 'true');
      expect(openMenus()).toHaveLength(1);
    });

    it('closes after an item is selected and hands the focus back to the trigger', async () => {
      await user.click(byId('file'));
      await flush();

      await user.click(byId('new-tab'));
      await flush();

      expect(host.selected()).toBe('new-tab');
      expect(openMenus()).toHaveLength(0);
      expect(byId('file')).toHaveFocus();
    });
  });

  describe('keyboard on the bar', () => {
    beforeEach(() => setup());

    it('moves between triggers with the arrow keys, skipping disabled ones and wrapping', async () => {
      host.editDisabled.set(true);
      fixture.detectChanges();
      byId('file').focus();

      await user.keyboard('{ArrowRight}');
      expect(byId('view')).toHaveFocus();
      await user.keyboard('{ArrowRight}{ArrowRight}');
      expect(byId('file')).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(byId('profiles')).toHaveFocus();
    });

    it('jumps to the edges with Home and End', async () => {
      byId('view').focus();

      await user.keyboard('{End}');
      expect(byId('profiles')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(byId('file')).toHaveFocus();
    });

    it('does not open a menu when only moving', async () => {
      byId('file').focus();
      await user.keyboard('{ArrowRight}');
      await flush();

      expect(openMenus()).toHaveLength(0);
    });

    it.each(['{ArrowDown}', '{Enter}', ' '])('opens with %s and focuses the first item', async key => {
      byId('file').focus();
      await user.keyboard(key);
      await flush();

      expect(openMenus()).toHaveLength(1);
      expect(byId('new-tab')).toHaveFocus();
      expect(byId('new-tab')).toHaveAttribute('data-highlighted');
      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
    });

    it('opens with ArrowUp and focuses the last item', async () => {
      byId('file').focus();
      await user.keyboard('{ArrowUp}');
      await flush();

      expect(byId('print')).toHaveFocus();
    });

    it('does not toggle the menu back through the click Enter would synthesize', async () => {
      byId('file').focus();
      await user.keyboard('{Enter}');
      await flush();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
    });

    it('ignores the keys on a disabled trigger', async () => {
      host.editDisabled.set(true);
      fixture.detectChanges();
      byId('edit').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await flush();

      expect(openMenus()).toHaveLength(0);
    });

    it('closes the open menu on Tab while the trigger keeps the focus', async () => {
      await user.click(byId('file'));
      await flush();
      byId('file').focus();

      await user.tab();
      await flush();

      expect(openMenus()).toHaveLength(0);
      expect(byId('after')).toHaveFocus();
    });

    it('switches the open menu with the arrows while the trigger has the focus', async () => {
      byId('file').focus();
      await user.keyboard('{ArrowDown}');
      await flush();
      byId('file').focus();

      await user.keyboard('{ArrowRight}');
      await flush();

      expect(byId('edit')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('file')).toHaveAttribute('aria-expanded', 'false');
      expect(byId('undo')).toHaveFocus();
    });
  });

  describe('keyboard inside a menu', () => {
    beforeEach(async () => {
      await setup();
      byId('file').focus();
      await user.keyboard('{ArrowDown}');
      await flush();
    });

    it('moves through the rows with the vertical arrows', async () => {
      await user.keyboard('{ArrowDown}');
      expect(byId('new-window')).toHaveFocus();
      await user.keyboard('{ArrowUp}{ArrowUp}');
      expect(byId('print')).toHaveFocus();
    });

    it('jumps to a row by typing its first letter', async () => {
      await user.keyboard('p');
      expect(byId('print')).toHaveFocus();
    });

    it('switches to the next menu with ArrowRight and opens on its first item', async () => {
      await user.keyboard('{ArrowRight}');
      await flush();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'false');
      expect(byId('edit')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('undo')).toHaveFocus();
    });

    it('switches to the previous menu with ArrowLeft, wrapping and skipping disabled ones', async () => {
      host.editDisabled.set(true);
      fixture.detectChanges();

      await user.keyboard('{ArrowLeft}');
      await flush();

      expect(byId('profiles')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('andy')).toHaveFocus();
    });

    it('lets ArrowRight open a submenu instead of switching menus', async () => {
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(byId('share')).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      await flush();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('email')).toHaveFocus();
    });

    it('lets ArrowLeft close a submenu instead of switching menus', async () => {
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
      await flush();
      expect(byId('email')).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      await flush();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('share')).toHaveFocus();
      expect(byId('email')).toBeNull();
    });

    it('switches menus with ArrowRight from a leaf of a submenu', async () => {
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
      await flush();

      await user.keyboard('{ArrowRight}');
      await flush();

      expect(byId('edit')).toHaveAttribute('aria-expanded', 'true');
      expect(byId('email')).toBeNull();
    });

    it('closes on Escape and returns the focus to the trigger', async () => {
      await user.keyboard('{Escape}');
      await flush();

      expect(openMenus()).toHaveLength(0);
      expect(byId('file')).toHaveFocus();
      expect(byId('file')).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Tab and leaves the bar', async () => {
      await user.tab();
      await flush();

      expect(openMenus()).toHaveLength(0);
      expect(byId('after')).toHaveFocus();
    });

    it('leaves the keys of an unrelated focused control alone while a menu is open', async () => {
      const input = byId('outside-input');
      input.focus();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
      await flush();

      expect(openMenus()).toHaveLength(1);
      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveFocus();
    });

    it('closes on Shift+Tab and moves before the bar', async () => {
      await user.tab({ shift: true });
      await flush();

      expect(openMenus()).toHaveLength(0);
      expect(byId('before')).toHaveFocus();
    });

    it('closes on Tab from inside a submenu too', async () => {
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
      await flush();

      await user.tab();
      await flush();

      expect(openMenus()).toHaveLength(0);
      expect(document.querySelector('[data-slot="dropdown-menu-sub-content"]')).toBeNull();
      expect(byId('after')).toHaveFocus();
    });

    it('selects a row with Enter, closing the menu and focusing the trigger', async () => {
      await user.keyboard('{Enter}');
      await flush();

      expect(host.selected()).toBe('new-tab');
      expect(openMenus()).toHaveLength(0);
      expect(byId('file')).toHaveFocus();
    });
  });

  describe('menu primitives inside the bar', () => {
    beforeEach(() => setup());

    it('renders the dropdown rows with their own roles', async () => {
      await user.click(byId('view'));
      await flush();

      expect(byId('bookmarks')).toHaveAttribute('role', 'menuitemcheckbox');
      expect(byId('reload')).toHaveAttribute('role', 'menuitem');
    });

    it('toggles a checkbox item', async () => {
      await user.click(byId('view'));
      await flush();
      expect(byId('bookmarks')).toHaveAttribute('aria-checked', 'false');

      await user.click(byId('bookmarks'));
      await flush();

      expect(host.bookmarks).toBe(true);
    });

    it('selects a radio item', async () => {
      await user.click(byId('profiles'));
      await flush();
      expect(byId('andy')).toHaveAttribute('aria-checked', 'true');

      await user.click(byId('benoit'));
      await flush();

      expect(host.profile).toBe('benoit');
    });

    it('opens a submenu on hover', async () => {
      await user.click(byId('file'));
      await flush();

      byId('share').dispatchEvent(new MouseEvent('mouseenter'));
      await flush();

      expect(byId('email')).toBeInTheDocument();
    });

    it('closes the submenu when the menu is switched', async () => {
      await user.click(byId('file'));
      await flush();
      byId('share').dispatchEvent(new MouseEvent('mouseenter'));
      await flush();

      byId('view').dispatchEvent(new MouseEvent('mouseenter'));
      await flush();

      expect(byId('email')).toBeNull();
    });
  });

  describe('zVisible', () => {
    beforeEach(() => setup());

    it('opens the menu when it is written to true', async () => {
      host.file().zVisible.set(true);
      fixture.detectChanges();
      await flush();

      expect(byId('file')).toHaveAttribute('aria-expanded', 'true');
      expect(openMenus()).toHaveLength(1);
    });

    it('closes the menu when it is written to false', async () => {
      host.file().zVisible.set(true);
      fixture.detectChanges();
      await flush();

      host.file().zVisible.set(false);
      fixture.detectChanges();
      await flush();

      expect(openMenus()).toHaveLength(0);
    });

    it('follows the open state of the menu in both directions', async () => {
      await user.click(byId('file'));
      await flush();
      expect(host.file().zVisible()).toBe(true);
      expect(host.fileVisible).toBe(true);

      await user.keyboard('{Escape}');
      await flush();
      expect(host.file().zVisible()).toBe(false);
      expect(host.fileVisible).toBe(false);
    });

    it('goes back to false for the menu a sibling switch replaced', async () => {
      host.file().zVisible.set(true);
      fixture.detectChanges();
      await flush();

      byId('view').dispatchEvent(new MouseEvent('mouseenter'));
      await flush();

      expect(host.file().zVisible()).toBe(false);
    });

    it('does not open a disabled trigger written to true', async () => {
      host.editDisabled.set(true);
      fixture.detectChanges();
      fixture.debugElement
        .query(el => el.nativeElement === byId('edit'))
        .injector.get(ZardMenubarTriggerDirective)
        .zVisible.set(true);
      fixture.detectChanges();
      await flush();

      expect(openMenus()).toHaveLength(0);
    });
  });

  describe('zVisible bound to true from the start', () => {
    it('opens the menu instead of being reset to false', async () => {
      await TestBed.configureTestingModule({
        imports: [InitiallyOpenHostComponent],
        providers: [{ provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true }],
      }).compileComponents();
      const open = TestBed.createComponent(InitiallyOpenHostComponent);
      open.detectChanges();
      await open.whenStable();
      await new Promise(resolve => setTimeout(resolve, 5));
      open.detectChanges();

      expect(open.componentInstance.visible()).toBe(true);
      expect(document.querySelectorAll('[data-slot="dropdown-menu-content"]')).toHaveLength(1);
      expect(document.querySelector('[data-testid="first-trigger"]')).toHaveAttribute('aria-expanded', 'true');

      TestBed.inject(ZardDropdownService).close();
      open.destroy();
    });
  });

  describe('lifecycle', () => {
    beforeEach(() => setup());

    it('closes the open menu when the bar is destroyed', async () => {
      await user.click(byId('file'));
      await flush();

      fixture.destroy();

      expect(openMenus()).toHaveLength(0);
      expect(dropdown.isOpen()).toBe(false);
    });
  });
});

describe('ZardMenubarComponent in RTL', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let user: ReturnType<typeof userEvent.setup>;
  const byId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true },
        {
          provide: Directionality,
          useValue: {
            value: 'rtl',
            change: {
              subscribe: () => ({ unsubscribe: () => undefined }),
              pipe: () => ({ subscribe: () => undefined }),
            },
            ngOnDestroy: () => undefined,
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    user = userEvent.setup();
  });

  afterEach(() => {
    TestBed.inject(ZardDropdownService).close();
    fixture.destroy();
  });

  it('inverts the arrows: ArrowLeft goes to the next trigger', async () => {
    byId('file').focus();

    await user.keyboard('{ArrowLeft}');
    expect(byId('edit')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(byId('file')).toHaveFocus();
  });
});
