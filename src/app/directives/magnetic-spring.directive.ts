import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appMagneticSpring]',
  standalone: true
})
export class MagneticSpringDirective implements AfterViewInit, OnDestroy {
  @Input() magneticStrength = 0.28;
  @Input() magneticInnerSelector = '.magnetic-inner';

  private xTo: gsap.QuickToFunc | null = null;
  private yTo: gsap.QuickToFunc | null = null;
  private innerXTo: gsap.QuickToFunc | null = null;
  private innerYTo: gsap.QuickToFunc | null = null;
  private initialized = false;

  private readonly handleMouseMove = (event: MouseEvent): void => {
    this.ensureInit();
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);

    this.xTo?.(relX * this.magneticStrength);
    this.yTo?.(relY * this.magneticStrength);
    this.innerXTo?.(relX * (this.magneticStrength * 0.45));
    this.innerYTo?.(relY * (this.magneticStrength * 0.45));
  };

  private readonly handleMouseLeave = (): void => {
    const node = this.el.nativeElement;
    this.xTo?.(0);
    this.yTo?.(0);
    this.innerXTo?.(0);
    this.innerYTo?.(0);
    node.style.willChange = 'auto';
  };

  private readonly handleMouseEnter = (): void => {
    this.el.nativeElement.style.willChange = 'transform';
  };

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const node = this.el.nativeElement;
      node.addEventListener('mouseenter', this.handleMouseEnter, { passive: true });
      node.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      node.addEventListener('mouseleave', this.handleMouseLeave, { passive: true });
    });
  }

  private ensureInit(): void {
    if (this.initialized) return;
    this.initialized = true;
    const node = this.el.nativeElement;
    this.xTo = gsap.quickTo(node, 'x', { duration: 0.75, ease: 'elastic.out(1, 0.45)' });
    this.yTo = gsap.quickTo(node, 'y', { duration: 0.75, ease: 'elastic.out(1, 0.45)' });

    const inner = node.querySelector<HTMLElement>(this.magneticInnerSelector);
    if (inner) {
      this.innerXTo = gsap.quickTo(inner, 'x', { duration: 0.55, ease: 'power3.out' });
      this.innerYTo = gsap.quickTo(inner, 'y', { duration: 0.55, ease: 'power3.out' });
    }
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      const node = this.el.nativeElement;
      node.removeEventListener('mouseenter', this.handleMouseEnter);
      node.removeEventListener('mousemove', this.handleMouseMove);
      node.removeEventListener('mouseleave', this.handleMouseLeave);
      node.style.willChange = 'auto';
      gsap.killTweensOf(node);
      const inner = node.querySelector<HTMLElement>(this.magneticInnerSelector);
      if (inner) {
        gsap.killTweensOf(inner);
      }
    });
  }
}
