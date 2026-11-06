import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

@Component({
  selector: 'app-instagram-editorial-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section class="relative py-24 sm:py-32 bg-vanilla-bone border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <h2 class="font-editorial text-4xl sm:text-5xl text-onyx-graphite leading-[1.08]">
              Diário visual &amp; <span class="italic font-light leading-[1.1] pb-1 inline-block">novas criações.</span>
            </h2>
            <p class="mt-3 text-sm sm:text-base text-mineral-taupe max-w-[52ch]">
              Acompanhe nossos lançamentos, composições e novidades da curadoria no Instagram oficial da Gotas de Ouro.
            </p>
          </div>

          <a
            [href]="instagramProfileUrl"
            target="_blank"
            rel="noopener noreferrer"
            appMagneticSpring
            [magneticStrength]="0.24"
            class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-onyx-graphite bg-soft-linen text-onyx-graphite text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-onyx-graphite hover:text-vanilla-bone self-start md:self-auto gpu-animated"
          >
            <span class="magnetic-inner inline-flex items-center gap-2 whitespace-nowrap">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Acompanhar no Instagram</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          <a
            [href]="instagramReelUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="lg:col-span-5 group relative rounded-t-full overflow-hidden border border-[#D8D3C8] bg-soft-linen p-3 flex flex-col justify-between"
          >
            <div class="relative overflow-hidden rounded-t-full aspect-[4/5] bg-onyx-graphite">
              <video
                #linenVideo
                src="assets/editorial/linen-macro-video.webm"
                poster="assets/editorial/joia-4-editorial.webp"
                preload="metadata"
                autoplay
                muted
                loop
                playsinline
                disablePictureInPicture
                class="w-full h-full object-cover gpu-animated"
              ></video>
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-vanilla-bone text-xs">
                <span class="font-editorial italic text-lg">Discreta no trabalho, impecável nos detalhes</span>
                <span class="px-3 py-1 rounded-full bg-onyx-graphite border border-[#D8D3C8]/40">Reel Oficial</span>
              </div>
            </div>
            <div class="pt-3 px-2 flex items-center justify-between text-xs text-mineral-taupe">
              <span>Ver publicação no Instagram</span>
              <span>Gotas de Ouro</span>
            </div>
          </a>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a
              [href]="instagramProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group border border-[#D8D3C8] bg-soft-linen p-3 rounded-2xl flex flex-col justify-between"
            >
              <div class="overflow-hidden rounded-xl aspect-[16/11]">
                <img
                  src="assets/editorial/editorial-macro-frame-2.webp"
                  alt="Composição delicada de semijoias Gotas de Ouro"
                  class="w-full h-full object-cover gpu-animated"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div class="pt-3 px-1 flex items-center justify-between text-xs text-mineral-taupe">
                <span>Brilho sutil &amp; elegância</span>
                <span>Curadoria Gotas de Ouro</span>
              </div>
            </a>

            <a
              [href]="instagramProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group border border-[#D8D3C8] bg-soft-linen p-3 rounded-2xl flex flex-col justify-between"
            >
              <div class="overflow-hidden rounded-xl aspect-[16/11]">
                <img
                  src="assets/editorial/editorial-macro-frame-3.webp"
                  alt="Detalhe de semijoia selecionada Gotas de Ouro"
                  class="w-full h-full object-cover gpu-animated"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div class="pt-3 px-1 flex items-center justify-between text-xs text-mineral-taupe">
                <span>Delicadeza em cada detalhe</span>
                <span>Acervo Selecionado</span>
              </div>
            </a>

            <div class="sm:col-span-2 border border-[#D8D3C8] bg-soft-linen p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
                  Deseja receber vídeos personalizados de uma peça?
                </p>
                <p class="text-xs sm:text-sm text-mineral-taupe mt-1 max-w-[50ch]">
                  Nossas consultoras enviam demonstrações em vídeo pelo WhatsApp e preparam seu envio para qualquer cidade do Brasil.
                </p>
              </div>
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.25"
                class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-celadon-slate shrink-0 self-start sm:self-auto gpu-animated"
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
      </div>
    </section>
  `
})
export class InstagramEditorialFeedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('linenVideo') linenVideo!: ElementRef<HTMLVideoElement>;

  readonly instagramProfileUrl = 'https://www.instagram.com/gotasdeouro.bonsucesso/';
  readonly instagramReelUrl = 'https://www.instagram.com/p/DeSDjxkhj4a/';
  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';

  private readonly ngZone = inject(NgZone);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const vid = this.linenVideo?.nativeElement;
      if (!vid) return;
      vid.muted = true;
      vid.disablePictureInPicture = true;

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        },
        { rootMargin: '120px 0px' }
      );
      this.observer.observe(vid);
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer?.disconnect();
      this.observer = null;
    });
  }
}
