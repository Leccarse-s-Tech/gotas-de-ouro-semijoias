import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import { ScrollPhysicsService } from '../../services/scroll-physics.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-editorial',
  standalone: true,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="topo" #heroSection class="relative bg-vanilla-bone overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-25 mix-blend-multiply"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 pt-24 pb-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end elastic-scroll-target">
          <div class="lg:col-span-8">
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-4">
              Alta Curadoria em Semijoias - Envio para todo o Brasil
            </p>
            <h1 class="font-editorial text-5xl sm:text-6xl lg:text-[76px] leading-[1.04] tracking-tight text-onyx-graphite font-normal">
              A poesia da matéria em <span class="italic font-light leading-[1.1] pb-1 inline-block">formas eternas.</span>
            </h1>
          </div>

          <div class="lg:col-span-4 flex flex-col items-start lg:items-end justify-end gap-5">
            <p class="text-sm sm:text-[15px] text-mineral-taupe leading-relaxed max-w-[38ch] lg:text-right">
              Peças esculpidas para iluminar a pele com delicadeza mineral e consultoria individualizada para todo o país.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.28"
                class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-[13px] font-medium tracking-[0.04em] hover:bg-celadon-slate transition-colors duration-300 active:scale-[0.98]"
              >
                <span class="magnetic-inner inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span>Atendimento Exclusivo</span>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </a>

              <a
                href="#colecoes"
                (click)="scrollToCollections($event)"
                appMagneticSpring
                [magneticStrength]="0.2"
                class="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-travertine bg-soft-linen/80 text-onyx-graphite text-[13px] font-medium hover:border-celadon-slate transition-colors duration-300"
              >
                <span class="magnetic-inner whitespace-nowrap">Explorar Acervo</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div #archPinWrapper class="relative w-full min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 pb-8">
        <div
          #archContainer
          class="relative w-full max-w-[680px] h-[74dvh] sm:h-[80dvh] arch-mask-frame border border-travertine bg-travertine/40 overflow-hidden shadow-[0_24px_60px_rgba(30,30,28,0.08)]"
        >
          <video
            #heroVideo
            src="assets/editorial/hero-arch-video.webm"
            poster="assets/editorial/editorial-macro-frame-2.jpg"
            muted
            loop
            playsinline
            preload="auto"
            class="w-full h-full object-cover scale-105"
          ></video>

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/55 via-onyx-graphite/10 to-transparent"></div>

          <div
            #archOverlayText
            class="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-vanilla-bone"
          >
            <div>
              <p class="font-editorial italic text-2xl sm:text-4xl leading-[1.1] pb-1">
                Luz, pedra travertino e metal nobre
              </p>
              <p class="text-xs sm:text-sm text-soft-linen/85 max-w-[46ch] mt-1">
                Cada peça é selecionada individualmente e enviada em embalagem de algodão com acabamento em relevo seco.
              </p>
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-onyx-graphite/75 backdrop-blur-md border border-travertine/30 text-vanilla-bone text-xs whitespace-nowrap self-start sm:self-auto">
              <span>Despacho Segurado Nacional</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroEditorialComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('archPinWrapper') archPinWrapper!: ElementRef<HTMLElement>;
  @ViewChild('archContainer') archContainer!: ElementRef<HTMLElement>;
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('archOverlayText') archOverlayText!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly scrollService = inject(ScrollPhysicsService);
  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;

  scrollToCollections(event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection('#colecoes');
  }

  ngAfterViewInit(): void {
    const videoEl = this.heroVideo?.nativeElement;
    if (videoEl) {
      videoEl.muted = true;
      videoEl.play().catch(() => {});
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const arch = this.archContainer.nativeElement;
        const wrapper = this.archPinWrapper.nativeElement;
        const overlay = this.archOverlayText.nativeElement;

        gsap.set(arch, {
          maxWidth: '640px',
          height: '74dvh',
          borderTopLeftRadius: '999px',
          borderTopRightRadius: '999px'
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=115%',
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        });

        tl.to(arch, {
          maxWidth: '1400px',
          width: '100%',
          height: '92dvh',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          ease: 'elastic.out(1, 0.75)',
          duration: 1
        }, 0);

        tl.fromTo(overlay,
          { y: 24, opacity: 0.75 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 },
          0.1
        );

        if (videoEl) {
          videoEl.addEventListener('loadedmetadata', () => {
            const dur = videoEl.duration || 5;
            ScrollTrigger.create({
              trigger: wrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
              onUpdate: (self) => {
                if (videoEl.readyState >= 2 && Number.isFinite(dur) && dur > 0) {
                  videoEl.currentTime = Math.min(dur - 0.05, Math.max(0, self.progress * dur));
                }
              }
            });
          }, { once: true });
        }
      }, this.heroSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
