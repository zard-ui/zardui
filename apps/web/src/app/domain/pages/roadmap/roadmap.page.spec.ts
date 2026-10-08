import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { RoadmapPage } from './roadmap.page';

describe('RoadmapPage', () => {
  let component: RoadmapPage;
  let fixture: ComponentFixture<RoadmapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RoadmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  /*
   * `getStatusBadgeVariant` and `getStatusText` both index a closed map keyed by
   * `RoadmapPhase['status']`. Task #60 added `ongoing` to that union after `v1`
   * closed — an unmapped status renders `undefined` silently (no fallback), so
   * every status actually in use has to resolve on both helpers.
   */
  describe('status maps', () => {
    const statuses = () => new Set(component.phases.map(phase => phase.status));

    it('resolves a badge variant for every status in use', () => {
      for (const status of statuses()) {
        expect(component.getStatusBadgeVariant(status)).toBeDefined();
      }
    });

    it('resolves display text for every status in use', () => {
      for (const status of statuses()) {
        expect(component.getStatusText(status)).toBeDefined();
      }
    });

    it('resolves accent classes for every status in use', () => {
      for (const status of statuses()) {
        const accent = component.getStatusAccent(status);
        expect(accent.dot).toBeTruthy();
        expect(accent.bar).toBeTruthy();
        expect(accent.percent).toBeTruthy();
      }
    });

    it('covers every status value the model declares, not just the ones in use today', () => {
      const allStatuses: Array<'completed' | 'in-progress' | 'ongoing' | 'planned'> = [
        'completed',
        'in-progress',
        'ongoing',
        'planned',
      ];

      for (const status of allStatuses) {
        expect(component.getStatusBadgeVariant(status)).toBeDefined();
        expect(component.getStatusText(status)).toBeDefined();
      }
    });
  });

  /*
   * "Keep v1 stable" and "continuous docs and bug fixes" never finish, so they
   * carry no `progress` — the template must not fabricate a percentage or a
   * progress bar for them.
   */
  describe('ongoing phases', () => {
    const ongoingPhases = () => component.phases.filter(phase => phase.status === 'ongoing');

    it('has at least one ongoing phase to guard', () => {
      expect(ongoingPhases().length).toBeGreaterThan(0);
    });

    it('carries no numeric progress on ongoing phases', () => {
      for (const phase of ongoingPhases()) {
        expect(phase.progress).toBeUndefined();
      }
    });

    it('renders no progress bar for an ongoing phase card', () => {
      const [firstOngoing] = ongoingPhases();
      const card = fixture.debugElement
        .queryAll(By.css('[id]'))
        .find(el => el.nativeElement.getAttribute('id') === firstOngoing.id);

      expect(card).toBeTruthy();
      expect(card?.queryAll(By.css('z-progress')).length).toBe(0);
    });

    it('renders a progress bar for a phase with a defined progress', () => {
      const [firstPlanned] = component.phases.filter(phase => phase.progress !== undefined);
      const card = fixture.debugElement
        .queryAll(By.css('[id]'))
        .find(el => el.nativeElement.getAttribute('id') === firstPlanned.id);

      expect(card).toBeTruthy();
      expect(card?.queryAll(By.css('z-progress')).length).toBe(1);
    });
  });

  /*
   * A plain average over every phase (including post-v1 phases starting at 0%)
   * would take this number backwards the day v1 ships. It has to read 100 once
   * V1.0 closes, regardless of how many forward-looking phases exist.
   */
  describe('headline metric', () => {
    it('is 100 once V1.0 has shipped', () => {
      expect(component.overallProgress).toBe(100);
    });

    it('does not include post-v1 phases in the journey used to compute it', () => {
      const journeyIds = component.v1JourneyPhases.map(phase => phase.id);

      expect(journeyIds).not.toContain('keeping-v1-stable');
      expect(journeyIds).not.toContain('rtl');
      expect(journeyIds).not.toContain('zard-cli-create');
      expect(journeyIds).not.toContain('ai-sdk');
      expect(journeyIds).not.toContain('continuous-docs-and-fixes');
    });

    it('renders the same value in the summary card', () => {
      const percent = fixture.debugElement.query(By.css('.text-4xl'));

      expect(percent.nativeElement.textContent.trim()).toBe('100%');
    });
  });

  describe('phase order', () => {
    it('places the post-v1 phases after V1.0, in the documented order', () => {
      const ids = component.phases.map(phase => phase.id);
      const v1Index = ids.indexOf('v1');

      expect(v1Index).toBeGreaterThanOrEqual(0);
      expect(ids.slice(v1Index + 1)).toEqual([
        'keeping-v1-stable',
        'rtl',
        'zard-cli-create',
        'ai-sdk',
        'continuous-docs-and-fixes',
      ]);
    });

    it('keeps the zard-cli-create id so the /themes notice link still resolves', () => {
      expect(component.phases.some(phase => phase.id === 'zard-cli-create')).toBe(true);
    });
  });

  describe('V1.0 phase', () => {
    it('is completed at 100%', () => {
      const v1 = component.phases.find(phase => phase.id === 'v1');

      expect(v1?.status).toBe('completed');
      expect(v1?.progress).toBe(100);
    });

    it('does not claim rtl as a completed CLI capability', () => {
      const v1 = component.phases.find(phase => phase.id === 'v1');

      expect(v1?.deliverables.some(d => /\brtl\b/i.test(d.text))).toBe(false);
    });
  });

  describe('heading structure', () => {
    it('renders exactly one h1', () => {
      expect(fixture.debugElement.queryAll(By.css('h1'))).toHaveLength(1);
    });
  });
});
