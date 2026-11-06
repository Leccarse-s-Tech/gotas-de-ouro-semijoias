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
    <section id="atelier-filme" #scrubSection class="relative bg-soft-linen border-t border-travertine">
      <div #scrubScrollTrack class="relative h-[200vh] w-full">
        <div class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-10 sm:pt-28 sm:pb-12 px-4 sm:px-8">
          <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

          <div class="relative z-20 max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-2">
                Matéria &amp; Luz
              </p>
              <h2 class="font-editorial text-3xl sm:text-5xl text-onyx-graphite leading-[1.08]">
                Brilho sutil e <span class="italic font-light leading-[1.1] pb-1 inline-block">movimento delicado.</span>
              </h2>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xs text-mineral-taupe">
                Filme Editorial
              </span>
              <div class="w-28 h-[1px] bg-travertine overflow-hidden">
                <div
                  #progressBar
                  class="h-full w-full bg-onyx-graphite origin-left scale-x-0 gpu-animated"
                ></div>
              </div>
            </div>
          </div>

          <div class="relative z-10 my-auto py-4 flex items-center justify-center w-full">
            <div
              #scrubArchBox
              class="relative w-full max-w-[1400px] h-[64vh] sm:h-[68vh] rounded-t-full border border-travertine bg-onyx-graphite overflow-hidden gpu-animated"
            >
              <video
                #scrubVideo
                src="assets/editorial/scrub-showcase-video.webm"
                poster="assets/editorial/editorial-macro-frame-3.webp"
                preload="metadata"
                autoplay
                loop
                muted
                playsinline
                disablePictureInPicture
                class="w-full h-full object-cover gpu-animated"
              ></video>

              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/65 via-transparent to-onyx-graphite/15"></div>

              <div class="absolute inset-x-0 bottom-8 sm:bottom-10 px-6 flex flex-col items-center justify-center text-center gap-4 text-vanilla-bone gpu-animated">
                <p class="font-editorial italic text-xl sm:text-2xl leading-[1.2] max-w-[34ch] text-vanilla-bone">
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
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div class="relative z-20 max-w-[1400px] w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-travertine">
            <div class="flex items-baseline justify-between sm:justify-start gap-3">
              <span class="font-editorial italic text-lg text-onyx-graphite">Acabamento Primoroso</span>
              <span class="text-xs text-mineral-taupe">Seleção cuidadosa em cada detalhe</span>
            </div>
            <div class="flex items-baseline justify-between sm:justify-start gap-3">
              <span class="font-editorial italic text-lg text-onyx-graphite">Consultoria Direta</span>
              <span class="text-xs text-mineral-taupe">Vídeos reais das peças via WhatsApp</span>
            </div>
            <div class="flex items-baseline justify-between sm:justify-start gap-3">
              <span class="font-editorial italic text-lg text-onyx-graphite">Envio Nacional</span>
              <span class="text-xs text-mineral-taupe">Atendimento para todo o Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class VideoScrubShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrubSection') scrubSection!: ElementRef<HTMLElement>;
  @ViewChild('scrubScrollTrack') scrubScrollTrack!: ElementRef<HTMLElement>;
  @ViewChild('scrubArchBox') scrubArchBox!: ElementRef<HTMLElement>;
  @ViewChild('scrubVideo') scrubVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';

  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const video = this.scrubVideo?.nativeElement;
      const archBox = this.scrubArchBox?.nativeElement;
      const trackEl = this.scrubScrollTrack?.nativeElement;
      const barEl = this.progressBar?.nativeElement;

      if (!video || !archBox || !trackEl || !barEl) return;

      video.muted = true;
      video.disablePictureInPicture = true;

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isVisible = Boolean(entry?.isIntersecting);
          if (isVisible) {
            archBox.style.willChange = 'transform';
            video.style.willChange = 'transform';
            barEl.style.willChange = 'transform';
            video.play().catch(() => {});
          } else {
            archBox.style.willChange = 'auto';
            video.style.willChange = 'auto';
            barEl.style.willChange = 'auto';
            video.pause();
          }
        },
        { rootMargin: '150px 0px' }
      );
      this.observer.observe(trackEl);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const setBarScale = gsap.quickSetter(barEl, 'scaleX');

      this.ctx = gsap.context(() => {
        gsap.set(archBox, {
          scale: 0.75,
          force3D: true
        });

        gsap.set(video, {
          scale: 1.2,
          force3D: true
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trackEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setBarScale(self.progress);
            }
          }
        });

        tl.to(
          archBox,
          {
            scale: 1,
            force3D: true,
            ease: 'power2.out',
            duration: 1
          },
          0
        );

        tl.to(
          video,
          {
            scale: 1,
            force3D: true,
            ease: 'power2.out',
            duration: 1
          },
          0
        );
      }, this.scrubSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer?.disconnect();
      this.observer = null;
      if (this.scrubArchBox?.nativeElement) {
        this.scrubArchBox.nativeElement.style.willChange = 'auto';
      }
      if (this.scrubVideo?.nativeElement) {
        this.scrubVideo.nativeElement.style.willChange = 'auto';
      }
      if (this.progressBar?.nativeElement) {
        this.progressBar.nativeElement.style.willChange = 'auto';
      }
      this.ctx?.revert();
    });
  }
}
