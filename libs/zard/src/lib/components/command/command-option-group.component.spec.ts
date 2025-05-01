import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { Component } from '@angular/core';

@Component({
  template: `
    <z-command-option-group zLabel="Test Group">
      <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
      <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
    </z-command-option-group>
  `,
})
class TestHostComponent {}

describe('ZardCommandOptionGroupComponent', () => {
  let component: ZardCommandOptionGroupComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCommandOptionGroupComponent, ZardCommandOptionComponent],
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

  it('should display the group label', () => {
    const labelElement = hostElement.querySelector('.text-sm.font-semibold');
    expect(labelElement?.textContent).toBe('Test Group');
  });

  it('should contain the correct number of options', () => {
    expect(component.options().length).toBe(2);
  });
});
