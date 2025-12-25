import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardProgressBarComponent } from '@zard/components/progress-bar/progress-bar.component';

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
  imports: [DocContentComponent, DocHeadingComponent, ZardCardComponent, ZardBadgeComponent, ZardProgressBarComponent],
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
      period: 'In Progress',
      status: 'in-progress',
      progress: 45,
      description:
        'Current focus: CLI with private registry, improved DX, accessibility, performance, MCP server for AI integration, and comprehensive testing',
      goals: ['Private registry', 'Better DX', 'Accessibility', 'MCP Server', 'Testing'],
      deliverables: [
        { text: 'CLI with private registry (no GitHub fetch)', completed: true },
        { text: 'Component improvements (DX, accessibility, performance)', completed: true },
        { text: 'MCP Server for AI integration (Claude, ChatGPT)', completed: false },
        { text: 'Enhanced unit tests for all components', completed: false },
        { text: 'E2E testing implementation', completed: false },
        { text: 'Blocks library (auth, dashboard, landing)', completed: true },
      ],
    },
    {
      id: 'v1',
      title: 'V1.0 - Production Ready',
      period: 'Planned',
      status: 'planned',
      progress: 0,
      description: 'Official stable release with enterprise-ready features and full community support',
      goals: ['Stable release', 'Component registry', 'Enterprise features', 'Community hub'],
      deliverables: [
        { text: 'V1.0 stable release', completed: false },
        { text: 'Public component registry', completed: false },
        { text: '100% test coverage (unit + e2e)', completed: false },
        { text: 'Theme generator', completed: false },
        { text: 'Registry MCP integration', completed: false },
        { text: 'Advanced components (Charts, Carousel, Table)', completed: false },
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
      '/doc/roadmap',
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
