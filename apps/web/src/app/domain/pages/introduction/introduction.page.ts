import { RouterModule } from '@angular/router';
import { Component, signal } from '@angular/core';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-introduction',
  standalone: true,
  imports: [RouterModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective],
  templateUrl: './introduction.page.html',
})
export class IntroductionPage {
  activeAnchor?: string;

  readonly pageTopics = signal<Topic[]>([{ name: 'why-zardui' }, { name: 'cli' }, { name: 'ai-ready' }, { name: 'open-source' }]);
}
