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
    <section id="topo" #heroSection class="relative bg-vanilla-bone overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 pt-24 pb-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
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
              Peças selecionadas para iluminar a pele com delicadeza e atendimento individualizado para todo o país.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.28"
                class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-[13px] font-medium tracking-[0.04em] hover:bg-celadon-slate"
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
                class="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-travertine bg-soft-linen text-onyx-graphite text-[13px] font-medium hover:border-celadon-slate"
              >
                <span class="magnetic-inner whitespace-nowrap">Explorar Acervo</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div #archPinWrapper class="relative w-full min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 pt-20 pb-6">
        <div
          #archContainer
          class="relative w-full max-w-[1400px] h-[80dvh] sm:h-[84dvh] border border-travertine bg-travertine/40 overflow-hidden"
        >
          <video
            #heroVideo
            src="assets/editorial/hero-arch-video.webm"
            poster="assets/editorial/editorial-macro-frame-2.jpg"
            preload="metadata"
            autoplay
            muted
            loop
            playsinline
            disablePictureInPicture
            class="w-full h-full object-cover"
          ></video>

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/55 via-transparent to-transparent"></div>

          <div
            #archOverlayText
            class="absolute inset-x-0 bottom-8 sm:bottom-12 px-6 flex flex-col items-center justify-center text-center text-vanilla-bone"
          >
            <p class="font-editorial italic text-xl sm:text-2xl leading-[1.2] max-w-[38ch] text-vanilla-bone">
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
  @ViewChild('archPinWrapper') archPinWrapper!: ElementRef<HTMLElement>;
  @ViewChild('archContainer') archContainer!: ElementRef<HTMLElement>;
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('archOverlayText') archOverlayText!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly scrollService = inject(ScrollPhysicsService);
  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;
  private observer: IntersectionObserver | null = null;

  scrollToCollections(event: Event): void {
    event.preventDefault();
    this.scrollService.scrollToSection('#colecoes');
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const videoEl = this.heroVideo?.nativeElement;
      const arch = this.archContainer?.nativeElement;
      const wrapper = this.archPinWrapper?.nativeElement;
      const overlay = this.archOverlayText?.nativeElement;

      if (!videoEl || !arch || !wrapper || !overlay) return;

      videoEl.muted = true;
      videoEl.disablePictureInPicture = true;

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isVisible = Boolean(entry?.isIntersecting);
          if (isVisible) {
            arch.style.willChange = 'clip-path';
            videoEl.style.willChange = 'transform';
            videoEl.play().catch(() => {});
          } else {
            arch.style.willChange = 'auto';
            videoEl.style.willChange = 'auto';
            videoEl.pause();
          }
        },
        { rootMargin: '150px 0px' }
      );
      this.observer.observe(wrapper);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.ctx = gsap.context(() => {
        gsap.set(arch, {
          clipPath: 'inset(6% 22% 4% 22% round 999px 999px 0px 0px)'
        });

        gsap.set(videoEl, {
          scale: 1.15,
          force3D: true
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=105%',
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        });

        tl.to(
          arch,
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
            ease: 'power2.out',
            duration: 1
          },
          0
        );

        tl.to(
          videoEl,
          {
            scale: 1,
            force3D: true,
            ease: 'power2.out',
            duration: 1
          },
          0
        );

        tl.fromTo(
          overlay,
          { y: 16, opacity: 0.75, force3D: true },
          { y: 0, opacity: 1, force3D: true, ease: 'power2.out', duration: 0.8 },
          0.1
        );
      }, this.heroSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer?.disconnect();
      this.observer = null;
      if (this.archContainer?.nativeElement) {
        this.archContainer.nativeElement.style.willChange = 'auto';
      }
      if (this.heroVideo?.nativeElement) {
        this.heroVideo.nativeElement.style.willChange = 'auto';
      }
      this.ctx?.revert();
    });
  }
}
