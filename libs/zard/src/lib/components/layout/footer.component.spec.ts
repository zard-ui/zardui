import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer element', () => {
    const footerElement = fixture.debugElement.query(By.css('footer'));
    expect(footerElement).toBeTruthy();
  });

  it('should apply default footer classes', () => {
    const footerElement = fixture.debugElement.query(By.css('footer')).nativeElement;
    expect(footerElement.classList.contains('flex')).toBeTruthy();
    expect(footerElement.classList.contains('items-center')).toBeTruthy();
  });

  it('should apply default height of 64px', () => {
    const footerElement = fixture.debugElement.query(By.css('footer')).nativeElement;
    expect(footerElement.style.height).toBe('64px');
  });

  it('should apply custom height', () => {
    fixture.componentRef.setInput('zHeight', 100);
    fixture.detectChanges();

    const footerElement = fixture.debugElement.query(By.css('footer')).nativeElement;
    expect(footerElement.style.height).toBe('100px');
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const footerElement = fixture.debugElement.query(By.css('footer')).nativeElement;
    expect(footerElement.classList.contains('custom-class')).toBeTruthy();
  });

  it('should render ng-content', () => {
    @Component({
      imports: [FooterComponent],
      standalone: true,
      template: `<z-footer>Test Footer Content</z-footer>`,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const footerElement = hostFixture.debugElement.query(By.css('footer'));
    expect(footerElement.nativeElement.textContent).toContain('Test Footer Content');
  });
});
