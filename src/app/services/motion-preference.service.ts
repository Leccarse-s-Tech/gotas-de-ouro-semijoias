import { Injectable, NgZone, OnDestroy, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MotionPreferenceService implements OnDestroy {
  private readonly mediaQuery: MediaQueryList | null =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  readonly prefersReducedMotion = signal<boolean>(this.mediaQuery?.matches ?? false);

  private readonly listener = (event: MediaQueryListEvent): void => {
    this.ngZone.run(() => {
      this.prefersReducedMotion.set(event.matches);
    });
  };

  constructor(private readonly ngZone: NgZone) {
    if (this.mediaQuery) {
      if (typeof this.mediaQuery.addEventListener === 'function') {
        this.mediaQuery.addEventListener('change', this.listener);
      } else if (typeof this.mediaQuery.addListener === 'function') {
        this.mediaQuery.addListener(this.listener);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
      if (typeof this.mediaQuery.removeEventListener === 'function') {
        this.mediaQuery.removeEventListener('change', this.listener);
      } else if (typeof this.mediaQuery.removeListener === 'function') {
        this.mediaQuery.removeListener(this.listener);
      }
    }
  }
}
