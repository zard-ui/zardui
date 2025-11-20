import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header element', () => {
    const headerElement = fixture.debugElement.query(By.css('header'));
    expect(headerElement).toBeTruthy();
  });

  it('should apply default header classes', () => {
    const headerElement = fixture.debugElement.query(By.css('header')).nativeElement;
    expect(headerElement.classList.contains('flex')).toBeTruthy();
    expect(headerElement.classList.contains('items-center')).toBeTruthy();
  });

  it('should apply default height of 64px', () => {
    const headerElement = fixture.debugElement.query(By.css('header')).nativeElement;
    expect(headerElement.style.height).toBe('64px');
  });

  it('should apply custom height', () => {
    fixture.componentRef.setInput('zHeight', 80);
    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(By.css('header')).nativeElement;
    expect(headerElement.style.height).toBe('80px');
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(By.css('header')).nativeElement;
    expect(headerElement.classList.contains('custom-class')).toBeTruthy();
  });

  it('should render ng-content', () => {
    @Component({
      imports: [HeaderComponent],
      standalone: true,
      template: `<z-header>Test Header Content</z-header>`,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const headerElement = hostFixture.debugElement.query(By.css('header'));
    expect(headerElement.nativeElement.textContent).toContain('Test Header Content');
  });
});
