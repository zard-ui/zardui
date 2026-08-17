import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';

interface RoadmapPhase {
  id: string;
  title: string;
  period: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  description: string;
  goals: string[];
  deliverables: Array<{ text: string; completed: boolean }>;
}

@Component({
  selector: 'z-roadmap',
  standalone: true,
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
      period: 'August 20, 2026',
      status: 'in-progress',
      progress: 95,
      description:
        'Everything the release needs is published and in use — what is left is the pass over quality before the version number changes',
      goals: ['Stable release', 'Component registry', 'AI integration', 'Accessibility'],
      deliverables: [
        { text: '47 components, including Chart (Apache ECharts)', completed: true },
        { text: '10 ready-made blocks', completed: true },
        { text: 'Public registry with a versioned format and JSON Schemas', completed: true },
        { text: 'Icon catalog served by the registry, family set in components.json', completed: true },
        { text: 'zard-mcp published on npm, with 9 tools', completed: true },
        { text: 'Full-screen CLI with five project types, icons and rtl', completed: true },
        { text: 'Final test pass (unit + e2e)', completed: false },
        { text: 'Accessibility review', completed: false },
        { text: 'Bug validation and fixes', completed: false },
        { text: 'V1.0 published on npm', completed: false },
      ],
    },
  ];

  readonly overallProgress = Math.round(
    this.phases.reduce((acc, phase) => acc + phase.progress, 0) / this.phases.length,
  );

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Roadmap',
      'Our journey to V1.0 - See our progress and upcoming features for Zard UI',
      '/docs/roadmap',
      'og-roadmap.jpg',
    );
  }

  getStatusBadgeVariant(status: RoadmapPhase['status']): 'default' | 'secondary' | 'outline' | 'destructive' {
    const variants = {
      completed: 'default' as const,
      'in-progress': 'secondary' as const,
      planned: 'outline' as const,
    };
    return variants[status];
  }

  getStatusText(status: RoadmapPhase['status']): string {
    const texts = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      planned: 'Planned',
    };
    return texts[status];
  }

  getProgressColor(progress: number): string {
    if (progress === 100) return 'bg-green-500';
    if (progress > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  }

  getCompletedCount(deliverables: Array<{ text: string; completed: boolean }>): number {
    return deliverables.filter(d => d.completed).length;
  }
}
