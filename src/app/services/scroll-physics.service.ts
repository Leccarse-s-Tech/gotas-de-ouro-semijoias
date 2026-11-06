import { Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface QuickElasticTarget {
  el: HTMLElement;
  yTo: gsap.QuickToFunc;
  skewTo: gsap.QuickToFunc;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollPhysicsService implements OnDestroy {
  private lenis: Lenis | null = null;
  private tickerFn: ((time: number) => void) | null = null;
  private observer: IntersectionObserver | null = null;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private elasticTargets = new Map<HTMLElement, QuickElasticTarget>();

  readonly isScrolled = signal<boolean>(false);

  constructor(private ngZone: NgZone) {}

  init(): void {
    if (this.lenis || typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false
      });

      this.lenis.on('scroll', ScrollTrigger.update);

      this.tickerFn = (time: number) => {
        this.lenis?.raf(time * 1000);
      };

      gsap.ticker.add(this.tickerFn);
      gsap.ticker.lagSmoothing(0);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const clampVelocity = gsap.utils.clamp(-3, 3);

      if (!reducedMotion) {
        this.observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const target = this.elasticTargets.get(entry.target as HTMLElement);
              if (!target) continue;
              target.visible = entry.isIntersecting;
              target.el.style.willChange = entry.isIntersecting ? 'transform' : 'auto';
              if (!entry.isIntersecting) {
                target.yTo(0);
                target.skewTo(0);
              }
            }
          },
          { rootMargin: '100px 0px' }
        );

        const nodes = document.querySelectorAll<HTMLElement>('.showcase-elastic-frame');
        nodes.forEach((node) => {
          const item: QuickElasticTarget = {
            el: node,
            yTo: gsap.quickTo(node, 'y', { duration: 0.4, ease: 'power3.out' }),
            skewTo: gsap.quickTo(node, 'skewY', { duration: 0.4, ease: 'power3.out' }),
            visible: false
          };
          this.elasticTargets.set(node, item);
          this.observer?.observe(node);
        });
      }

      this.lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
        const scrolledNow = e.scroll > 48;
        if (this.isScrolled() !== scrolledNow) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolledNow);
          });
        }

        if (!reducedMotion && this.elasticTargets.size > 0) {
          const clamped = clampVelocity((e.velocity || 0) * 0.08);
          const shiftY = clamped * -2.2;
          const skewY = clamped * 0.35;

          this.elasticTargets.forEach((t) => {
            if (t.visible) {
              t.yTo(shiftY);
              t.skewTo(skewY);
            }
          });

          if (this.settleTimer) clearTimeout(this.settleTimer);
          this.settleTimer = setTimeout(() => {
            this.elasticTargets.forEach((t) => {
              if (t.visible) {
                t.yTo(0);
                t.skewTo(0);
              }
            });
          }, 90);
        }
      });
    });
  }

  scrollToSection(selector: string): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.lenis) {
        this.lenis.scrollTo(selector, { offset: -64, duration: 1.2 });
      } else {
        const target = document.querySelector(selector);
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  destroy(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.settleTimer) {
        clearTimeout(this.settleTimer);
        this.settleTimer = null;
      }
      if (this.tickerFn) {
        gsap.ticker.remove(this.tickerFn);
        this.tickerFn = null;
      }
      this.observer?.disconnect();
      this.observer = null;
      this.elasticTargets.forEach((t) => {
        t.el.style.willChange = 'auto';
        gsap.killTweensOf(t.el);
      });
      this.elasticTargets.clear();
      this.lenis?.destroy();
      this.lenis = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
