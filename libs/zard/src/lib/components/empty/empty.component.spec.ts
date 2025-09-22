import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ZardEmptyComponent } from './empty.component';

@Component({
  template: `
    <z-empty [zImage]="image" [zImageStyle]="imageStyle" [zDescription]="description" [zSize]="size" [class]="customClass"></z-empty>

    <ng-template #tpl>Template Content</ng-template>
  `,
  standalone: true,
  imports: [ZardEmptyComponent],
})
class TestHostComponent {
  image?: string | TemplateRef<unknown>;
  imageStyle: Record<string, string> = {};
  description: string | TemplateRef<unknown> = 'No data';
  size: 'default' | 'small' = 'default';
  customClass = '';

  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<unknown>;
}

describe('ZardEmptyComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const comp = fixture.debugElement.query(By.directive(ZardEmptyComponent));
    expect(comp).toBeTruthy();
  });

  it('should render default svg when no zImage is provided', () => {
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg).toBeTruthy();
  });

  it('should render an <img> when zImage is string URL', () => {
    host.image = 'https://example.com/test.png';
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.getAttribute('src')).toBe('https://example.com/test.png');
  });

  it('should render ng-template when zImage is TemplateRef', () => {
    host.image = host.tpl;
    fixture.detectChanges();

    const templateContent = fixture.debugElement.nativeElement.textContent;
    expect(templateContent).toContain('Template Content');
  });

  it('should render default description when none is provided', () => {
    host.description = 'No data';
    fixture.detectChanges();

    const desc = fixture.debugElement.query(By.css('p'));
    expect(desc.nativeElement.textContent).toContain('No data');
  });

  it('should render custom description string', () => {
    host.description = 'Custom description here';
    fixture.detectChanges();

    const desc = fixture.debugElement.query(By.css('p'));
    expect(desc.nativeElement.textContent).toContain('Custom description here');
  });

  it('should render template when description is TemplateRef', () => {
    host.description = host.tpl;
    fixture.detectChanges();

    const templateContent = fixture.debugElement.nativeElement.textContent;
    expect(templateContent).toContain('Template Content');
  });

  it('should apply small variant classes when zSize="small"', () => {
    host.size = 'small';
    fixture.detectChanges();

    const comp = fixture.debugElement.query(By.css('z-empty'));
    expect(comp.nativeElement.className).toContain('text-xs');
  });

  it('should merge custom class with variant classes', () => {
    host.customClass = 'bg-red-500';
    fixture.detectChanges();

    const comp = fixture.debugElement.query(By.css('z-empty'));
    expect(comp.nativeElement.className).toContain('bg-red-500');
  });
});
