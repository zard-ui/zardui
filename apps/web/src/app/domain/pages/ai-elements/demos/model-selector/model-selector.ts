import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideChevronDown, lucidePlus } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

const PROVIDERS = [
  {
    name: 'OpenAI',
    models: [
      { id: 'gpt-5', name: 'GPT-5' },
      { id: 'gpt-5-mini', name: 'GPT-5 mini' },
    ],
  },
  {
    name: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
    ],
  },
];
const MODELS = PROVIDERS.flatMap(provider => provider.models);
const EFFORTS = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
];

@Component({
  selector: 'z-ai-elements-model-selector',
  imports: [NgIcon, ZardTextareaComponent, ...ZardDropdownImports, ...ZardInputGroupImports],
  template: `
    <div class="mx-auto w-full max-w-lg py-6">
      <form (submit)="$event.preventDefault(); submit()">
        <z-input-group>
          <textarea
            z-textarea
            class="p-3"
            aria-label="Message"
            placeholder="Ask the agent to change your code..."
            [value]="text()"
            (input)="text.set($any($event.target).value)"
            (keydown.enter)="onEnter($any($event))"
          ></textarea>
          <z-input-group-addon zAlign="block-end">
            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="icon-sm"
              class="rounded-full"
              aria-label="Attach files"
            >
              <ng-icon name="lucidePlus" />
            </button>

            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="sm"
              class="ms-auto"
              [attr.aria-label]="'Model: ' + currentModel().name"
              z-dropdown
              [zDropdownMenu]="modelMenu"
            >
              {{ currentModel().name }}
              <ng-icon name="lucideChevronDown" />
            </button>
            <z-dropdown-menu-content #modelMenu="zDropdownMenuContent" class="w-48">
              <z-dropdown-menu-radio-group [(zValue)]="model">
                @for (provider of providers; track provider.name; let first = $first) {
                  @if (!first) {
                    <z-dropdown-menu-separator />
                  }
                  <z-dropdown-menu-label>{{ provider.name }}</z-dropdown-menu-label>
                  @for (item of provider.models; track item.id) {
                    <z-dropdown-menu-radio-item [zValue]="item.id">{{ item.name }}</z-dropdown-menu-radio-item>
                  }
                }
              </z-dropdown-menu-radio-group>
            </z-dropdown-menu-content>

            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="sm"
              [attr.aria-label]="'Effort: ' + currentEffort().name"
              z-dropdown
              [zDropdownMenu]="effortMenu"
            >
              <span class="text-muted-foreground">Effort</span>
              {{ currentEffort().name }}
              <ng-icon name="lucideChevronDown" />
            </button>
            <z-dropdown-menu-content #effortMenu="zDropdownMenuContent" class="w-36">
              <z-dropdown-menu-label>Effort</z-dropdown-menu-label>
              <z-dropdown-menu-radio-group [(zValue)]="effort">
                @for (item of efforts; track item.id) {
                  <z-dropdown-menu-radio-item [zValue]="item.id">{{ item.name }}</z-dropdown-menu-radio-item>
                }
              </z-dropdown-menu-radio-group>
            </z-dropdown-menu-content>

            <button
              type="submit"
              z-input-group-button
              zVariant="default"
              zSize="icon-sm"
              class="rounded-full"
              aria-label="Send"
              [disabled]="!canSend()"
            >
              <ng-icon name="lucideArrowUp" />
            </button>
          </z-input-group-addon>
        </z-input-group>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideChevronDown, lucidePlus })],
  host: { class: 'contents' },
})
export class ZardAiElementsModelSelectorComponent {
  protected readonly providers = PROVIDERS;
  protected readonly efforts = EFFORTS;

  protected readonly text = signal('');
  protected readonly model = signal(MODELS[0].id);
  protected readonly effort = signal(EFFORTS[1].id);

  protected readonly currentModel = computed(() => MODELS.find(item => item.id === this.model()) ?? MODELS[0]);
  protected readonly currentEffort = computed(() => EFFORTS.find(item => item.id === this.effort()) ?? EFFORTS[1]);
  protected readonly canSend = computed(() => this.text().trim().length > 0);

  /** Send `model()` and `effort()` with the message, and map them to a model and its options on the server. */
  protected submit(): void {
    if (!this.canSend()) return;
    this.text.set('');
  }

  /** Enter sends, Shift+Enter adds a line. */
  protected onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) return;
    event.preventDefault();
    this.submit();
  }
}
