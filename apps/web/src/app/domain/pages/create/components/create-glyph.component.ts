import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type GlyphKind = 'style' | 'dot' | 'aa' | 'icons' | 'radius' | 'menu' | 'accent';

/**
 * The right-hand glyph of a customizer row: the shape of a style, a color dot, "Aa" in a font, an icon library's
 * logo, a radius corner, the menu and its accent. `value` is what the kind needs — a style id, a CSS color, a font
 * family, a library id, an accent id.
 */
@Component({
  selector: 'z-create-glyph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex size-4 items-center justify-center', 'aria-hidden': 'true', '[attr.data-glyph]': 'kind()' },
  template: `
    @switch (kind()) {
      @case ('style') {
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.5">
          @switch (value()) {
            @case ('vega') {
              <rect x="2" y="3" width="12" height="10" rx="2.5" />
            }
            @case ('nova') {
              <rect x="1.5" y="4" width="13" height="8" rx="3" />
            }
            @case ('maia') {
              <rect x="1" y="4" width="14" height="8" rx="4" />
            }
            @case ('lyra') {
              <rect x="2" y="3" width="12" height="10" rx="0" />
            }
            @case ('mira') {
              <rect x="3" y="5" width="10" height="6" rx="1.5" />
              <path d="M5.5 8h5" stroke-linecap="round" />
            }
            @case ('luma') {
              <circle cx="8" cy="8" r="5.5" />
            }
            @case ('sera') {
              <rect x="2" y="3" width="12" height="10" rx="0" />
              <path d="M5 10.5h6" stroke-linecap="round" />
            }
            @default {
              <rect x="2" y="3" width="12" height="10" rx="5" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
            }
          }
        </svg>
      }
      @case ('dot') {
        <span class="size-4 rounded-full" [style.background-color]="value()"></span>
      }
      @case ('aa') {
        <span class="text-base leading-none" [style.font-family]="value()">Aa</span>
      }
      @case ('radius') {
        <svg viewBox="0 0 24 24" class="size-4 rotate-90" fill="none">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 20v-5C4 8.925 8.925 4 15 4h5"
          />
        </svg>
      }
      @case ('menu') {
        <svg
          viewBox="0 0 24 24"
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      }
      @case ('accent') {
        <svg viewBox="0 0 24 24" class="size-4" fill="none">
          <path
            d="M19 12.1294L12.9388 18.207C11.1557 19.9949 10.2641 20.8889 9.16993 20.9877C8.98904 21.0041 8.80705 21.0041 8.62616 20.9877C7.53195 20.8889 6.64039 19.9949 4.85726 18.207L2.83687 16.1811C1.72104 15.0622 1.72104 13.2482 2.83687 12.1294M19 12.1294L10.9184 4.02587M19 12.1294H2.83687M10.9184 4.02587L2.83687 12.1294M10.9184 4.02587L8.89805 2"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.fill]="value() === 'bold' ? 'currentColor' : 'none'"
            [attr.fill-opacity]="value() === 'bold' ? 1 : 0.2"
          />
          <path
            d="M22 20C22 21.1046 21.1046 22 20 22C18.8954 22 18 21.1046 18 20C18 18.8954 20 17 20 17C20 17 22 18.8954 22 20Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.fill]="value() === 'bold' ? 'currentColor' : 'none'"
          />
        </svg>
      }
      @case ('icons') {
        @switch (value()) {
          @case ('lucide') {
            <svg
              viewBox="0 0 24 24"
              class="size-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 12a4 4 0 0 0-8 0 8 8 0 1 0 16 0 11.97 11.97 0 0 0-4-8.944" />
              <path d="M10 12a4 4 0 0 0 8 0 8 8 0 1 0-16 0 11.97 11.97 0 0 0 4.063 9" />
            </svg>
          }
          @case ('tabler') {
            <svg viewBox="0 0 32 32" class="size-4" fill="none">
              <path
                fill="currentColor"
                d="M31.288 7.107A8.83 8.83 0 0 0 24.893.712a55.9 55.9 0 0 0-17.786 0A8.83 8.83 0 0 0 .712 7.107a55.9 55.9 0 0 0 0 17.786 8.83 8.83 0 0 0 6.395 6.395c5.895.95 11.89.95 17.786 0a8.83 8.83 0 0 0 6.395-6.395c.95-5.895.95-11.89 0-17.786"
              />
              <path
                class="fill-neutral-950"
                d="m17.884 9.076 1.5-2.488 6.97 6.977-2.492 1.494zm-7.96 3.127 7.814-.909 3.91 3.66-.974 7.287-9.582 2.159a3.06 3.06 0 0 1-2.17-.329l5.244-4.897c.91.407 2.003.142 2.587-.626.584-.77.488-1.818-.226-2.484s-1.84-.755-2.664-.21c-.823.543-1.107 1.562-.67 2.412l-5.245 4.89a2.53 2.53 0 0 1-.339-2.017z"
              />
            </svg>
          }
          @case ('hugeicons') {
            <svg
              viewBox="0 0 24 24"
              class="size-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M2 9.5H22" />
              <path
                d="M20.5 9.5H3.5L4.23353 15.3682C4.59849 18.2879 4.78097 19.7477 5.77343 20.6239C6.76589 21.5 8.23708 21.5 11.1795 21.5H12.8205C15.7629 21.5 17.2341 21.5 18.2266 20.6239C19.219 19.7477 19.4015 18.2879 19.7665 15.3682L20.5 9.5Z"
              />
              <path d="M5 9C5 5.41015 8.13401 2.5 12 2.5C15.866 2.5 19 5.41015 19 9" />
            </svg>
          }
          @case ('phosphor') {
            <svg
              viewBox="0 0 32 32"
              class="size-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 5h9v16H9zm9 16v9a9 9 0 0 1-9-9M9 5l9 16m0 0h1a8 8 0 0 0 0-16h-1" />
            </svg>
          }
          @default {
            <svg viewBox="0 0 24 24" class="size-4" fill="currentColor">
              <path
                d="M12 2C17.5228 2 22 6.47715 22 12C22 15.3137 19.3137 18 16 18C12.6863 18 10 15.3137 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 16.4183 11.5817 20 16 20C16.8708 20 17.7084 19.8588 18.4932 19.6016C16.7458 21.0956 14.4792 22 12 22C6.6689 22 2.3127 17.8283 2.0166 12.5713C2.23647 9.45772 4.83048 7 8 7C11.3137 7 14 9.68629 14 13C14 13.5523 14.4477 14 15 14C15.5523 14 16 13.5523 16 13C16 8.58172 12.4183 5 8 5C6.50513 5 5.1062 5.41032 3.90918 6.12402C5.72712 3.62515 8.67334 2 12 2Z"
              />
            </svg>
          }
        }
      }
    }
  `,
})
export class CreateGlyphComponent {
  readonly kind = input.required<GlyphKind>();
  readonly value = input<string>('');
}
