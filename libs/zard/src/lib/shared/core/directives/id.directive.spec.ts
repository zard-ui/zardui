import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardIdDirective } from './id.directive';

@Component({
  selector: 'test-host',
  imports: [ZardIdDirective],
  template: `
    <div zardId="ssr" #z="zardId">test-id</div>
  `,
})
class TestHostComponent {}

describe('ZardIdDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  describe('Directive Creation', () => {
    it('when directive applied to element, creates zardId attribute', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      const directiveElement = fixture.debugElement.nativeElement.querySelector('[zardId]');
      expect(directiveElement).toBeTruthy();
    });

    it('when no custom prefix provided, displays default content', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      const directiveElement = fixture.debugElement.nativeElement.querySelector('[zardId]');
      expect(directiveElement.textContent.trim()).toBe('test-id');
    });
  });

  describe('ID Generation', () => {
    it('when multiple directive instances created, generates unique identifiers', () => {
      const fixture1 = TestBed.createComponent(TestHostComponent);
      fixture1.detectChanges();
      const fixture2 = TestBed.createComponent(TestHostComponent);
      fixture2.detectChanges();

      const element1 = fixture1.debugElement.nativeElement.querySelector('[zardId]');
      const element2 = fixture2.debugElement.nativeElement.querySelector('[zardId]');

      expect(element1).toBeTruthy();
      expect(element2).toBeTruthy();

      const directives1 = fixture1.debugElement.queryAll(By.directive(ZardIdDirective));
      const directives2 = fixture2.debugElement.queryAll(By.directive(ZardIdDirective));

      expect(directives1).toHaveLength(1);
      expect(directives2).toHaveLength(1);

      const directive1 = directives1[0].injector.get(ZardIdDirective);
      const directive2 = directives2[0].injector.get(ZardIdDirective);

      const id1 = directive1.id();
      const id2 = directive2.id();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).toMatch(/^ssr-\d+$/);
      expect(id2).toMatch(/^ssr-\d+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Service State Management', () => {
    it('when multiple directive instances created, maintains unique counter state', () => {
      const fixtures = Array.from({ length: 10 }, () => {
        const f = TestBed.createComponent(TestHostComponent);
        f.detectChanges();
        return f;
      });

      // All fixtures should be created successfully
      fixtures.forEach(f => {
        const element = f.debugElement.nativeElement.querySelector('[zardId]');
        expect(element).toBeTruthy();
        expect(element.textContent.trim()).toBe('test-id');
      });

      expect(fixtures).toHaveLength(10);

      // Collect ID values from directive instances
      const collectedIds = fixtures.map(fixture => {
        const directives = fixture.debugElement.queryAll(By.directive(ZardIdDirective));
        expect(directives).toHaveLength(1);
        const directive = directives[0].injector.get(ZardIdDirective);
        return directive.id();
      });

      // Assert we have 10 IDs and all are unique
      expect(collectedIds).toHaveLength(10);
      const uniqueIds = new Set(collectedIds);
      expect(uniqueIds.size).toBe(fixtures.length);
    });

    it('when rapid component creation occurs, handles concurrent access safely', () => {
      // Simulate concurrent access by creating many fixtures rapidly
      const fixtures = Array.from({ length: 50 }, () => {
        const f = TestBed.createComponent(TestHostComponent);
        f.detectChanges();
        return f;
      });

      // All fixtures should be created successfully
      fixtures.forEach(f => {
        const element = f.debugElement.nativeElement.querySelector('[zardId]');
        expect(element).toBeTruthy();
        expect(element.textContent.trim()).toBe('test-id');
      });

      expect(fixtures).toHaveLength(50);

      // Collect all generated IDs from directive instances
      const collectedIds = fixtures.map(fixture => {
        const directives = fixture.debugElement.queryAll(By.directive(ZardIdDirective));
        expect(directives).toHaveLength(1);
        const directive = directives[0].injector.get(ZardIdDirective);
        return directive.id();
      });

      // Assert all IDs are unique
      const uniqueIds = new Set(collectedIds);
      expect(uniqueIds.size).toBe(fixtures.length);
    });
  });
});
