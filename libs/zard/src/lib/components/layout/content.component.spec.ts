import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render main element', () => {
    const mainElement = fixture.debugElement.query(By.css('main'));
    expect(mainElement).toBeTruthy();
  });

  it('should apply default content classes', () => {
    const element = fixture.nativeElement;
    expect(element.classList.contains('flex-1')).toBeTruthy();
    expect(element.classList.contains('overflow-auto')).toBeTruthy();
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.classList.contains('custom-class')).toBeTruthy();
  });

  it('should render ng-content inside main element', () => {
    @Component({
      imports: [ContentComponent],
      standalone: true,
      template: `<z-content>Test Content</z-content>`,
    })
    class TestHostComponent {}

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const mainElement = hostFixture.debugElement.query(By.css('main'));
    expect(mainElement.nativeElement.textContent).toContain('Test Content');
  });
});
