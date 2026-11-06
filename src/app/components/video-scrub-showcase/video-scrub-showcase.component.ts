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
      <div #pinContainer class="relative w-full min-h-[100dvh] flex flex-col justify-between pt-24 pb-10 sm:pt-28 sm:pb-12 px-4 sm:px-8 overflow-hidden">
        <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.14]"></div>

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
                class="h-full w-full bg-onyx-graphite origin-left scale-x-0"
              ></div>
            </div>
          </div>
        </div>

        <div class="relative z-10 my-auto py-6 flex items-center justify-center w-full">
          <div
            #scrubArchBox
            class="relative w-full max-w-[780px] h-[56dvh] sm:h-[62dvh] arch-mask-frame border border-travertine bg-onyx-graphite overflow-hidden"
          >
            <video
              #scrubVideo
              src="assets/editorial/scrub-showcase-video.webm"
              poster="assets/editorial/editorial-macro-frame-3.jpg"
              preload="metadata"
              muted
              playsinline
              disablePictureInPicture
              class="w-full h-full object-cover"
            ></video>

            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/65 via-transparent to-onyx-graphite/15"></div>

            <div class="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-vanilla-bone">
              <p class="font-editorial italic text-xl sm:text-3xl leading-[1.15] max-w-[38ch] text-vanilla-bone/95">
                Delicadeza em cada detalhe. Escolha sua peça com atendimento exclusivo pelo WhatsApp.
              </p>

              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.22"
                class="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-vanilla-bone text-onyx-graphite text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-travertine transition-colors self-start sm:self-auto shrink-0"
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
    </section>
  `
})
export class VideoScrubShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrubSection') scrubSection!: ElementRef<HTMLElement>;
  @ViewChild('pinContainer') pinContainer!: ElementRef<HTMLElement>;
  @ViewChild('scrubArchBox') scrubArchBox!: ElementRef<HTMLElement>;
  @ViewChild('scrubVideo') scrubVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';

  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;
  private observer: IntersectionObserver | null = null;
  private isVisible = false;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const video = this.scrubVideo?.nativeElement;
      const archBox = this.scrubArchBox?.nativeElement;
      const pinEl = this.pinContainer?.nativeElement;
      const barEl = this.progressBar?.nativeElement;

      if (!video || !archBox || !pinEl || !barEl) return;

      video.muted = true;
      video.disablePictureInPicture = true;
      video.pause();

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          this.isVisible = Boolean(entry?.isIntersecting);
          archBox.style.willChange = this.isVisible ? 'transform, clip-path' : 'auto';
          barEl.style.willChange = this.isVisible ? 'transform' : 'auto';
        },
        { rootMargin: '150px 0px' }
      );
      this.observer.observe(pinEl);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const timeProxy = { t: 0 };
      const scrubToTime = gsap.quickTo(timeProxy, 't', {
        duration: 0.22,
        ease: 'power2.out',
        onUpdate: () => {
          if (this.isVisible && video.readyState >= 1 && !video.seeking) {
            video.currentTime = timeProxy.t;
          }
        }
      });

      this.ctx = gsap.context(() => {
        gsap.set(archBox, {
          maxWidth: '720px',
          borderTopLeftRadius: '999px',
          borderTopRightRadius: '999px'
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(barEl, { scaleX: p });

              if (this.isVisible) {
                const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 6;
                const targetTime = Math.min(dur - 0.05, Math.max(0, p * dur));
                scrubToTime(targetTime);
              }
            }
          }
        });

        tl.to(archBox, {
          maxWidth: '1400px',
          width: '100%',
          height: '66dvh',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          ease: 'elastic.out(1, 0.65)',
          duration: 1
        });
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
      if (this.progressBar?.nativeElement) {
        this.progressBar.nativeElement.style.willChange = 'auto';
      }
      this.ctx?.revert();
    });
  }
}
