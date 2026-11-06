import { Directive, ElementRef, HostListener, Input, NgZone, OnDestroy } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appMagneticSpring]',
  standalone: true
})
export class MagneticSpringDirective implements OnDestroy {
  @Input() magneticStrength = 0.28;
  @Input() magneticInnerSelector = '.magnetic-inner';

  private xTo: gsap.QuickToFunc | null = null;
  private yTo: gsap.QuickToFunc | null = null;
  private initialized = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {}

  private ensureInit(): void {
    if (this.initialized) return;
    this.initialized = true;
    const node = this.el.nativeElement;
    this.xTo = gsap.quickTo(node, 'x', { duration: 0.75, ease: 'elastic.out(1, 0.45)' });
    this.yTo = gsap.quickTo(node, 'y', { duration: 0.75, ease: 'elastic.out(1, 0.45)' });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ngZone.runOutsideAngular(() => {
      this.ensureInit();
      const node = this.el.nativeElement;
      const rect = node.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);

      this.xTo?.(relX * this.magneticStrength);
      this.yTo?.(relY * this.magneticStrength);

      const inner = node.querySelector<HTMLElement>(this.magneticInnerSelector);
      if (inner) {
        gsap.to(inner, {
          x: relX * (this.magneticStrength * 0.45),
          y: relY * (this.magneticStrength * 0.45),
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.ngZone.runOutsideAngular(() => {
      const node = this.el.nativeElement;
      gsap.to(node, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.05,
        ease: 'elastic.out(1, 0.38)',
        overwrite: 'auto'
      });

      const inner = node.querySelector<HTMLElement>(this.magneticInnerSelector);
      if (inner) {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.95,
          ease: 'elastic.out(1, 0.42)',
          overwrite: 'auto'
        });
      }
    });
  }

  ngOnDestroy(): void {
    gsap.killTweensOf(this.el.nativeElement);
  }
}
