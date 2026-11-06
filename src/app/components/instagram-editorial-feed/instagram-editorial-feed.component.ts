import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-instagram-editorial-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section #feedSection class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-8 xl:px-12 bg-vanilla-bone border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div #feedHeader class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14 opacity-0 gpu-animated">
          <div class="min-w-0">
            <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl text-onyx-graphite leading-tight">
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
            class="w-fit inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-onyx-graphite bg-soft-linen text-onyx-graphite text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-onyx-graphite hover:text-vanilla-bone shrink-0 gpu-animated"
          >
            <span class="magnetic-inner inline-flex items-center gap-2 whitespace-nowrap">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Acompanhar no Instagram</span>
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <a
            #feedArchCard
            [href]="instagramReelUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="lg:col-span-5 group relative rounded-t-[999px] rounded-b-2xl overflow-hidden border border-travertine bg-soft-linen p-3 flex flex-col justify-between min-w-0 opacity-0 gpu-animated"
          >
            <div class="relative overflow-hidden rounded-t-[999px] rounded-b-xl aspect-[4/5] bg-onyx-graphite">
              <img
                src="assets/editorial/joia-4-editorial.webp"
                alt="Curadoria de semijoias Gotas de Ouro no Instagram"
                class="feed-arch-photo w-full h-full object-cover gpu-animated"
                loading="eager"
                decoding="async"
              />
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-vanilla-bone text-xs">
                <span class="font-editorial italic text-base sm:text-lg leading-snug truncate">Discreta no trabalho, impecável nos detalhes</span>
                <span class="px-3 py-1 rounded-full bg-onyx-graphite border border-travertine/40 shrink-0">Destaque</span>
              </div>
            </div>
            <div class="pt-3 px-2 flex items-center justify-between gap-2 text-xs text-mineral-taupe">
              <span class="truncate">Ver publicação no Instagram</span>
              <span class="shrink-0">Gotas de Ouro</span>
            </div>
          </a>

          <div #feedRightColumn class="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-6 min-w-0">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <a
                [href]="instagramProfileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="feed-stagger-item group border border-travertine bg-soft-linen p-3 rounded-2xl flex flex-col justify-between min-w-0 opacity-0 gpu-animated"
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
                <div class="pt-3 px-1 flex items-center justify-between gap-2 text-xs text-mineral-taupe">
                  <span class="truncate">Brilho sutil &amp; elegância</span>
                  <span class="shrink-0">Curadoria</span>
                </div>
              </a>

              <a
                [href]="instagramProfileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="feed-stagger-item group border border-travertine bg-soft-linen p-3 rounded-2xl flex flex-col justify-between min-w-0 opacity-0 gpu-animated"
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
                <div class="pt-3 px-1 flex items-center justify-between gap-2 text-xs text-mineral-taupe">
                  <span class="truncate">Delicadeza em cada detalhe</span>
                  <span class="shrink-0">Acervo</span>
                </div>
              </a>
            </div>

            <div class="feed-stagger-item border border-travertine bg-soft-linen rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 min-w-0 opacity-0 gpu-animated">
              <div class="min-w-0">
                <p class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.12] pb-1">
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
                class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-celadon-slate shrink-0 gpu-animated"
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
        </div>
      </div>
    </section>
  `
})
export class InstagramEditorialFeedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('feedSection') feedSection!: ElementRef<HTMLElement>;
  @ViewChild('feedHeader') feedHeader!: ElementRef<HTMLElement>;
  @ViewChild('feedArchCard') feedArchCard!: ElementRef<HTMLElement>;
  @ViewChild('feedRightColumn') feedRightColumn!: ElementRef<HTMLElement>;

  readonly instagramProfileUrl = 'https://www.instagram.com/gotasdeouro.bonsucesso/';
  readonly instagramReelUrl = 'https://www.instagram.com/p/DeSDjxkhj4a/';
  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';

  private mm: gsap.MatchMedia | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      const sectionEl = this.feedSection?.nativeElement;
      const headerEl = this.feedHeader?.nativeElement;
      const archCard = this.feedArchCard?.nativeElement;
      const rightCol = this.feedRightColumn?.nativeElement;

      if (!sectionEl || !headerEl || !archCard || !rightCol) return;

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

        gsap.fromTo(
          archCard,
          {
            scale: 0.88,
            y: 50,
            opacity: 0,
            clipPath: 'inset(10% 8% 0% 8% round 999px 999px 16px 16px)',
            force3D: true
          },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 16px 16px)',
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: archCard,
              start: 'top 88%',
              end: 'top 35%',
              scrub: 0.6
            }
          }
        );

        const staggerItems = rightCol.querySelectorAll<HTMLElement>('.feed-stagger-item');
        gsap.fromTo(
          staggerItems,
          { y: 45, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: rightCol,
              start: 'top 85%',
              end: 'top 40%',
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

        gsap.fromTo(
          archCard,
          {
            scale: 0.94,
            y: 30,
            opacity: 0,
            clipPath: 'inset(6% 4% 0% 4% round 999px 999px 16px 16px)',
            force3D: true
          },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 16px 16px)',
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: archCard,
              start: 'top 92%',
              end: 'top 45%',
              scrub: 0.5
            }
          }
        );

        const staggerItems = rightCol.querySelectorAll<HTMLElement>('.feed-stagger-item');
        gsap.fromTo(
          staggerItems,
          { y: 25, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: rightCol,
              start: 'top 92%',
              end: 'top 55%',
              scrub: 0.5
            }
          }
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.mm?.revert();
      this.mm = null;
    });
  }
}
