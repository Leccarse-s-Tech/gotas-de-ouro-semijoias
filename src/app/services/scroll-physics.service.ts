import { Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({
  providedIn: 'root'
})
export class ScrollPhysicsService implements OnDestroy {
  private lenis: Lenis | null = null;
  private tickerFn: ((time: number) => void) | null = null;

  private currentVelocity = 0;
  private targetVelocity = 0;
  private springValue = 0;
  private springVelocity = 0;

  readonly scrollProgress = signal<number>(0);
  readonly isScrolled = signal<boolean>(false);

  constructor(private ngZone: NgZone) {}

  init(): void {
    if (this.lenis || typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5
      });

      this.lenis.on('scroll', (e: { scroll: number; progress: number; velocity: number }) => {
        ScrollTrigger.update();
        this.targetVelocity = Math.max(-42, Math.min(42, e.velocity || 0));
        const scrolledNow = e.scroll > 48;
        if (this.isScrolled() !== scrolledNow) {
          this.isScrolled.set(scrolledNow);
        }
        this.scrollProgress.set(e.progress || 0);
      });

      const stiffness = 0.14;
      const damping = 0.78;
      const rootStyle = document.documentElement.style;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.tickerFn = (time: number) => {
        this.lenis?.raf(time * 1000);

        if (!reducedMotion) {
          this.currentVelocity += (this.targetVelocity - this.currentVelocity) * 0.18;
          this.targetVelocity *= 0.88;

          const force = (this.currentVelocity - this.springValue) * stiffness;
          this.springVelocity = (this.springVelocity + force) * damping;
          this.springValue += this.springVelocity;

          const normalized = Math.max(-1, Math.min(1, this.springValue / 28));
          const stretchY = 1 + Math.abs(normalized) * 0.036;
          const shiftY = normalized * -9.5;
          const skewY = normalized * 0.85;

          rootStyle.setProperty('--scroll-stretch-y', stretchY.toFixed(4));
          rootStyle.setProperty('--scroll-shift-y', `${shiftY.toFixed(2)}px`);
          rootStyle.setProperty('--scroll-skew-y', `${skewY.toFixed(3)}deg`);
        }
      };

      gsap.ticker.add(this.tickerFn);
      gsap.ticker.lagSmoothing(0);
    });
  }

  scrollToSection(selector: string): void {
    if (this.lenis) {
      this.lenis.scrollTo(selector, { offset: -64, duration: 1.4 });
    } else {
      const target = document.querySelector(selector);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
    this.lenis?.destroy();
    this.lenis = null;
  }
}
