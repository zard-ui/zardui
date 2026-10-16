import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';

import { AiAssistComponent } from '@doc/domain/components/ai-assist/ai-assist.component';
import { ApiReferenceComponent } from '@doc/domain/components/api-reference/api-reference.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { ProseDirective } from '@doc/domain/directives/prose.directive';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { ComponentData, COMPONENTS_REGISTRY, type SectionTableLink } from '@doc/shared/constants/components.constant';
import { Step } from '@doc/shared/constants/install.constant';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';
import { DynamicInstallationService } from '@doc/shared/services/dynamic-installation.service';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

/** Components whose demos are only readable at the full width of the preview. */
const FULL_WIDTH_PREVIEWS = ['slider', 'chart', 'sidebar', 'map'];

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  imports: [
    AiAssistComponent,
    ApiReferenceComponent,
    CodeBlockComponent,
    CodeTabsComponent,
    DocContentComponent,
    ProseDirective,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    StepsComponent,
    ZardCodeBoxComponent,
    HyphenToSpacePipe,
    NgComponentOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentPage implements OnInit {
  protected readonly fillsContainer = (componentName: string) => FULL_WIDTH_PREVIEWS.includes(componentName);
  protected readonly isLink = (cell: string | SectionTableLink): cell is SectionTableLink => typeof cell !== 'string';

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dynamicInstallationService = inject(DynamicInstallationService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  activeAnchor = 'overview';
  componentData = signal<ComponentData | undefined>(undefined);

  /**
   * The page instance is reused when only the `:componentName` param changes, so the template renders this
   * one-element list through a `@for` keyed by component name: switching components rebuilds every demo,
   * heading anchor and code box instead of reusing the previous component's instances by index.
   */
  protected readonly loadedComponent = computed(() => {
    const data = this.componentData();
    return data ? [data] : [];
  });

  navigationConfig: NavigationConfig = { items: [] };

  activeTab = signal<'manual' | 'cli'>('cli');
  installGuide = signal<{ manual: Step[]; cli: Step[] } | undefined>(undefined);

  onInstallKeyDown(e: Event, tabList: HTMLElement): void {
    const event = e as KeyboardEvent;
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]')) as HTMLElement[];
    const currentIndex = tabs.findIndex(tab => tab === event.target);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      tabs[newIndex].focus();
      // Update active tab based on the focused tab's id
      const activeTabValue = tabs[newIndex].id === 'cli-tab' ? 'cli' : 'manual';
      this.activeTab.set(activeTabValue);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadData());
  }

  private async loadData() {
    // A component with its own lazy route (the map, which brings its own providers) names itself in the route data.
    const { paramMap, data } = this.activatedRoute.snapshot;
    const componentName = paramMap.get('componentName') ?? (data['componentName'] as string | undefined);
    if (!componentName) {
      this.router.navigateByUrl('/');
      return;
    }

    const entry = COMPONENTS_REGISTRY.find(x => x.componentName === componentName);
    if (!entry) {
      this.router.navigateByUrl('/');
      return;
    }

    const component = await entry.loadData();
    const installGuide = this.dynamicInstallationService.generateInstallationSteps(
      componentName,
      component.installData?.cliAdd,
      component.installData?.manualCode,
      component.installData?.manualDeps,
      component.installData?.register,
    );
    const exampleNavigationItems = component.examples.map(example => ({
      id: example.name,
      label: example.name,
      type: 'custom' as const,
    }));

    this.navigationConfig = {
      items: [
        { id: 'overview', label: 'Overview', type: 'core' },
        ...(component.about ? [{ id: 'about', label: 'About', type: 'core' as const }] : []),
        { id: 'installation', label: 'Installation', type: 'core' },
        { id: 'usage', label: 'Usage', type: 'core' },
        ...(component.composition ? [{ id: 'composition', label: 'Composition', type: 'core' as const }] : []),
        {
          id: 'examples',
          label: 'Examples',
          type: 'core',
          children: exampleNavigationItems,
        },
        ...(component.sections ?? []).map(section => ({
          id: section.id,
          label: section.title,
          type: 'core' as const,
          children: (section.examples ?? []).map(example => ({
            id: example.name,
            label: example.name,
            type: 'custom' as const,
          })),
        })),
        { id: 'api', label: 'API', type: 'core' },
      ],
    };

    this.installGuide.set(installGuide);
    this.componentData.set(component);
    this.setPageTitle();
  }

  setPageTitle() {
    const componentData = this.componentData();
    if (!componentData) {
      return;
    }
    const { componentName, description } = componentData;
    const ogImage = `og-${componentName}.jpg`;

    if (componentName) {
      this.seoService.setComponentSeo(componentName, description, ogImage);
    }
  }
}
