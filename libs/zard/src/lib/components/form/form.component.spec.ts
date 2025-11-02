import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ZardFormFieldComponent,
  ZardFormControlComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent,
} from './form.component';

describe('ZardFormFieldComponent', () => {
  let component: ZardFormFieldComponent;
  let fixture: ComponentFixture<ZardFormFieldComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormFieldComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default classes', () => {
    expect(nativeElement.className).toContain('grid');
    expect(nativeElement.className).toContain('gap-2');
  });

  it('should merge custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('custom-class');
  });

  it('should project content', () => {
    const compiled = fixture.nativeElement;
    const content = document.createElement('span');
    content.textContent = 'Test content';
    compiled.appendChild(content);
    expect(compiled.textContent).toContain('Test content');
  });
});

describe('ZardFormControlComponent', () => {
  let component: ZardFormControlComponent;
  let fixture: ComponentFixture<ZardFormControlComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormControlComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should merge custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-control-class');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('custom-control-class');
  });

  it('should display error message when provided', () => {
    fixture.componentRef.setInput('errorMessage', 'This field is required');
    fixture.detectChanges();
    const errorElement = nativeElement.querySelector('.text-red-500');
    expect(errorElement).toBeTruthy();
    expect(errorElement?.textContent).toContain('This field is required');
  });

  it('should display help text when provided and no error', () => {
    fixture.componentRef.setInput('helpText', 'Enter your name');
    fixture.detectChanges();
    const helpElement = nativeElement.querySelector('.text-muted-foreground');
    expect(helpElement).toBeTruthy();
    expect(helpElement?.textContent).toContain('Enter your name');
  });

  it('should prioritize error message over help text', () => {
    fixture.componentRef.setInput('errorMessage', 'Error message');
    fixture.componentRef.setInput('helpText', 'Help text');
    fixture.detectChanges();
    const errorElement = nativeElement.querySelector('.text-red-500');
    const helpElement = nativeElement.querySelector('.text-muted-foreground');
    expect(errorElement).toBeTruthy();
    expect(helpElement).toBeFalsy();
  });

  it('should project content', () => {
    const compiled = fixture.nativeElement;
    const content = document.createElement('input');
    compiled.querySelector('.relative')?.appendChild(content);
    expect(compiled.querySelector('input')).toBeTruthy();
  });
});

describe('ZardFormLabelComponent', () => {
  let component: ZardFormLabelComponent;
  let fixture: ComponentFixture<ZardFormLabelComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormLabelComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default label classes', () => {
    expect(nativeElement.className).toContain('text-sm');
    expect(nativeElement.className).toContain('font-medium');
    expect(nativeElement.className).toContain('leading-none');
  });

  it('should add required indicator when zRequired is true', () => {
    fixture.componentRef.setInput('zRequired', true);
    fixture.detectChanges();
    expect(nativeElement.className).toContain("after:content-['*']");
    expect(nativeElement.className).toContain('after:ml-0.5');
    expect(nativeElement.className).toContain('after:text-red-500');
  });

  it('should not add required indicator when zRequired is false', () => {
    fixture.componentRef.setInput('zRequired', false);
    fixture.detectChanges();
    expect(nativeElement.className).not.toContain("after:content-['*']");
  });

  it('should handle string input for zRequired', () => {
    // Empty string is transformed to true by the transform function
    fixture.componentRef.setInput('zRequired', '');
    fixture.detectChanges();
    expect(nativeElement.className).toContain("after:content-['*']");
    expect(nativeElement.className).toContain('after:ml-0.5');
    expect(nativeElement.className).toContain('after:text-red-500');
  });

  it('should merge custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-label-class');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('custom-label-class');
  });

  it('should project content', () => {
    const compiled = fixture.nativeElement;
    const content = document.createTextNode('Label text');
    compiled.appendChild(content);
    expect(compiled.textContent).toContain('Label text');
  });
});

describe('ZardFormMessageComponent', () => {
  let component: ZardFormMessageComponent;
  let fixture: ComponentFixture<ZardFormMessageComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFormMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFormMessageComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default message classes', () => {
    expect(nativeElement.className).toContain('text-sm');
    expect(nativeElement.className).toContain('text-muted-foreground');
  });

  it('should apply error type classes', () => {
    fixture.componentRef.setInput('zType', 'error');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('text-red-500');
    expect(nativeElement.className).not.toContain('text-muted-foreground');
  });

  it('should apply success type classes', () => {
    fixture.componentRef.setInput('zType', 'success');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('text-green-500');
    expect(nativeElement.className).not.toContain('text-muted-foreground');
  });

  it('should apply warning type classes', () => {
    fixture.componentRef.setInput('zType', 'warning');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('text-yellow-500');
    expect(nativeElement.className).not.toContain('text-muted-foreground');
  });

  it('should apply default type classes when type is default', () => {
    fixture.componentRef.setInput('zType', 'default');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('text-muted-foreground');
  });

  it('should merge custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-message-class');
    fixture.detectChanges();
    expect(nativeElement.className).toContain('custom-message-class');
  });

  it('should project content', () => {
    const compiled = fixture.nativeElement;
    const content = document.createTextNode('Error message');
    compiled.appendChild(content);
    expect(compiled.textContent).toContain('Error message');
  });
});
