import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

export interface EditorialPiece {
  id: string;
  alt: string;
  image: string;
  layoutClass: string;
  aspectClass: string;
  archTop: boolean;
}

@Component({
  selector: 'app-curated-collection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="colecoes" #collectionSection class="relative py-24 sm:py-36 bg-vanilla-bone border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div class="max-w-[680px] mb-16 sm:mb-24">
          <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3">
            Acervo Autoral
          </p>
          <h2 class="font-editorial text-4xl sm:text-5xl lg:text-[58px] leading-[1.06] tracking-tight text-onyx-graphite">
            Quatro estudos sobre <span class="italic font-light leading-[1.1] pb-1 inline-block">luz e superfície.</span>
          </h2>
          <p class="mt-4 text-sm sm:text-base text-mineral-taupe leading-relaxed max-w-[58ch]">
            Nosso acervo é apresentado como uma galeria viva. Sem carrinhos automatizados: cada peça é apresentada individualmente por nossa equipe via WhatsApp.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <article
            *ngFor="let piece of pieces()"
            [ngClass]="piece.layoutClass"
            class="collection-item group relative"
          >
            <div
              appMagneticSpring
              [magneticStrength]="0.06"
              class="showcase-elastic-frame relative border border-[#D8D3C8] bg-soft-linen p-3 sm:p-4 hover:border-celadon-slate"
              [ngClass]="piece.archTop ? 'arch-mask-frame' : 'rounded-2xl'"
            >
              <div
                class="relative overflow-hidden bg-travertine/30"
                [ngClass]="[piece.aspectClass, piece.archTop ? 'rounded-t-[500px]' : 'rounded-xl']"
              >
                <img
                  [src]="piece.image"
                  [alt]="piece.alt"
                  class="collection-photo w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/55 via-transparent to-transparent"></div>

                <div class="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 flex items-end justify-start">
                  <a
                    [href]="whatsappUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3 px-5 py-3 rounded-full bg-onyx-graphite text-vanilla-bone border border-[#D8D3C8]/30 text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-celadon-slate"
                  >
                    <span class="whitespace-nowrap">Consultar disponibilidade no WhatsApp</span>
                    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `
})
export class CuratedCollectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('collectionSection') collectionSection!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;

  readonly pieces = signal<EditorialPiece[]>([
    {
      id: 'peca-01',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 01',
      image: 'assets/editorial/joia-1-editorial.jpg',
      layoutClass: 'md:col-span-7',
      aspectClass: 'aspect-[4/5]',
      archTop: true
    },
    {
      id: 'peca-02',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 02',
      image: 'assets/editorial/joia-2-editorial.jpg',
      layoutClass: 'md:col-span-5 md:mt-24',
      aspectClass: 'aspect-[4/5]',
      archTop: false
    },
    {
      id: 'peca-03',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 03',
      image: 'assets/editorial/joia-3-editorial.jpg',
      layoutClass: 'md:col-span-5',
      aspectClass: 'aspect-[4/5]',
      archTop: false
    },
    {
      id: 'peca-04',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 04',
      image: 'assets/editorial/joia-4-editorial.jpg',
      layoutClass: 'md:col-span-7 md:mt-16',
      aspectClass: 'aspect-[4/5]',
      archTop: true
    }
  ]);

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>('.collection-item');
        items.forEach((item, idx) => {
          const photo = item.querySelector<HTMLElement>('.collection-photo');
          if (photo) {
            gsap.fromTo(
              photo,
              { scale: 1.12, force3D: true },
              {
                scale: 1,
                force3D: true,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 92%',
                  end: 'bottom 20%',
                  scrub: 0.6 + (idx % 2) * 0.15,
                  onToggle: (self) => {
                    photo.style.willChange = self.isActive ? 'transform' : 'auto';
                  }
                }
              }
            );
          }
        });
      }, this.collectionSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.ctx?.revert();
    });
  }
}
