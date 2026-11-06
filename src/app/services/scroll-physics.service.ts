import { Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true
});

@Injectable({
  providedIn: 'root'
})
export class ScrollPhysicsService implements OnDestroy {
  private initialized = false;
  readonly isScrolled = signal<boolean>(false);

  private readonly handleWindowScroll = (): void => {
    const scrolledNow = window.scrollY > 48;
    if (this.isScrolled() !== scrolledNow) {
      this.ngZone.run(() => {
        this.isScrolled.set(scrolledNow);
      });
    }
  };

  constructor(private ngZone: NgZone) {}

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    this.ngZone.runOutsideAngular(() => {
      gsap.ticker.lagSmoothing(0);

      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if ('decode' in img) {
          img.decode().catch(() => {});
        }
      });

      window.addEventListener('scroll', this.handleWindowScroll, { passive: true });
      this.handleWindowScroll();
    });
  }

  scrollToSection(selector: string): void {
    this.ngZone.runOutsideAngular(() => {
      const target = document.querySelector<HTMLElement>(selector);
      if (!target) return;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 64);
      window.scrollTo({ top });
    });
  }

  destroy(): void {
    this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', this.handleWindowScroll);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      this.initialized = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
