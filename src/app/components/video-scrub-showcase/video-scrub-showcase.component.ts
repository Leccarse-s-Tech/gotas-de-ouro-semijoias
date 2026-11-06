import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-video-scrub-showcase',
  standalone: true,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="atelier-filme" #scrubSection class="relative bg-soft-linen border-t border-travertine">
      <div #pinContainer class="relative w-full min-h-[100dvh] flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-8 overflow-hidden">
        <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-20 mix-blend-multiply"></div>

        <div class="relative z-20 max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 class="font-editorial text-3xl sm:text-5xl text-onyx-graphite leading-[1.08]">
              Matéria, refração e <span class="italic font-light leading-[1.1] pb-1 inline-block">movimento tátil.</span>
            </h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs text-mineral-taupe">
              {{ activeStageLabel() }}
            </span>
            <div class="w-28 h-[1px] bg-travertine overflow-hidden">
              <div
                class="h-full bg-onyx-graphite transition-all duration-150"
                [style.width.%]="scrubPercent()"
              ></div>
            </div>
          </div>
        </div>

        <div class="relative z-10 my-auto py-6 flex items-center justify-center w-full">
          <div
            #scrubArchBox
            class="relative w-full max-w-[780px] h-[62dvh] sm:h-[68dvh] arch-mask-frame border border-travertine bg-onyx-graphite overflow-hidden"
          >
            <video
              #scrubVideo
              src="assets/editorial/scrub-showcase-video.webm"
              poster="assets/editorial/editorial-macro-frame-3.jpg"
              muted
              playsinline
              preload="auto"
              class="w-full h-full object-cover"
            ></video>

            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/70 via-transparent to-onyx-graphite/20"></div>

            <div class="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-vanilla-bone">
              <div class="max-w-[46ch]">
                <p class="font-editorial italic text-2xl sm:text-4xl leading-[1.1] pb-1">
                  {{ activeStageTitle() }}
                </p>
                <p class="text-xs sm:text-sm text-soft-linen/85 mt-1.5 leading-relaxed">
                  {{ activeStageCopy() }}
                </p>
              </div>

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
            <span class="font-editorial italic text-lg text-onyx-graphite">Cravação Precisa</span>
            <span class="text-xs text-mineral-taupe">Moissanite e Zircônia de lapidação ótica</span>
          </div>
          <div class="flex items-baseline justify-between sm:justify-start gap-3">
            <span class="font-editorial italic text-lg text-onyx-graphite">Superfície Acetinada</span>
            <span class="text-xs text-mineral-taupe">Escovação artesanal de toque macio</span>
          </div>
          <div class="flex items-baseline justify-between sm:justify-start gap-3">
            <span class="font-editorial italic text-lg text-onyx-graphite">Consultoria Direta</span>
            <span class="text-xs text-mineral-taupe">Vídeos reais das peças via WhatsApp</span>
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

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  readonly scrubPercent = signal<number>(0);
  readonly activeStageLabel = signal<string>('Estudo Óptico em Movimento');
  readonly activeStageTitle = signal<string>('Textura acetinada sob luz de fim de tarde');
  readonly activeStageCopy = signal<string>(
    'O contraste entre o linho natural rústico e as pétalas escovadas revela a profundidade do acabamento artesanal.'
  );

  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    const video = this.scrubVideo?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.pause();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const archBox = this.scrubArchBox.nativeElement;
        const pinEl = this.pinContainer.nativeElement;

        gsap.set(archBox, {
          maxWidth: '720px',
          borderTopLeftRadius: '999px',
          borderTopRightRadius: '999px'
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 1.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 6;
              if (video.readyState >= 1) {
                video.currentTime = Math.min(dur - 0.04, Math.max(0, p * dur));
              }

              const pct = Math.round(p * 100);
              this.ngZone.run(() => {
                this.scrubPercent.set(pct);
                if (p < 0.34) {
                  this.activeStageLabel.set('Estudo I - Linho & Metal Escovado');
                  this.activeStageTitle.set('Textura acetinada sob luz de fim de tarde');
                  this.activeStageCopy.set(
                    'O contraste entre o linho natural rústico e as pétalas escovadas revela a profundidade do acabamento artesanal.'
                  );
                } else if (p < 0.68) {
                  this.activeStageLabel.set('Estudo II - Dispersão Cristalina');
                  this.activeStageTitle.set('Refração óptica da trilogia Moissanite');
                  this.activeStageCopy.set(
                    'Três pedras de lapidação precisa repousam sobre fibras de algodão artesanal, capturando cada feixe de luz difusa.'
                  );
                } else {
                  this.activeStageLabel.set('Estudo III - Pétalas de Luz');
                  this.activeStageTitle.set('Delicadeza botânica em banho nobre');
                  this.activeStageCopy.set(
                    'Solicite vídeos em tempo real no WhatsApp e receba sua peça escolhida em qualquer cidade do Brasil.'
                  );
                }
              });
            }
          }
        });

        tl.to(archBox, {
          maxWidth: '1400px',
          width: '100%',
          height: '72dvh',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          ease: 'elastic.out(1, 0.65)',
          duration: 1
        });
      }, this.scrubSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
