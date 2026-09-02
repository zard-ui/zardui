import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePlus, lucideRefreshCw } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';

/**
 * O card de conversa — o mais alto da parede, e de propósito.
 *
 * Um chat vazio é quase todo espaço em branco, e é esse espaço que dá à coluna
 * quatro um respiro entre o QR e os atalhos de pagamento. Encolhê-lo até o
 * conteúdo o transformaria em mais um bloco de formulário.
 */
@Component({
  selector: 'z-card-new-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardBubbleImports, ZardButtonComponent, ZardSpinnerComponent, NgIcon],
  viewProviders: [provideIcons({ lucideArrowUp, lucidePlus, lucideRefreshCw })],
  host: { class: 'block w-full' },
  template: `
    <z-card class="min-h-[420px]">
      <z-card-header>
        <h3 z-card-title zTitle="New Chat"></h3>
        <p z-card-description zDescription="How can I help you today?"></p>
        <div z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Restart chat">
            <ng-icon name="lucideRefreshCw" />
          </button>
        </div>
      </z-card-header>

      <z-card-content class="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
        <z-spinner class="text-muted-foreground size-6" />
        <div class="flex flex-col gap-1">
          <p class="text-base font-medium">Morning, developer!</p>
          <p class="text-muted-foreground text-sm text-balance">
            What are we working on today? Press send to start a new conversation.
          </p>
        </div>
      </z-card-content>

      <z-card-content class="flex">
        <z-bubble zAlign="end" zVariant="muted">
          <z-bubble-content>I'm building a chat and the scroll keeps jumping on every new message.</z-bubble-content>
        </z-bubble>
      </z-card-content>

      <z-card-footer class="gap-2">
        <button type="button" z-button zType="outline" zSize="icon-sm" zShape="circle" aria-label="Add attachment">
          <ng-icon name="lucidePlus" />
        </button>
        <input
          class="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          placeholder="Send a message..."
          aria-label="Message"
        />
        <button type="button" z-button zSize="icon-sm" zShape="circle" aria-label="Send">
          <ng-icon name="lucideArrowUp" />
        </button>
      </z-card-footer>
    </z-card>
  `,
})
export class CardNewChatComponent {}
