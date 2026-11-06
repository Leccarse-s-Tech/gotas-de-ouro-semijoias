import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

gsap.registerPlugin(ScrollTrigger);

export interface EditorialPiece {
  id: string;
  title: string;
  subtitle: string;
  materialNote: string;
  description: string;
  image: string;
  layoutClass: string;
  aspectClass: string;
  archTop: boolean;
}

@Component({
  selector: 'app-curated-collection',
  standalone: true,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="colecoes" #collectionSection class="relative py-24 sm:py-36 bg-vanilla-bone border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-25 mix-blend-multiply"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div class="max-w-[680px] mb-16 sm:mb-24 elastic-scroll-target">
          <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3">
            Curadoria Editorial
          </p>
          <h2 class="font-editorial text-4xl sm:text-5xl lg:text-[58px] leading-[1.06] tracking-tight text-onyx-graphite">
            Quatro estudos sobre <span class="italic font-light leading-[1.1] pb-1 inline-block">luz e superfície.</span>
          </h2>
          <p class="mt-4 text-sm sm:text-base text-mineral-taupe leading-relaxed max-w-[58ch]">
            Nosso acervo é apresentado como uma galeria viva. Sem carrinhos automatizados: cada peça é detalhada individualmente por nossa equipe via WhatsApp.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <article
            *ngFor="let piece of pieces(); let i = index"
            [ngClass]="piece.layoutClass"
            class="collection-item group relative elastic-scroll-target"
            (mouseenter)="setActivePiece(piece.id)"
            (mouseleave)="setActivePiece(null)"
          >
            <div
              appMagneticSpring
              [magneticStrength]="0.08"
              class="relative border border-travertine bg-soft-linen p-3 sm:p-4 transition-colors duration-500 group-hover:border-celadon-slate"
              [ngClass]="piece.archTop ? 'arch-mask-frame' : 'rounded-2xl'"
            >
              <div
                class="relative overflow-hidden bg-travertine/30"
                [ngClass]="[piece.aspectClass, piece.archTop ? 'rounded-t-[999px]' : 'rounded-xl']"
              >
                <img
                  [src]="piece.image"
                  [alt]="piece.title"
                  class="w-full h-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
                  loading="lazy"
                />

                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/65 via-onyx-graphite/10 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 flex items-end justify-between translate-y-0 sm:translate-y-4 opacity-100 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-500 ease-spring">
                  <a
                    [href]="whatsappUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full inline-flex items-center justify-between gap-3 px-5 py-3.5 rounded-full bg-onyx-graphite/95 backdrop-blur-md text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-celadon-slate transition-colors"
                  >
                    <span class="whitespace-nowrap">Consultar disponibilidade no WhatsApp</span>
                    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </a>
                </div>
              </div>

              <div class="pt-5 pb-2 px-2">
                <div class="flex items-center justify-between gap-2 text-xs text-mineral-taupe mb-1.5">
                  <span>{{ piece.subtitle }}</span>
                  <span class="text-celadon-slate">{{ piece.materialNote }}</span>
                </div>

                <h3 class="font-editorial text-2xl sm:text-3xl text-onyx-graphite leading-[1.12]">
                  {{ piece.title }}
                </h3>

                <p class="mt-2 text-xs sm:text-sm text-mineral-taupe leading-relaxed">
                  {{ piece.description }}
                </p>

                <div class="mt-4 pt-3 border-t border-travertine/70 flex items-center justify-between">
                  <a
                    [href]="whatsappUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-xs font-medium text-onyx-graphite hover:text-celadon-slate transition-colors"
                  >
                    <span>Consultar disponibilidade no WhatsApp</span>
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
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
  readonly activePieceId = signal<string | null>(null);
  private readonly ngZone = inject(NgZone);
  private ctx: gsap.Context | null = null;

  readonly pieces = signal<EditorialPiece[]>([
    {
      id: 'solaris-madreperola',
      title: 'Conjunto Solaris Madrepérola',
      subtitle: 'Coleção Travertino & Luz',
      materialNote: 'Banho Dourado & Madrepérola',
      description: 'Colar e brincos redondos de moldura plena com pedra facetada furta-cor que reflete nuances suaves conforme o movimento.',
      image: 'assets/editorial/joia-1-editorial.jpg',
      layoutClass: 'md:col-span-7',
      aspectClass: 'aspect-[4/5]',
      archTop: true
    },
    {
      id: 'trilogia-moissanite',
      title: 'Colar Trilogia Moissanite',
      subtitle: 'Coleção Prisma Mineral',
      materialNote: 'Banho Ródio & Moissanite',
      description: 'Corrente prateada delicada protagonizada por três pedras Moissanite de lapidação brilhante e gota com dispersão óptica cristalina.',
      image: 'assets/editorial/joia-2-editorial.jpg',
      layoutClass: 'md:col-span-5 md:mt-24',
      aspectClass: 'aspect-[4/5]',
      archTop: false
    },
    {
      id: 'escultura-organica',
      title: 'Conjunto Forma Orgânica',
      subtitle: 'Coleção Galeria Escultural',
      materialNote: 'Contorno Dourado & Pedra Mate',
      description: 'Geometria fluida de inspiração modernista emoldurando pedra branca acetinada em colar e par de brincos.',
      image: 'assets/editorial/joia-3-editorial.jpg',
      layoutClass: 'md:col-span-5',
      aspectClass: 'aspect-[4/5]',
      archTop: false
    },
    {
      id: 'flora-acetinada',
      title: 'Conjunto Flora Escovada',
      subtitle: 'Coleção Trama Botânica',
      materialNote: 'Textura Acetinada & Ponto de Luz',
      description: 'Pétalas trabalhadas em metal dourado escovado com ponto de luz central lapidado, unindo relevo tátil e delicadeza atemporal.',
      image: 'assets/editorial/joia-4-editorial.jpg',
      layoutClass: 'md:col-span-7 md:mt-16',
      aspectClass: 'aspect-[4/5]',
      archTop: true
    }
  ]);

  setActivePiece(id: string | null): void {
    this.activePieceId.set(id);
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>('.collection-item');
        items.forEach((item, idx) => {
          gsap.fromTo(
            item,
            { y: 60, opacity: 0.85 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'elastic.out(1, 0.6)',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                end: 'top 35%',
                scrub: 1 + (idx % 2) * 0.3
              }
            }
          );
        });
      }, this.collectionSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
