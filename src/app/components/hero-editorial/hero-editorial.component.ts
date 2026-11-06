import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import { ScrollPhysicsService } from '../../services/scroll-physics.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-editorial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="topo" #heroSection class="relative w-full max-w-full overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 bg-vanilla-bone">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-10 sm:mb-14">
          <div class="lg:col-span-7 min-w-0">
            <p class="text-[11px] uppercase tracking-[0.22em] text-mineral-taupe mb-3 sm:mb-4">
              Alta Curadoria em Semijoias - Envio para todo o Brasil
            </p>
            <h1 class="font-editorial text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[1.06] tracking-tight text-onyx-graphite font-normal">
              A poesia da matéria em <span class="italic font-light leading-[1.1] pb-1 inline-block">formas eternas.</span>
            </h1>
          </div>

          <div class="lg:col-span-5 flex flex-col items-start lg:items-end justify-end gap-5 min-w-0">
            <p class="text-sm sm:text-base text-mineral-taupe leading-relaxed max-w-[40ch] lg:text-right">
              Peças selecionadas para iluminar a pele com delicadeza e atendimento individualizado para todo o país.
            </p>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.28"
                class="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.04em] hover:bg-celadon-slate gpu-animated"
              >
                <span class="magnetic-inner inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span>Atendimento Exclusivo</span>
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </a>

              <a
                href="#colecoes"
                (click)="scrollToCollections($event)"
                appMagneticSpring
                [magneticStrength]="0.2"
                class="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-travertine bg-soft-linen text-onyx-graphite text-xs sm:text-[13px] font-medium hover:border-celadon-slate gpu-animated"
              >
                <span class="magnetic-inner whitespace-nowrap">Explorar Acervo</span>
              </a>
            </div>
          </div>
        </div>

        <div
          #archContainer
          class="w-full max-w-5xl mx-auto rounded-t-[999px] rounded-b-2xl overflow-hidden relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/10] border border-travertine bg-travertine/40 gpu-animated"
        >
          <video
            #heroVideo
            src="assets/editorial/hero-arch-video.mp4"
            poster="assets/editorial/editorial-macro-frame-2.webp"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            disablePictureInPicture
            class="w-full h-full object-cover gpu-animated"
          ></video>

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/60 via-onyx-graphite/15 to-transparent"></div>

          <div
            #archOverlayText
            class="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-14 flex flex-col items-center justify-end text-center text-vanilla-bone gpu-animated"
          >
            <p class="font-editorial italic max-w-md mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-vanilla-bone">
              Delicadeza em cada detalhe. Escolha sua peça com atendimento exclusivo pelo WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroEditorialComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('archContainer') archContainer!: ElementRef<HTMLElement>;
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('archOverlayText') archOverlayText!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly scrollService = inject(ScrollPhysicsService);
  private readonly ngZone = inject(NgZone);
  private mm: gsap.MatchMedia | null = null;
  private observer: IntersectionObserver | null = null;

  scrollToCollections(event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection('#colecoes');
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const videoEl = this.heroVideo?.nativeElement;
      const arch = this.archContainer?.nativeElement;
      const overlay = this.archOverlayText?.nativeElement;

      if (!videoEl || !arch || !overlay) return;

      videoEl.muted = true;
      videoEl.disablePictureInPicture = true;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.15 }
      );
      this.observer.observe(videoEl);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          arch,
          { scale: 0.88, force3D: true },
          {
            scale: 1,
            force3D: true,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: arch,
              start: 'top 88%',
              end: 'top 20%',
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          }
        );

        gsap.fromTo(
          overlay,
          { y: 18, opacity: 0.85, force3D: true },
          {
            y: 0,
            opacity: 1,
            force3D: true,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: arch,
              start: 'top 85%',
              end: 'top 25%',
              scrub: 0.6
            }
          }
        );
      });

      this.mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          arch,
          { scale: 0.94, force3D: true },
          {
            scale: 1,
            force3D: true,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: arch,
              start: 'top 92%',
              end: 'top 30%',
              scrub: 0.5,
              invalidateOnRefresh: true
            }
          }
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer?.disconnect();
      this.observer = null;
      this.mm?.revert();
      this.mm = null;
    });
  }
}
