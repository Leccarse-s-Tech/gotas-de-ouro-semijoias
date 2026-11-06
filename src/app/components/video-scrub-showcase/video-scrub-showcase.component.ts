import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-video-scrub-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="atelier-filme" #scrubSection class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-8 xl:px-12 bg-soft-linen border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

      <div class="relative z-10 w-full max-w-full xl:max-w-[1540px] 2xl:max-w-[1720px] mx-auto">
        <div #scrubHeader class="w-full max-w-5xl xl:max-w-none mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 opacity-0 gpu-animated">
          <div>
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-2">
              Matéria &amp; Luz
            </p>
            <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight text-onyx-graphite">
              Brilho sutil e <span class="italic font-light leading-[1.1] pb-1 inline-block">movimento delicado.</span>
            </h2>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-xs text-mineral-taupe">
              Filme Editorial
            </span>
            <div class="w-24 sm:w-28 h-[1px] bg-travertine overflow-hidden">
              <div
                #progressBar
                class="h-full w-full bg-onyx-graphite origin-left scale-x-0 gpu-animated"
              ></div>
            </div>
          </div>
        </div>

        <div
          #scrubArchBox
          class="w-full max-w-5xl xl:max-w-none mx-auto rounded-t-[999px] rounded-b-2xl overflow-hidden relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10] xl:aspect-[21/9] 2xl:aspect-[2.35/1] border border-travertine bg-onyx-graphite gpu-animated"
        >
          <video
            #scrubVideo
            src="assets/editorial/scrub-showcase-video.mp4"
            poster="assets/editorial/editorial-macro-frame-3.webp"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            disablePictureInPicture
            class="w-full h-full object-cover gpu-animated"
          ></video>

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/65 via-onyx-graphite/15 to-transparent"></div>

          <div
            #scrubOverlayText
            class="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-14 flex flex-col items-center justify-end text-center gap-4 text-vanilla-bone opacity-0 gpu-animated"
          >
            <p class="font-editorial italic max-w-md mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-vanilla-bone">
              Delicadeza em cada detalhe. Escolha sua peça com atendimento exclusivo pelo WhatsApp.
            </p>

            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              appMagneticSpring
              [magneticStrength]="0.22"
              class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-vanilla-bone text-onyx-graphite text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-travertine shrink-0 gpu-animated"
            >
              <span class="magnetic-inner inline-flex items-center gap-2 whitespace-nowrap">
                <span>Atendimento Exclusivo</span>
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        <div #scrubFooterBlock class="w-full max-w-5xl xl:max-w-none mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center md:text-left mt-8 pt-6 border-t border-travertine">
          <div class="scrub-footer-item flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-baseline justify-center md:justify-start gap-1 sm:gap-2.5 opacity-0 gpu-animated">
            <span class="font-editorial italic text-lg text-onyx-graphite">Acabamento Primoroso</span>
            <span class="text-xs text-mineral-taupe">Seleção cuidadosa em cada detalhe</span>
          </div>
          <div class="scrub-footer-item flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-baseline justify-center md:justify-start gap-1 sm:gap-2.5 opacity-0 gpu-animated">
            <span class="font-editorial italic text-lg text-onyx-graphite">Consultoria Direta</span>
            <span class="text-xs text-mineral-taupe">Vídeos reais das peças via WhatsApp</span>
          </div>
          <div class="scrub-footer-item flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-baseline justify-center md:justify-start gap-1 sm:gap-2.5 opacity-0 gpu-animated">
            <span class="font-editorial italic text-lg text-onyx-graphite">Envio Nacional</span>
            <span class="text-xs text-mineral-taupe">Atendimento para todo o Brasil</span>
          </div>
        </div>
      </div>
    </section>
  `
})
export class VideoScrubShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrubSection') scrubSection!: ElementRef<HTMLElement>;
  @ViewChild('scrubHeader') scrubHeader!: ElementRef<HTMLElement>;
  @ViewChild('scrubArchBox') scrubArchBox!: ElementRef<HTMLElement>;
  @ViewChild('scrubVideo') scrubVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('scrubOverlayText') scrubOverlayText!: ElementRef<HTMLElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLElement>;
  @ViewChild('scrubFooterBlock') scrubFooterBlock!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';

  private readonly ngZone = inject(NgZone);
  private mm: gsap.MatchMedia | null = null;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const sectionEl = this.scrubSection?.nativeElement;
      const headerEl = this.scrubHeader?.nativeElement;
      const videoEl = this.scrubVideo?.nativeElement;
      const archBox = this.scrubArchBox?.nativeElement;
      const overlayEl = this.scrubOverlayText?.nativeElement;
      const barEl = this.progressBar?.nativeElement;
      const footerEl = this.scrubFooterBlock?.nativeElement;

      if (!sectionEl || !headerEl || !videoEl || !archBox || !overlayEl || !barEl || !footerEl) return;

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

      const setBarScale = gsap.quickSetter(barEl, 'scaleX');
      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          headerEl,
          { y: 35, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5
            }
          }
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: archBox,
            start: 'top 85%',
            end: 'center center',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setBarScale(self.progress);
            }
          }
        });

        tl.fromTo(
          archBox,
          {
            scale: 0.72,
            y: 60,
            clipPath: 'inset(14% 18% 0% 18% round 999px 999px 20px 20px)',
            transformOrigin: 'center center',
            force3D: true
          },
          {
            scale: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 20px 20px)',
            ease: 'none',
            force3D: true
          },
          0
        );

        tl.fromTo(
          videoEl,
          { scale: 1.25, force3D: true },
          { scale: 1, ease: 'none', force3D: true },
          0
        );

        tl.fromTo(
          overlayEl,
          { y: 25, opacity: 0, force3D: true },
          { y: 0, opacity: 1, ease: 'power2.out', force3D: true },
          0.35
        );

        const footerItems = footerEl.querySelectorAll<HTMLElement>('.scrub-footer-item');
        gsap.fromTo(
          footerItems,
          { y: 30, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: footerEl,
              start: 'top 92%',
              end: 'top 65%',
              scrub: 0.5
            }
          }
        );
      });

      this.mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          headerEl,
          { y: 20, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 0.5
            }
          }
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: archBox,
            start: 'top 90%',
            end: 'center center',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setBarScale(self.progress);
            }
          }
        });

        tl.fromTo(
          archBox,
          {
            scale: 0.88,
            y: 30,
            clipPath: 'inset(8% 6% 0% 6% round 999px 999px 16px 16px)',
            transformOrigin: 'center center',
            force3D: true
          },
          {
            scale: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 16px 16px)',
            ease: 'none',
            force3D: true
          },
          0
        );

        tl.fromTo(
          videoEl,
          { scale: 1.15, force3D: true },
          { scale: 1, ease: 'none', force3D: true },
          0
        );

        tl.fromTo(
          overlayEl,
          { y: 15, opacity: 0, force3D: true },
          { y: 0, opacity: 1, ease: 'power2.out', force3D: true },
          0.3
        );

        const footerItems = footerEl.querySelectorAll<HTMLElement>('.scrub-footer-item');
        gsap.fromTo(
          footerItems,
          { y: 20, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: footerEl,
              start: 'top 95%',
              end: 'top 75%',
              scrub: 0.5
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
