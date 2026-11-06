import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-manifesto-tactile',
  standalone: true,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="manifesto" #manifestoSection class="relative py-24 sm:py-36 bg-soft-linen border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-20 mix-blend-multiply"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div class="lg:col-span-5 elastic-scroll-target">
            <h2 class="font-editorial text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-onyx-graphite">
              O luxo silencioso de uma escolha <span class="italic font-light leading-[1.1] pb-1 inline-block">feita com tempo.</span>
            </h2>

            <p class="mt-6 text-base text-mineral-taupe leading-relaxed max-w-[54ch]">
              Na Gotas de Ouro, acreditamos que uma joia não deve ser escolhida em uma prateleira digital impessoal. Cada criação do nosso acervo passa por uma rigorosa curadoria de banho nobre, cravação precisa e caimento orgânico sobre a pele.
            </p>

            <p class="mt-4 text-base text-mineral-taupe leading-relaxed max-w-[54ch]">
              Por meio da nossa consultoria individualizada no WhatsApp, apresentamos vídeos reais sob luz natural, orientamos combinações e despachamos seu pedido para qualquer estado do Brasil em embalagem de algodão prensado.
            </p>

            <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-travertine">
              <div>
                <p class="font-editorial italic text-2xl text-onyx-graphite leading-[1.1] pb-1">Acabamento Nobre</p>
                <p class="text-xs text-mineral-taupe mt-1 leading-relaxed">
                  Banho espesso de alta durabilidade, hipoalergênico e pedras de refração cristalina.
                </p>
              </div>
              <div>
                <p class="font-editorial italic text-2xl text-onyx-graphite leading-[1.1] pb-1">Olhar Consultivo</p>
                <p class="text-xs text-mineral-taupe mt-1 leading-relaxed">
                  Atendimento humano por especialistas que auxiliam na escolha para você ou para presentear.
                </p>
              </div>
              <div>
                <p class="font-editorial italic text-2xl text-onyx-graphite leading-[1.1] pb-1">Alcance Nacional</p>
                <p class="text-xs text-mineral-taupe mt-1 leading-relaxed">
                  Envio rastreado e cuidadoso para todas as regiões do território brasileiro.
                </p>
              </div>
            </div>

            <div class="mt-10">
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.25"
                class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-[13px] font-medium tracking-[0.04em] hover:bg-celadon-slate transition-colors duration-300"
              >
                <span class="magnetic-inner inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span>Atendimento Exclusivo</span>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div #cardPrimary class="sm:col-span-7 relative">
              <div class="arch-mask-frame border border-travertine bg-vanilla-bone p-3 pb-5">
                <div class="overflow-hidden rounded-t-[999px]">
                  <img
                    src="assets/editorial/brand-deboss-box.jpg"
                    alt="Embalagem Gotas de Ouro em papel algodao com relevo seco"
                    class="w-full aspect-[4/5] object-cover transition-transform duration-700 ease-spring hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div class="pt-4 px-2 flex items-center justify-between text-xs text-mineral-taupe">
                  <span>Papel Algodão Prensado</span>
                  <span>Relevo Seco Artesanal</span>
                </div>
              </div>
            </div>

            <div #cardSecondary class="sm:col-span-5 sm:mt-20 relative">
              <div class="border border-travertine bg-vanilla-bone p-3 pb-5 rounded-2xl">
                <div class="overflow-hidden rounded-xl">
                  <img
                    src="assets/editorial/brand-limestone-plaque.jpg"
                    alt="Assinatura Gotas de Ouro esculpida em pedra calcaria travertino"
                    class="w-full aspect-[4/5] object-cover transition-transform duration-700 ease-spring hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div class="pt-4 px-2 flex items-center justify-between text-xs text-mineral-taupe">
                  <span>Matéria Mineral</span>
                  <span>Identidade Atemporal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ManifestoTactileComponent implements AfterViewInit, OnDestroy {
  @ViewChild('manifestoSection') manifestoSection!: ElementRef<HTMLElement>;
  @ViewChild('cardPrimary') cardPrimary!: ElementRef<HTMLElement>;
  @ViewChild('cardSecondary') cardSecondary!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        gsap.fromTo(
          this.cardPrimary.nativeElement,
          { y: 45 },
          {
            y: -25,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: this.manifestoSection.nativeElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3
            }
          }
        );

        gsap.fromTo(
          this.cardSecondary.nativeElement,
          { y: 80 },
          {
            y: -45,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: this.manifestoSection.nativeElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.6
            }
          }
        );
      }, this.manifestoSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
