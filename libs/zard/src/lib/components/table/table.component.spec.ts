import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ZardTableBodyComponent,
  ZardTableCaptionComponent,
  ZardTableCellComponent,
  ZardTableComponent,
  ZardTableHeadComponent,
  ZardTableHeaderComponent,
  ZardTableRowComponent,
} from './table.component';

@Component({
  selector: 'test-striped-table',
  standalone: true,
  imports: [ZardTableComponent],
  template: `<table z-table zType="striped"></table>`,
})
class TestStripedTableComponent {}

@Component({
  selector: 'test-bordered-table',
  standalone: true,
  imports: [ZardTableComponent],
  template: `<table z-table zType="bordered"></table>`,
})
class TestBorderedTableComponent {}

@Component({
  selector: 'test-compact-table',
  standalone: true,
  imports: [ZardTableComponent],
  template: `<table z-table zSize="compact"></table>`,
})
class TestCompactTableComponent {}

@Component({
  selector: 'test-comfortable-table',
  standalone: true,
  imports: [ZardTableComponent],
  template: `<table z-table zSize="comfortable"></table>`,
})
class TestComfortableTableComponent {}

describe('TableComponents', () => {
  describe('ZardTableComponent', () => {
    let component: ZardTableComponent;
    let fixture: ComponentFixture<ZardTableComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableComponent, TestStripedTableComponent, TestBorderedTableComponent, TestCompactTableComponent, TestComfortableTableComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default variant classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('w-full');
      expect(compiled.getAttribute('class')).toContain('caption-bottom');
      expect(compiled.getAttribute('class')).toContain('text-sm');
    });

    it('should apply striped variant classes', () => {
      const stripedFixture = TestBed.createComponent(TestStripedTableComponent);
      stripedFixture.detectChanges();
      const compiled = stripedFixture.nativeElement.querySelector('table');
      expect(compiled.getAttribute('class')).toContain('[&_tbody_tr:nth-child(odd)]:bg-muted/50');
    });

    it('should apply bordered variant classes', () => {
      const borderedFixture = TestBed.createComponent(TestBorderedTableComponent);
      borderedFixture.detectChanges();
      const compiled = borderedFixture.nativeElement.querySelector('table');
      expect(compiled.getAttribute('class')).toContain('border');
      expect(compiled.getAttribute('class')).toContain('border-border');
    });

    it('should apply compact size classes', () => {
      const compactFixture = TestBed.createComponent(TestCompactTableComponent);
      compactFixture.detectChanges();
      const compiled = compactFixture.nativeElement.querySelector('table');
      expect(compiled.getAttribute('class')).toContain('[&_td]:py-2');
      expect(compiled.getAttribute('class')).toContain('[&_th]:py-2');
    });

    it('should apply comfortable size classes', () => {
      const comfortableFixture = TestBed.createComponent(TestComfortableTableComponent);
      comfortableFixture.detectChanges();
      const compiled = comfortableFixture.nativeElement.querySelector('table');
      expect(compiled.getAttribute('class')).toContain('[&_td]:py-4');
      expect(compiled.getAttribute('class')).toContain('[&_th]:py-4');
    });
  });

  describe('ZardTableHeaderComponent', () => {
    let component: ZardTableHeaderComponent;
    let fixture: ComponentFixture<ZardTableHeaderComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableHeaderComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableHeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('[&_tr]:border-b');
    });
  });

  describe('ZardTableBodyComponent', () => {
    let component: ZardTableBodyComponent;
    let fixture: ComponentFixture<ZardTableBodyComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableBodyComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableBodyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('[&_tr:last-child]:border-0');
    });
  });

  describe('ZardTableRowComponent', () => {
    let component: ZardTableRowComponent;
    let fixture: ComponentFixture<ZardTableRowComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableRowComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableRowComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('border-b');
      expect(compiled.getAttribute('class')).toContain('transition-colors');
      expect(compiled.getAttribute('class')).toContain('hover:bg-muted/50');
    });
  });

  describe('ZardTableHeadComponent', () => {
    let component: ZardTableHeadComponent;
    let fixture: ComponentFixture<ZardTableHeadComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableHeadComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableHeadComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('h-10');
      expect(compiled.getAttribute('class')).toContain('px-2');
      expect(compiled.getAttribute('class')).toContain('text-left');
      expect(compiled.getAttribute('class')).toContain('align-middle');
      expect(compiled.getAttribute('class')).toContain('font-medium');
    });
  });

  describe('ZardTableCellComponent', () => {
    let component: ZardTableCellComponent;
    let fixture: ComponentFixture<ZardTableCellComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableCellComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('p-2');
      expect(compiled.getAttribute('class')).toContain('align-middle');
    });
  });

  describe('ZardTableCaptionComponent', () => {
    let component: ZardTableCaptionComponent;
    let fixture: ComponentFixture<ZardTableCaptionComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableCaptionComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardTableCaptionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should apply default classes', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('mt-4');
      expect(compiled.getAttribute('class')).toContain('text-sm');
      expect(compiled.getAttribute('class')).toContain('text-muted-foreground');
    });
  });
});
