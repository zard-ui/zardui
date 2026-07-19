import { type ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ZardSelectGroupComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
} from './select-group.component';

describe('Select group primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders a select group with group semantics', async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSelectGroupComponent],
    }).compileComponents();

    const fixture: ComponentFixture<ZardSelectGroupComponent> = TestBed.createComponent(ZardSelectGroupComponent);
    fixture.componentRef.setInput('class', 'custom-group');
    fixture.detectChanges();

    const hostElement = fixture.nativeElement as HTMLElement;
    expect(hostElement).toHaveAttribute('data-slot', 'select-group');
    expect(hostElement).toHaveAttribute('role', 'group');
    expect(hostElement).toHaveClass('custom-group');
  });

  it('renders a select label with muted text styles', async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSelectLabelComponent],
    }).compileComponents();

    const fixture: ComponentFixture<ZardSelectLabelComponent> = TestBed.createComponent(ZardSelectLabelComponent);
    fixture.detectChanges();

    const hostElement = fixture.nativeElement as HTMLElement;
    expect(hostElement).toHaveAttribute('data-slot', 'select-label');
    expect(hostElement).toHaveClass('text-xs');
    expect(hostElement).toHaveClass('text-muted-foreground');
  });

  it('renders a select separator with separator semantics', async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSelectSeparatorComponent],
    }).compileComponents();

    const fixture: ComponentFixture<ZardSelectSeparatorComponent> =
      TestBed.createComponent(ZardSelectSeparatorComponent);
    fixture.detectChanges();

    const hostElement = fixture.nativeElement as HTMLElement;
    expect(hostElement).toHaveAttribute('data-slot', 'select-separator');
    expect(hostElement).toHaveAttribute('role', 'separator');
    expect(hostElement).toHaveClass('block');
    expect(hostElement).toHaveClass('h-px');
    expect(hostElement).toHaveClass('bg-border');
  });
});
