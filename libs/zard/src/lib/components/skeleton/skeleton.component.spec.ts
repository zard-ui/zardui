import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { ZardSkeletonComponent } from './skeleton.component';

@Component({
  template: `<z-skeleton class="h-4 w-4 rounded" />`,
  standalone: true,
  imports: [ZardSkeletonComponent],
})
class TestSkeletonHostComponent {}

describe('ZardSkeleton Integration', () => {
  let fixture: ComponentFixture<TestSkeletonHostComponent>;
  let component: TestSkeletonHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSkeletonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSkeletonHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(component).toBeDefined();
  });

  it('should render the z-skeleton component', () => {
    const skeleton = fixture.debugElement.query(By.directive(ZardSkeletonComponent));
    expect(skeleton).not.toBeNull();
  });

  it('should apply class "block" to the host element', () => {
    const hostElement = fixture.debugElement.query(By.directive(ZardSkeletonComponent)).nativeElement;
    expect(hostElement.classList.contains('block')).toBe(true);
  });

  it('should apply projected classes to internal div', () => {
    const internalDiv = fixture.nativeElement.querySelector('z-skeleton > div');
    expect(internalDiv).not.toBeNull();
    expect(internalDiv.className).toContain('h-4');
    expect(internalDiv.className).toContain('w-4');
    expect(internalDiv.className).toContain('rounded');
  });
});
