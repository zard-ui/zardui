import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardFloatLabelComponent } from './float.label.component';

describe('ZardFloatLabelComponent', () => {
  let component: ZardFloatLabelComponent;
  let fixture: ComponentFixture<ZardFloatLabelComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardFloatLabelComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardFloatLabelComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply base host classes', () => {
    expect(nativeElement.classList).toContain('relative');
    expect(nativeElement.classList).toContain('block');
  });

  it('should apply label base styles via [&>label]', () => {
    const label = document.createElement('label');
    label.textContent = 'Test Label';
    nativeElement.appendChild(label);
    fixture.detectChanges();

    const computedStyle = getComputedStyle(label);
    expect(computedStyle.position).toBe('absolute');
    expect(computedStyle.left).toBe('1rem');
    expect(computedStyle.top).toBe('50%');
    expect(computedStyle.transform).toContain('translateY(-50%)');
    expect(computedStyle.pointerEvents).toBe('none');
    expect(computedStyle.transition).toContain('0.2s');
    expect(computedStyle.fontSize).toBe('14px');
    expect(computedStyle.lineHeight).toBe('1');
    expect(computedStyle.zIndex).toBe('10');
  });

  it('should float label on input focus', () => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    label.textContent = 'Focus Me';
    nativeElement.appendChild(input);
    nativeElement.appendChild(label);
    fixture.detectChanges();

    input.focus();
    fixture.detectChanges();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.top).toBe('0.5rem');
    expect(labelStyle.fontSize).toBe('12px');
  });

  it('should float label when input has value', () => {
    const input = document.createElement('input');
    input.value = 'Hello';
    const label = document.createElement('label');
    label.textContent = 'Has Value';
    nativeElement.appendChild(input);
    nativeElement.appendChild(label);

    component.ngAfterViewInit();
    fixture.detectChanges();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.top).toBe('0.5rem');
    expect(labelStyle.fontSize).toBe('12px');
  });

  it('should add input-has-value class on input with value', () => {
    const input = document.createElement('input');
    input.value = 'test';
    nativeElement.appendChild(input);
    nativeElement.appendChild(document.createElement('label'));

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(input.classList).toContain('input-has-value');
  });

  it('should remove input-has-value when value is cleared', () => {
    const input = document.createElement('input');
    input.value = 'test';
    nativeElement.appendChild(input);
    nativeElement.appendChild(document.createElement('label'));

    component.ngAfterViewInit();
    fixture.detectChanges();

    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.classList).not.toContain('input-has-value');
  });

  it('should apply destructive state styles when input has border-destructive', () => {
    const input = document.createElement('input');
    input.classList.add('border-destructive');
    const label = document.createElement('label');
    nativeElement.appendChild(input);
    nativeElement.appendChild(label);
    fixture.detectChanges();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.top).toBe('0.5rem');
    expect(labelStyle.fontSize).toBe('12px');
  });

  it('should apply warning state styles when input has border-warning', () => {
    const input = document.createElement('input');
    input.classList.add('border-warning');
    const label = document.createElement('label');
    nativeElement.appendChild(input);
    nativeElement.appendChild(label);
    fixture.detectChanges();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.top).toBe('0.5rem');
    expect(labelStyle.fontSize).toBe('12px');
  });

  it('should apply success state styles when input has border-success', () => {
    const input = document.createElement('input');
    input.classList.add('border-success');
    const label = document.createElement('label');
    nativeElement.appendChild(input);
    nativeElement.appendChild(label);
    fixture.detectChanges();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.top).toBe('0.5rem');
    expect(labelStyle.fontSize).toBe('12px');
  });

  it('should respect custom class input', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    expect(nativeElement.classList).toContain('custom-class');
  });

  it('should not run updateLabelState on server', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ZardFloatLabelComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverFixture = TestBed.createComponent(ZardFloatLabelComponent);
    const serverComponent = serverFixture.componentInstance;

    const spy = jest.spyOn(serverComponent as never, 'updateLabelState');
    serverComponent.ngAfterViewInit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle textarea and button with value', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'text';
    const button = document.createElement('button');
    button.setAttribute('value', 'Click');
    const label = document.createElement('label');

    nativeElement.appendChild(textarea);
    nativeElement.appendChild(button);
    nativeElement.appendChild(label);

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(textarea.classList).toContain('input-has-value');
    expect(button.classList).toContain('input-has-value');

    textarea.value = '';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(textarea.classList).not.toContain('input-has-value');
  });

  it('should trigger update on input, focus, and blur events', () => {
    const input = document.createElement('input');
    nativeElement.appendChild(input);
    nativeElement.appendChild(document.createElement('label'));

    const spy = jest.spyOn(component as never, 'updateLabelState');

    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));

    expect(spy).toHaveBeenCalledTimes(3);
  });
});
