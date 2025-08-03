import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
} from './table.component';

describe('TableComponents', () => {
  describe('ZardTableComponent', () => {
    let component: ZardTableComponent;
    let fixture: ComponentFixture<ZardTableComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardTableComponent],
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
      component.zType.set('striped');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('[&_tbody_tr:nth-child(odd)]:bg-muted/50');
    });

    it('should apply bordered variant classes', () => {
      component.zType.set('bordered');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('border');
      expect(compiled.getAttribute('class')).toContain('border-border');
    });

    it('should apply compact size classes', () => {
      component.zSize.set('compact');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.getAttribute('class')).toContain('[&_td]:py-2');
      expect(compiled.getAttribute('class')).toContain('[&_th]:py-2');
    });

    it('should apply comfortable size classes', () => {
      component.zSize.set('comfortable');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
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
