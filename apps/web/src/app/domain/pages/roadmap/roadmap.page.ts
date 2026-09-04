import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { COMPONENTS_PATH } from '@doc/shared/constants/routes.constant';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';

interface RoadmapPhase {
  id: string;
  title: string;
  period: string;
  status: 'completed' | 'in-progress' | 'ongoing' | 'planned';
  /**
   * Percent complete, 0-100. Omitted for `ongoing` phases: "keep v1 stable" and
   * "continuous docs and bug fixes" never finish, so a percentage would be fiction.
   * The template hides the progress bar and the number whenever this is undefined
   * instead of rendering a fake 0% or 100%.
   */
  progress?: number;
  description: string;
  goals: string[];
  deliverables: Array<{ text: string; completed: boolean }>;
}

/**
 * The phases that make up "the v1 journey" — Alpha through V1.0. `overallProgress`
 * below is computed only over these on purpose: a plain average across every phase
 * (including the post-v1 phases that start at 0) would take the headline number
 * backwards the day v1 ships and every time a new phase is planned after that.
 * Restricting it to the shipped journey keeps it a stable 100% once V1.0 closes,
 * regardless of how many forward-looking phases sit underneath it.
 */
const V1_JOURNEY_PHASE_IDS: readonly string[] = ['alpha', 'beta', 'rc', 'v1'];

type RoadmapBadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface StatusAccent {
  dot: string;
  bar: string;
  percent: string;
}

@Component({
  selector: 'z-roadmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocContentComponent, DocHeadingComponent, ZardCardComponent, ZardBadgeComponent, ZardProgressComponent],
  templateUrl: './roadmap.page.html',
})
export class RoadmapPage implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly phases: RoadmapPhase[] = [
    {
      id: 'alpha',
      title: 'Alpha - From Zero to Something',
      period: 'Completed',
      status: 'completed',
      progress: 100,
      description: 'Started from scratch, building core patterns inspired by shadcn/ui and ng-zorro',
      goals: ['Project structure', 'Core patterns', '15+ components', 'TailwindCSS v4'],
      deliverables: [
        { text: 'Nx monorepo with Angular 18+', completed: true },
        { text: 'Architecture patterns inspired by shadcn/ui', completed: true },
        { text: 'Core components (Button, Input, Card, etc.)', completed: true },
        { text: 'TailwindCSS v4 with design tokens', completed: true },
        { text: 'CVA for type-safe variants', completed: true },
        { text: 'Basic CLI for component installation', completed: true },
      ],
    },
    {
      id: 'beta',
      title: 'Beta - Community & Growth',
      period: 'Completed',
      status: 'completed',
      progress: 100,
      description:
        'Focus on growth and community feedback. Users started adopting the library and providing valuable insights',
      goals: ['Community growth', '30+ components', 'CLI improvements', 'Documentation'],
      deliverables: [
        { text: '30+ production-ready components', completed: true },
        { text: 'Interactive documentation site', completed: true },
        { text: 'Enhanced CLI for easy installation', completed: true },
        { text: 'Dark mode with persistence', completed: true },
        { text: 'Signal-based inputs (Angular 17+)', completed: true },
        { text: 'components.json configuration', completed: true },
        { text: 'Community feedback integration', completed: true },
      ],
    },
    {
      id: 'rc',
      title: 'Release Candidate - Quality & DX',
      period: 'Completed',
      status: 'completed',
      progress: 100,
      description:
        'A registry the CLI installs from without touching GitHub, an MCP server so assistants read the real components, and a test suite behind both',
      goals: ['Private registry', 'Better DX', 'Accessibility', 'MCP Server', 'Testing'],
      deliverables: [
        { text: 'CLI with private registry (no GitHub fetch)', completed: true },
        { text: 'Component improvements (DX, accessibility, performance)', completed: true },
        { text: 'MCP Server for AI integration (Claude, Cursor, VS Code)', completed: true },
        { text: 'Unit tests with Jest and Testing Library', completed: true },
        { text: 'E2E testing with Playwright, including a11y checks', completed: true },
        { text: 'Blocks library (login, signup)', completed: true },
      ],
    },
    {
      id: 'v1',
      title: 'V1.0 - Production Ready',
      period: 'September 2026',
      status: 'completed',
      progress: 100,
      description:
        'Alpha, Beta, and Release Candidate converge into a stable 1.0: the component API, the CLI, and the registry format are now covered by semantic versioning, and breaking changes only ship behind a major bump from here on.',
      goals: ['Stable release', 'Component registry', 'AI integration', 'Accessibility'],
      deliverables: [
        // Read from the same nav constant the v1 changelog announcement uses, so the
        // two never drift apart the way this line and the registry already had.
        { text: `${COMPONENTS_PATH.data.length}+ components, including Chart (Apache ECharts)`, completed: true },
        { text: '10 ready-made blocks', completed: true },
        { text: 'Public registry with a versioned format and JSON Schemas', completed: true },
        { text: 'Icon catalog served by the registry, family set in components.json', completed: true },
        { text: 'zard-mcp published on npm, with 9 tools', completed: true },
        // "rtl" moved to the RTL phase below: the flag records intent, it does not
        // change CLI output yet, and claiming it here contradicted /docs/json.
        { text: 'Full-screen CLI with five project types and an icon catalog', completed: true },
        { text: 'Final test pass (unit and e2e)', completed: true },
        { text: 'Accessibility review', completed: true },
        { text: 'Bug validation and fixes', completed: true },
        { text: 'V1.0.0 finalized and tagged, publishing to npm with this release', completed: true },
      ],
    },
    {
      id: 'keeping-v1-stable',
      title: 'Keeping V1 Stable',
      period: 'Ongoing',
      status: 'ongoing',
      description:
        'The current focus now that V1.0 has shipped: semantic versioning holds, regressions get patched quickly, and the component API, the CLI, and the registry format stay predictable for anyone building on them.',
      goals: ['Semantic versioning', 'Fast regression triage', 'Patch releases', 'Growing test coverage'],
      deliverables: [
        { text: 'Semantic versioning enforced across the library, CLI, and registry', completed: true },
        { text: 'Public issue triage on GitHub', completed: true },
        { text: 'Patch releases for confirmed regressions', completed: true },
        { text: 'Expanding unit and E2E coverage as issues are reported', completed: false },
      ],
    },
    {
      id: 'rtl',
      title: 'RTL Support',
      period: 'Planned',
      status: 'planned',
      progress: 0,
      description:
        'The rtl flag in components.json already records intent — set today, it does not change what the CLI installs. This phase gives it real behaviour: right-to-left variants for the components whose layout depends on direction.',
      goals: ['Directional component variants', 'RTL-aware CLI output', 'RTL documentation and demos'],
      deliverables: [
        { text: 'rtl flag recorded in components.json today (intent only, no behaviour yet)', completed: true },
        { text: 'Audit of components that need directional (RTL) variants', completed: false },
        {
          text: 'RTL variants for layout-sensitive components (drawer, sidebar, carousel, and more)',
          completed: false,
        },
        { text: 'CLI installs the matching variant based on the rtl flag', completed: false },
        { text: 'RTL demos and documentation', completed: false },
      ],
    },
    {
      id: 'zard-cli-create',
      title: 'zard-cli create - Project-level Theming',
      period: 'Planned',
      status: 'planned',
      progress: 0,
      description:
        'A large, CLI-driven customization update that replaces the /themes web customizer: theme, tokens, radius, fonts, typeset, and block presets generated for the project without leaving the terminal. It has not shipped yet.',
      goals: [
        'Project-aware theme generation',
        'Token, radius, and font presets',
        'Typeset and block presets',
        'Supersede the /themes web customizer',
      ],
      deliverables: [
        { text: 'Interactive theme customization in zard-cli create', completed: false },
        { text: 'Token, radius, and font presets', completed: false },
        { text: 'Typeset and block-level presets', completed: false },
        { text: 'Project-level overrides saved to components.json', completed: false },
        { text: '/themes web customizer retired in favor of the CLI flow', completed: false },
      ],
    },
    {
      id: 'ai-sdk',
      title: 'AI SDK',
      period: 'Planned',
      status: 'planned',
      progress: 0,
      description:
        'A dedicated SDK for building AI-driven interfaces with Zard UI components, building on the patterns zard-mcp already established for assistants that read and generate against the real component set.',
      goals: ['AI-first component patterns', 'Streaming-friendly primitives', 'SDK package and documentation'],
      deliverables: [
        { text: 'AI SDK API surface designed', completed: false },
        { text: 'Streaming-friendly component primitives', completed: false },
        { text: 'SDK package published', completed: false },
        { text: 'Documentation and examples', completed: false },
      ],
    },
    {
      id: 'continuous-docs-and-fixes',
      title: 'Continuous Documentation and Bug Fixes',
      period: 'Ongoing',
      status: 'ongoing',
      description:
        'Documentation keeps pace with the component set, and bug fixes ship as they are found — a standing track rather than a milestone with an end date.',
      goals: ['Documentation coverage', 'Timely bug fixes', 'Changelog discipline'],
      deliverables: [
        { text: 'API reference published for every component', completed: true },
        { text: 'Monthly changelog entries', completed: true },
        { text: 'Bug fixes released outside the milestone cadence', completed: false },
      ],
    },
  ];

  /** The phases that shipped v1 — see {@link V1_JOURNEY_PHASE_IDS}. */
  readonly v1JourneyPhases = this.phases.filter(phase => V1_JOURNEY_PHASE_IDS.includes(phase.id));

  /**
   * Computed over the v1 journey only (Alpha through V1.0), never over the whole
   * `phases` array — see {@link V1_JOURNEY_PHASE_IDS}. Once V1.0 closes at 100%,
   * this stays 100% no matter how many post-v1 phases are added below.
   */
  readonly overallProgress = Math.round(
    this.v1JourneyPhases.reduce((total, phase) => total + (phase.progress ?? 0), 0) / this.v1JourneyPhases.length,
  );

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Roadmap',
      'Zard UI shipped V1.0. See the journey that got us here, and the plan for what is next: keeping v1 stable, RTL, zard-cli create, the AI SDK, and continuous docs and bug fixes.',
      '/docs/roadmap',
      'og-roadmap.jpg',
    );
  }

  getStatusBadgeVariant(status: RoadmapPhase['status']): RoadmapBadgeVariant {
    const variants: Record<RoadmapPhase['status'], RoadmapBadgeVariant> = {
      completed: 'default',
      'in-progress': 'secondary',
      ongoing: 'secondary',
      planned: 'outline',
    };
    return variants[status];
  }

  getStatusText(status: RoadmapPhase['status']): string {
    const texts: Record<RoadmapPhase['status'], string> = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      ongoing: 'Ongoing',
      planned: 'Planned',
    };
    return texts[status];
  }

  /**
   * Semantic-token classes for a phase's timeline dot, card accent bar, and
   * progress-percentage text, keyed by status. Using `Record<RoadmapPhase['status'], ...>`
   * here (rather than an inferred object literal) means a status missing from this
   * map fails the build instead of rendering `undefined` at runtime.
   */
  getStatusAccent(status: RoadmapPhase['status']): StatusAccent {
    const accents: Record<RoadmapPhase['status'], StatusAccent> = {
      completed: { dot: 'bg-primary text-primary-foreground', bar: 'bg-primary', percent: 'text-primary' },
      'in-progress': {
        dot: 'bg-primary/70 text-primary-foreground',
        bar: 'bg-primary/70',
        percent: 'text-primary/80',
      },
      ongoing: { dot: 'bg-primary/70 text-primary-foreground', bar: 'bg-primary/70', percent: 'text-primary/80' },
      planned: { dot: 'bg-muted text-muted-foreground', bar: 'bg-muted', percent: 'text-muted-foreground' },
    };
    return accents[status];
  }

  getCompletedCount(deliverables: Array<{ text: string; completed: boolean }>): number {
    return deliverables.filter(d => d.completed).length;
  }
}
