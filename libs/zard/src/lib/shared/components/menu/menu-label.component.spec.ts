import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { screen } from '@testing-library/angular';

import { ZardMenuLabelComponent } from './menu-label.component';

@Component({
  imports: [ZardMenuLabelComponent],
  template: `
    <z-menu-label [inset]="inset" [class]="customClass">Menu Label</z-menu-label>
  `,
})
class TestComponent {
  inset: boolean | undefined = false;
  customClass = '';
}

describe('ZardMenuLabelComponent', () => {
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

  it('renders menu label content', () => {
    expect(screen.getByText('Menu Label')).toBeInTheDocument();
  });

  it('applies default menu label styling', () => {
    const label = screen.getByText('Menu Label');

    expect(label).toHaveClass('relative');
    expect(label).toHaveClass('flex');
    expect(label).toHaveClass('items-center');
    expect(label).toHaveClass('px-2');
    expect(label).toHaveClass('py-1.5');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
    expect(label).toHaveClass('text-muted-foreground');
  });

  it('does not set data-inset attribute by default', () => {
    const label = screen.getByText('Menu Label');

    expect(label).not.toHaveAttribute('data-inset');
  });

  it('applies inset styling when inset input is true', () => {
    component.inset = true;
    fixture.detectChanges();

    const label = screen.getByText('Menu Label');

    expect(label).toHaveClass('pl-8');
    expect(label).toHaveAttribute('data-inset', 'true');
  });

  it('removes inset styling when inset input is false', () => {
    component.inset = false;
    fixture.detectChanges();

    const label = screen.getByText('Menu Label');

    expect(label).not.toHaveClass('pl-8');
    expect(label).not.toHaveAttribute('data-inset');
  });

  it('merges custom classes with variant classes', () => {
    component.customClass = 'custom-class';
    fixture.detectChanges();

    const label = screen.getByText('Menu Label');

    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('relative');
  });

  it('handles boolean attribute transformation for inset input', () => {
    component.inset = 'true' as any;
    fixture.detectChanges();

    const label = screen.getByText('Menu Label');

    expect(label).toHaveClass('pl-8');
    expect(label).toHaveAttribute('data-inset', 'true');
  });
});
