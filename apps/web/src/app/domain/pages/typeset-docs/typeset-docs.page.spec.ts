import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { TypesetDocsPage } from './typeset-docs.page';

describe('TypesetDocsPage', () => {
  let component: TypesetDocsPage;
  let fixture: ComponentFixture<TypesetDocsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesetDocsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TypesetDocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation', () => {
    const sectionIds = () =>
      fixture.debugElement
        .queryAll(By.css('[scrollSpyItem]'))
        .map(el => (el.nativeElement as HTMLElement).getAttribute('id'));

    it('starts at overview', () => {
      expect(component.navigationConfig.items[0]).toEqual({ id: 'overview', label: 'Overview', type: 'core' });
    });

    it('has a navigation entry for every section in the template', () => {
      const configured = component.navigationConfig.items.map(item => item.id);

      for (const id of sectionIds()) {
        expect(configured).toContain(id);
      }
    });

    it('has a section in the template for every navigation entry', () => {
      const rendered = sectionIds();

      for (const item of component.navigationConfig.items) {
        expect(rendered).toContain(item.id);
      }
    });
  });

  describe('the page uses typeset on itself', () => {
    it('renders prose inside a typeset container', () => {
      const containers = fixture.debugElement.queryAll(By.css('.typeset.typeset-docs'));

      expect(containers.length).toBeGreaterThan(0);
    });

    it('leaves no element inside a typeset container carrying the old prose classes', () => {
      const stale = fixture.debugElement.queryAll(
        By.css('.typeset p[class*="text-muted-foreground"], .typeset code[class*="bg-muted"]'),
      );

      expect(stale).toEqual([]);
    });

    it('opts embedded components out of typeset', () => {
      const embedded = fixture.debugElement.queryAll(By.css('.typeset z-code-block, .typeset z-callout'));

      for (const element of embedded) {
        expect((element.nativeElement as HTMLElement).classList).toContain('not-typeset');
      }
    });
  });
});
