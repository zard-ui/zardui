import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { screen } from '@testing-library/angular';

import { ZardMenuShortcutComponent } from './menu-shortcut.component';

@Component({
  imports: [ZardMenuShortcutComponent],
  template: `
    <z-menu-shortcut [class]="customClass">Ctrl+S</z-menu-shortcut>
  `,
})
class TestComponent {
  customClass = '';
}

describe('ZardMenuShortcutComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders menu shortcut content', () => {
    expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
  });

  it('applies default menu shortcut styling', () => {
    const shortcut = screen.getByText('Ctrl+S');

    expect(shortcut).toHaveClass('ml-auto');
    expect(shortcut).toHaveClass('text-xs');
    expect(shortcut).toHaveClass('tracking-widest');
    expect(shortcut).toHaveClass('text-muted-foreground');
  });

  it('merges custom classes with variant classes', () => {
    component.customClass = 'custom-shortcut';
    fixture.detectChanges();

    const shortcut = screen.getByText('Ctrl+S');

    expect(shortcut).toHaveClass('custom-shortcut');
    expect(shortcut).toHaveClass('ml-auto');
  });
});
