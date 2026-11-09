import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-manifesto-tactile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="manifesto" #manifestoSection class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-8 xl:px-12 bg-soft-linen border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

      <div class="relative z-10 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div #manifestoHeadingBlock class="lg:col-span-6 min-w-0 opacity-0 gpu-animated">
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3 sm:mb-4">
              Essência &amp; Curadoria
            </p>
            <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-onyx-graphite max-w-[18ch]">
              O luxo silencioso de uma escolha <span class="italic font-light leading-[1.1] pb-1 inline-block">feita com tempo.</span>
            </h2>
          </div>

          <div #manifestoTextBlock class="lg:col-span-6 flex flex-col justify-between gap-5 sm:gap-6 lg:pt-4 min-w-0 opacity-0 gpu-animated">
            <p class="text-sm sm:text-base lg:text-[17px] text-mineral-taupe leading-relaxed max-w-[58ch]">
              Na Gotas de Ouro, acreditamos que uma semijoia não deve ser escolhida em uma prateleira digital impessoal. Cada peça do nosso acervo passa por uma cuidadosa seleção que valoriza o brilho delicado, o caimento elegante e a harmonia em cada detalhe.
            </p>

            <p class="text-sm sm:text-base lg:text-[17px] text-mineral-taupe leading-relaxed max-w-[58ch]">
              Por meio do nosso atendimento individualizado no WhatsApp, apresentamos vídeos reais das peças em detalhes, auxiliamos nas combinações e preparamos o envio com todo o cuidado para qualquer estado do Brasil.
            </p>

            <div class="pt-1">
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.25"
                class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.04em] hover:bg-celadon-slate gpu-animated"
              >
                <span class="magnetic-inner inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span>Atendimento Exclusivo</span>
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-10 relative">
          <div #manifestoDividerLine class="absolute top-0 inset-x-0 h-[1px] bg-travertine origin-left gpu-animated"></div>

          <div #manifestoPillarsBlock class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <div class="manifesto-pillar-item flex flex-col gap-2 min-w-0 opacity-0 gpu-animated">
              <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
                Acabamento Primoroso
              </h3>
              <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
                Semijoias selecionadas com banho de alta qualidade, excelente durabilidade e acabamento delicado.
              </p>
            </div>

            <div class="manifesto-pillar-item flex flex-col gap-2 lg:border-l lg:border-travertine lg:pl-8 min-w-0 opacity-0 gpu-animated">
              <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
                Olhar Consultivo
              </h3>
              <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
                Atendimento humano por especialistas que auxiliam na escolha para você ou para presentear.
              </p>
            </div>

            <div class="manifesto-pillar-item flex flex-col gap-2 lg:border-l lg:border-travertine lg:pl-8 min-w-0 opacity-0 gpu-animated">
              <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
                Alcance Nacional
              </h3>
              <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
                Envio rastreado e cuidadoso para todas as regiões do território brasileiro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ManifestoTactileComponent implements AfterViewInit, OnDestroy {
  @ViewChild('manifestoSection') manifestoSection!: ElementRef<HTMLElement>;
  @ViewChild('manifestoHeadingBlock') manifestoHeadingBlock!: ElementRef<HTMLElement>;
  @ViewChild('manifestoTextBlock') manifestoTextBlock!: ElementRef<HTMLElement>;
  @ViewChild('manifestoDividerLine') manifestoDividerLine!: ElementRef<HTMLElement>;
  @ViewChild('manifestoPillarsBlock') manifestoPillarsBlock!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly ngZone = inject(NgZone);
  private mm: gsap.MatchMedia | null = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      const sectionEl = this.manifestoSection?.nativeElement;
      const headingEl = this.manifestoHeadingBlock?.nativeElement;
      const textEl = this.manifestoTextBlock?.nativeElement;
      const lineEl = this.manifestoDividerLine?.nativeElement;
      const pillarsEl = this.manifestoPillarsBlock?.nativeElement;

      if (!sectionEl || !headingEl || !textEl || !lineEl || !pillarsEl) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          [headingEl, textEl],
          { y: 50, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 0.5
            }
          }
        );

        gsap.fromTo(
          lineEl,
          { scaleX: 0, transformOrigin: 'left center', force3D: true },
          {
            scaleX: 1,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: pillarsEl,
              start: 'top 92%',
              end: 'top 60%',
              scrub: 0.5
            }
          }
        );

        const pillarItems = pillarsEl.querySelectorAll<HTMLElement>('.manifesto-pillar-item');
        gsap.fromTo(
          pillarItems,
          { y: 45, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: pillarsEl,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 0.5
            }
          }
        );
      });

      this.mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          [headingEl, textEl],
          { y: 25, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 0.5
            }
          }
        );

        gsap.fromTo(
          lineEl,
          { scaleX: 0, transformOrigin: 'left center', force3D: true },
          {
            scaleX: 1,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: pillarsEl,
              start: 'top 95%',
              end: 'top 70%',
              scrub: 0.5
            }
          }
        );

        const pillarItems = pillarsEl.querySelectorAll<HTMLElement>('.manifesto-pillar-item');
        gsap.fromTo(
          pillarItems,
          { y: 25, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: pillarsEl,
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
