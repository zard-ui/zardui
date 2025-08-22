import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { ZardMenuVariants } from './menu.variants';

@Injectable()
export class ZardSubmenuService {
  private readonly parentService = inject(ZardSubmenuService, { optional: true, skipSelf: true });

  // Core state signals
  private readonly _mode = signal<ZardMenuVariants['zMode']>('vertical');
  private readonly _level = signal<number>(1);
  private readonly _childOpen = signal(false);
  private readonly _manualOpen = signal(false);

  // RxJS-based mouse state management (ng-zorro pattern)
  private readonly isMouseEnterTitleOrOverlay$ = new Subject<boolean>();
  private readonly _isOpen = signal(false);

  // Read-only signals
  readonly mode = this._mode.asReadonly();
  readonly level = this._level.asReadonly();

  // Computed state for determining if submenu should be open
  readonly isOpen = computed(() => this._isOpen());

  constructor() {
    // Set level based on parent service
    if (this.parentService) {
      const parentLevel = this.parentService.level();
      this._level.set(parentLevel + 1);
    } else {
      this._level.set(1);
    }

    // Setup RxJS stream for mouse hover with debouncing (ng-zorro pattern)
    const isCurrentSubmenuOpen$ = this.isMouseEnterTitleOrOverlay$.pipe(map(value => value));

    const isChildSubMenuOpen$ = new Subject<boolean>();

    // Subscribe to child open state changes
    effect(() => {
      isChildSubMenuOpen$.next(this._childOpen());
    });

    // Combine mouse enter state with child submenu state and apply debouncing
    const isSubMenuOpenWithDebounce$ = combineLatest([isChildSubMenuOpen$, isCurrentSubmenuOpen$]).pipe(
      map(([isChildSubMenuOpen, isCurrentSubmenuOpen]) => {
        if (this._mode() === 'inline') {
          return this._manualOpen();
        }
        return isChildSubMenuOpen || isCurrentSubmenuOpen || this._manualOpen();
      }),
      auditTime(150), // 150ms debounce like ng-zorro
    );

    // Subscribe to the debounced stream and update the signal
    isSubMenuOpenWithDebounce$.subscribe(isOpen => {
      this._isOpen.set(isOpen);
    });

    // Effect to notify parent when this submenu's state changes
    effect(() => {
      const isOpen = this.isOpen();
      if (this.parentService) {
        this.parentService.setChildOpen(isOpen);
      }
    });
  }

  updateMode(mode: ZardMenuVariants['zMode']): void {
    this._mode.set(mode);
    if (mode === 'inline') {
      this.isMouseEnterTitleOrOverlay$.next(false);
    }
  }

  setMouseEnterTitleOrOverlayState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this.isMouseEnterTitleOrOverlay$.next(value);
    }
  }

  setChildOpen(open: boolean): void {
    this._childOpen.set(open);
  }

  toggleOpen(): void {
    const currentOpen = this._manualOpen();
    this._manualOpen.set(!currentOpen);
  }

  forceClose(): void {
    this._isOpen.set(false);
    this._manualOpen.set(false);
    this.isMouseEnterTitleOrOverlay$.next(false);
  }
}
