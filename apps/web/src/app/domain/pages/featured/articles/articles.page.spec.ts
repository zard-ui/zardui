import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';

import { ArticlesPage } from './articles.page';
import { FEATURED_ARTICLES } from '../data/featured-articles';

describe('ArticlesPage', () => {
  let component: ArticlesPage;
  let fixture: ComponentFixture<ArticlesPage>;

  const cards = () => fixture.debugElement.queryAll(By.css('a[target="_blank"][rel="noopener noreferrer"]'));

  const imageSources = () =>
    fixture.debugElement.queryAll(By.css('img')).map(el => (el.nativeElement as HTMLImageElement).getAttribute('src'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  describe('article cards', () => {
    it('renders one card per article', () => {
      expect(cards()).toHaveLength(FEATURED_ARTICLES.length);
    });

    it('links every card to the original post in a new tab', () => {
      const hrefs = cards().map(card => (card.nativeElement as HTMLAnchorElement).getAttribute('href'));

      for (const article of FEATURED_ARTICLES) {
        expect(hrefs).toContain(article.url);
      }
    });

    it('shows the author, the publication date and the reading time', () => {
      const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

      expect(text).toContain('Samuel Rizzon');
      expect(text).toContain('Aug 19, 2025');
      expect(text).toContain('4 min read');
    });
  });

  describe('navigation', () => {
    // Bound as `[scrollSpyItem]`/`[id]` on the language sections, so the directive — not the
    // attribute selector — is what finds every spied section.
    const sectionIds = () =>
      fixture.debugElement
        .queryAll(By.directive(ScrollSpyItemDirective))
        .map(el => (el.nativeElement as HTMLElement).id);

    it('has a navigation entry for every section in the template', () => {
      const configured = component['navigationConfig']().items.map(item => item.id);

      for (const id of sectionIds()) {
        expect(configured).toContain(id);
      }
    });

    it('has a section in the template for every navigation entry', () => {
      const rendered = sectionIds();

      for (const item of component['navigationConfig']().items) {
        expect(rendered).toContain(item.id);
      }
    });

    it('skips languages that have no article yet', () => {
      const configured = component['navigationConfig']().items.map(item => item.id);

      expect(configured).not.toContain('portuguese');
    });
  });

  describe('contribute section', () => {
    it('points to the submission address', () => {
      const link = fixture.debugElement.query(By.css('section#contribute a[href^="mailto:"]'));

      expect((link.nativeElement as HTMLAnchorElement).getAttribute('href')).toBe(
        'mailto:hello@luizgomes.dev?subject=Zard%20UI%20article%20submission',
      );
    });
  });

  describe('cover fallback', () => {
    it('drops the remote image when the cover fails to load', () => {
      const article = FEATURED_ARTICLES[0];

      expect(imageSources()).toContain(article.cover);
      expect(imageSources()).not.toContain('/images/zard.svg');

      component['onCoverError'](article.id);
      fixture.detectChanges();

      expect(imageSources()).not.toContain(article.cover);
      expect(imageSources()).toContain('/images/zard.svg');
    });
  });
});
