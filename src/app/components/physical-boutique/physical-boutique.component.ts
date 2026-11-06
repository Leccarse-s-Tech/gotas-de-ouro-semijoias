import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import reviewsData from '../../../assets/data/reviews.json';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-physical-boutique',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="boutique" #boutiqueSection class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-6 lg:px-12 bg-soft-linen border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div #boutiqueTextBlock class="min-w-0 opacity-0 gpu-animated">
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3">
              Nossa Boutique Física &amp; Envio Nacional
            </p>

            <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-onyx-graphite">
              Presença física sólida, <span class="italic font-light leading-[1.1] pb-1 inline-block">alcance em todo o Brasil.</span>
            </h2>

            <p class="mt-4 sm:mt-5 text-sm sm:text-base text-mineral-taupe leading-relaxed">
              Além de enviar diariamente para todas as capitais e interior do Brasil através do nosso atendimento digital personalizado, a Gotas de Ouro mantém sua boutique física na Grande São Paulo como ponto de encontro, curadoria presencial e lastro de confiança.
            </p>

            <div class="mt-7 sm:mt-8 space-y-5 pt-6 border-t border-travertine">
              <div class="flex items-start gap-3.5">
                <svg class="w-5 h-5 text-celadon-slate shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-5.686-7-11a7 7 0 1 1 14 0c0 5.314-7 11-7 11Z" />
                  <circle cx="12" cy="10" r="2.5" stroke-width="1.6" />
                </svg>
                <div class="min-w-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-onyx-graphite">Endereço da Boutique</p>
                  <p class="text-sm text-mineral-taupe mt-1 leading-relaxed">{{ address() }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <svg class="w-5 h-5 text-celadon-slate shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
                </svg>
                <div class="min-w-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-onyx-graphite">Horários de Atendimento Presencial</p>
                  <p *ngFor="let line of openingHours()" class="text-sm text-mineral-taupe mt-1">
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                [href]="mapsUrl()"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.24"
                class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-celadon-slate gpu-animated"
              >
                <span class="magnetic-inner inline-flex items-center gap-2 whitespace-nowrap">
                  <span>Traçar rota no Google Maps</span>
                  <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </a>

              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.2"
                class="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-travertine bg-vanilla-bone text-onyx-graphite text-xs sm:text-[13px] font-medium hover:border-celadon-slate gpu-animated"
              >
                <span class="magnetic-inner whitespace-nowrap">Atendimento Exclusivo</span>
              </a>
            </div>
          </div>

          <div #boutiquePhotosWrapper class="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-end w-full min-w-0">
            <div class="boutique-photo-card sm:col-span-7 border border-[#D8D3C8] bg-vanilla-bone p-3 rounded-2xl min-w-0 opacity-0 gpu-animated">
              <div class="overflow-hidden rounded-xl">
                <img
                  src="assets/editorial/fachada-editorial-1.webp"
                  alt="Boutique fisica Gotas de Ouro Semijoias"
                  class="boutique-photo-img w-full aspect-[16/10] object-cover gpu-animated"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div class="pt-3 px-1 flex items-center justify-between gap-2 text-xs text-mineral-taupe">
                <span class="truncate">Arquitetura &amp; Vitrine Física</span>
                <span class="shrink-0">São Paulo / Guarulhos</span>
              </div>
            </div>

            <div class="boutique-photo-card sm:col-span-5 rounded-t-[999px] rounded-b-2xl overflow-hidden border border-[#D8D3C8] bg-vanilla-bone p-3 min-w-0 opacity-0 gpu-animated">
              <div class="overflow-hidden rounded-t-[999px] rounded-b-xl">
                <img
                  src="assets/editorial/fachada-editorial-2.webp"
                  alt="Entrada da boutique fisica Gotas de Ouro"
                  class="boutique-photo-img w-full aspect-[3/4] object-cover gpu-animated"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div class="pt-3 px-1 flex items-center justify-between gap-2 text-xs text-mineral-taupe">
                <span class="truncate">Curadoria Presencial</span>
                <span class="shrink-0">Loja 14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PhysicalBoutiqueComponent implements AfterViewInit, OnDestroy {
  @ViewChild('boutiqueSection') boutiqueSection!: ElementRef<HTMLElement>;
  @ViewChild('boutiqueTextBlock') boutiqueTextBlock!: ElementRef<HTMLElement>;
  @ViewChild('boutiquePhotosWrapper') boutiquePhotosWrapper!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  readonly mapsUrl = signal<string>(
    reviewsData.mapsUrl || 'https://www.google.com/maps/place//data=!4m2!3m1!19sChIJz6XpMoOJzpQRwt6tTNCvKrE'
  );
  readonly address = signal<string>(
    reviewsData.address || 'R. Tamotsu Iwasse, 03 - Loja 14 - Guarulhos, São Paulo - SP, 07176-000'
  );
  readonly openingHours = signal<string[]>(
    reviewsData.openingHours || [
      'Segunda a Sábado: 10h00 às 21h00',
      'Domingos: 09h00 às 15h00'
    ]
  );

  private mm: gsap.MatchMedia | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      const sectionEl = this.boutiqueSection?.nativeElement;
      const textEl = this.boutiqueTextBlock?.nativeElement;
      const photosWrapper = this.boutiquePhotosWrapper?.nativeElement;

      if (!sectionEl || !textEl || !photosWrapper) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          textEl,
          { y: 40, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.5
            }
          }
        );

        const cards = photosWrapper.querySelectorAll<HTMLElement>('.boutique-photo-card');
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.94, force3D: true },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: photosWrapper,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.5
            }
          }
        );

        const photos = photosWrapper.querySelectorAll<HTMLElement>('.boutique-photo-img');
        photos.forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.12, yPercent: -5, force3D: true },
            {
              scale: 1.12,
              yPercent: 5,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5
              }
            }
          );
        });
      });

      this.mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          textEl,
          { y: 25, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 90%',
              end: 'top 55%',
              scrub: 0.5
            }
          }
        );

        const cards = photosWrapper.querySelectorAll<HTMLElement>('.boutique-photo-card');
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0, scale: 0.96, force3D: true },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: photosWrapper,
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
