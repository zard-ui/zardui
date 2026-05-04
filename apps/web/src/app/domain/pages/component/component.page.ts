import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';

import { AiAssistComponent } from '@doc/domain/components/ai-assist/ai-assist.component';
import { ApiReferenceComponent } from '@doc/domain/components/api-reference/api-reference.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { ComponentData, COMPONENTS_REGISTRY } from '@doc/shared/constants/components.constant';
import { Step } from '@doc/shared/constants/install.constant';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';
import { DynamicInstallationService } from '@doc/shared/services/dynamic-installation.service';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  imports: [
    AiAssistComponent,
    ApiReferenceComponent,
    CodeBlockComponent,
    CodeTabsComponent,
    DocContentComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    StepsComponent,
    ZardCodeBoxComponent,
    HyphenToSpacePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dynamicInstallationService = inject(DynamicInstallationService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  activeAnchor = 'overview';
  componentData = signal<ComponentData | undefined>(undefined);
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
    const componentName = this.activatedRoute.snapshot.paramMap.get('componentName');
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
        { id: 'installation', label: 'Installation', type: 'core' },
        { id: 'usage', label: 'Usage', type: 'core' },
        ...(component.composition ? [{ id: 'composition', label: 'Composition', type: 'core' as const }] : []),
        {
          id: 'examples',
          label: 'Examples',
          type: 'core',
          children: exampleNavigationItems,
        },
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
