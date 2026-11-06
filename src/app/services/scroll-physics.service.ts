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
  private rafId: number | null = null;
  private observer: IntersectionObserver | null = null;
  private visibleTargets = new Set<HTMLElement>();

  private currentVelocity = 0;
  private targetVelocity = 0;
  private springValue = 0;
  private springVelocity = 0;
  private isSettled = true;

  readonly isScrolled = signal<boolean>(false);

  constructor(private ngZone: NgZone) {}

  init(): void {
    if (this.lenis || typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5
      });

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              this.visibleTargets.add(el);
              el.style.willChange = 'transform';
            } else {
              this.visibleTargets.delete(el);
              el.style.willChange = 'auto';
              el.style.transform = '';
            }
          }
        },
        { rootMargin: '120px 0px' }
      );

      const targets = document.querySelectorAll<HTMLElement>('.elastic-scroll-target');
      targets.forEach((el) => this.observer?.observe(el));

      this.lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
        ScrollTrigger.update();
        this.targetVelocity = Math.max(-36, Math.min(36, e.velocity || 0));
        this.isSettled = false;

        const scrolledNow = e.scroll > 48;
        if (this.isScrolled() !== scrolledNow) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolledNow);
          });
        }
      });

      const stiffness = 0.14;
      const damping = 0.78;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.tickerFn = (time: number) => {
        this.lenis?.raf(time * 1000);

        if (!reducedMotion && !this.isSettled) {
          this.currentVelocity += (this.targetVelocity - this.currentVelocity) * 0.18;
          this.targetVelocity *= 0.86;

          const force = (this.currentVelocity - this.springValue) * stiffness;
          this.springVelocity = (this.springVelocity + force) * damping;
          this.springValue += this.springVelocity;

          if (
            Math.abs(this.springValue) < 0.01 &&
            Math.abs(this.springVelocity) < 0.01 &&
            Math.abs(this.targetVelocity) < 0.01
          ) {
            this.springValue = 0;
            this.springVelocity = 0;
            this.currentVelocity = 0;
            this.targetVelocity = 0;
            this.isSettled = true;
            this.visibleTargets.forEach((el) => {
              el.style.transform = '';
            });
            return;
          }

          const normalized = Math.max(-1, Math.min(1, this.springValue / 30));
          const stretchY = (1 + Math.abs(normalized) * 0.024).toFixed(4);
          const shiftY = (normalized * -6.5).toFixed(2);
          const transformStr = `translate3d(0, ${shiftY}px, 0) scaleY(${stretchY})`;

          this.visibleTargets.forEach((el) => {
            el.style.transform = transformStr;
          });
        }
      };

      gsap.ticker.add(this.tickerFn);
      gsap.ticker.lagSmoothing(0);
    });
  }

  scrollToSection(selector: string): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.lenis) {
        this.lenis.scrollTo(selector, { offset: -64, duration: 1.3 });
      } else {
        const target = document.querySelector(selector);
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  destroy(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.tickerFn) {
        gsap.ticker.remove(this.tickerFn);
        this.tickerFn = null;
      }
      this.observer?.disconnect();
      this.observer = null;
      this.visibleTargets.forEach((el) => {
        el.style.willChange = 'auto';
        el.style.transform = '';
      });
      this.visibleTargets.clear();
      this.lenis?.destroy();
      this.lenis = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
