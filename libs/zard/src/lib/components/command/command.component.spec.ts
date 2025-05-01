import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCommandComponent } from './command.component';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { Component } from '@angular/core';

@Component({
  template: `
    <z-command>
      <z-command-option-group zLabel="Test Group">
        <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
        <z-command-option zLabel="Option 2" zValue="2" zDisabled="true"></z-command-option>
      </z-command-option-group>
    </z-command>
  `,
})
class TestHostComponent {}

describe('ZardCommandComponent', () => {
  let component: ZardCommandComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCommandComponent, ZardCommandOptionGroupComponent, ZardCommandOptionComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostElement = fixture.nativeElement;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default placeholder', () => {
    const input = hostElement.querySelector('input');
    expect(input?.placeholder).toBe('Type a command or search...');
  });

  it('should initialize options from groups', () => {
    expect(component['options']().length).toBe(2);
  });

  it('should navigate options with arrow keys', () => {
    const input = hostElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component['selectedIndex']()).toBe(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component['selectedIndex']()).toBe(1);
  });

  it('should emit selection on enter', () => {
    const selectSpy = jest.spyOn(component.zOnSelect, 'emit');
    const input = hostElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(selectSpy).toHaveBeenCalledWith(expect.objectContaining({ value: '1' }));
  });

  it('should not emit selection for disabled options', () => {
    const selectSpy = jest.spyOn(component.zOnSelect, 'emit');
    const input = hostElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(selectSpy).not.toHaveBeenCalled();
  });
});
