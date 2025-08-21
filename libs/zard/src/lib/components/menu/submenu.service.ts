import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { map, auditTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ZardMenuVariants } from './menu.variants';

@Injectable()
export class ZardSubmenuService {
  private readonly parentService = inject(ZardSubmenuService, { optional: true, skipSelf: true });
  private readonly destroyRef = inject(DestroyRef);

  // Subjects for RxJS-based state management
  private readonly mouseEnterTitle$ = new Subject<boolean>();
  private readonly mouseEnterOverlay$ = new Subject<boolean>();
  private readonly childOpen$ = new Subject<boolean>();

  // Signals for basic state
  private readonly _mode = signal<ZardMenuVariants['zMode']>('vertical');
  private readonly _isOpen = signal(false);
  private readonly _level = signal<number>(1);

  // Computed observables following ng-zorro pattern
  private readonly isCurrentSubMenuOpen$ = combineLatest([this.mouseEnterTitle$.pipe(startWith(false)), this.mouseEnterOverlay$.pipe(startWith(false))]).pipe(
    map(([titleHover, overlayHover]) => titleHover || overlayHover),
    distinctUntilChanged(),
  );

  private readonly isChildSubMenuOpen$ = this.childOpen$.pipe(startWith(false), distinctUntilChanged());

  // Combined state with debouncing like ng-zorro
  readonly shouldOpen$ = combineLatest([this.isChildSubMenuOpen$, this.isCurrentSubMenuOpen$]).pipe(
    map(([isChildOpen, isCurrentOpen]) => isChildOpen || isCurrentOpen),
    auditTime(150), // Debounce like ng-zorro
    distinctUntilChanged(),
    takeUntilDestroyed(this.destroyRef),
  );

  // Read-only signals
  readonly mode = this._mode.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();
  readonly level = this._level.asReadonly();

  constructor() {
    // Set level based on parent service
    if (this.parentService) {
      const parentLevel = this.parentService.level();
      this._level.set(parentLevel + 1);
    } else {
      this._level.set(1);
    }

    // Subscribe to the combined state
    this.shouldOpen$.subscribe(shouldOpen => {
      this._isOpen.set(shouldOpen);
      // Notify parent service
      if (this.parentService) {
        this.parentService.setChildOpen(shouldOpen);
      }
    });
  }

  updateMode(mode: ZardMenuVariants['zMode']): void {
    this._mode.set(mode);
  }

  // Methods following ng-zorro pattern
  setMouseEnterTitleOrOverlayState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this.mouseEnterTitle$.next(value);
    }
  }

  setMouseEnterOverlayState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this.mouseEnterOverlay$.next(value);
    }
  }

  setChildOpen(open: boolean): void {
    this.childOpen$.next(open);
  }

  // Manual open/close for click interactions
  toggleOpen(): void {
    const currentOpen = this._isOpen();
    this._isOpen.set(!currentOpen);
    this.mouseEnterTitle$.next(!currentOpen);
  }

  forceClose(): void {
    this._isOpen.set(false);
    this.mouseEnterTitle$.next(false);
    this.mouseEnterOverlay$.next(false);
  }
}
