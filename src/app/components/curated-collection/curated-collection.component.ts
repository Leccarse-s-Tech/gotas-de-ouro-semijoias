import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface EditorialPiece {
  id: string;
  alt: string;
  image: string;
  archTop: boolean;
  columnIndex: number;
}

@Component({
  selector: 'app-curated-collection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <section id="colecoes" #collectionSection class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-8 xl:px-12 bg-vanilla-bone border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div #collectionHeader class="max-w-[680px] mb-10 sm:mb-16 opacity-0 gpu-animated">
          <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3">
            Acervo Autoral
          </p>
          <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-onyx-graphite">
            Fotos sob <span class="italic font-light leading-[1.1] pb-1 inline-block">luz e superfície.</span>
          </h2>
          <p class="mt-4 text-sm sm:text-base text-mineral-taupe leading-relaxed max-w-[58ch]">
            Nosso acervo é apresentado como uma galeria viva. Sem carrinhos automatizados: cada peça é apresentada individualmente por nossa equipe via WhatsApp.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-16 w-full">
          <article
            *ngFor="let piece of pieces()"
            [attr.data-column]="piece.columnIndex"
            [attr.data-arch]="piece.archTop"
            class="collection-item w-full max-w-full min-w-0 overflow-hidden relative opacity-0 gpu-animated"
          >
            <div
              class="collection-card-shell w-full max-w-full min-w-0 border border-travertine bg-soft-linen p-2.5 sm:p-3.5 hover:border-celadon-slate overflow-hidden gpu-animated"
              [ngClass]="piece.archTop ? 'rounded-t-[999px] rounded-b-2xl' : 'rounded-2xl'"
            >
              <div
                class="w-full max-w-full overflow-hidden relative aspect-[4/5] bg-travertine/30"
                [ngClass]="piece.archTop ? 'rounded-t-[999px] rounded-b-xl' : 'rounded-xl'"
              >
                <img
                  [src]="piece.image"
                  [alt]="piece.alt"
                  class="collection-photo w-full h-full object-cover gpu-animated"
                  loading="eager"
                  decoding="async"
                />

                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-graphite/60 via-transparent to-transparent"></div>

                <div class="absolute inset-x-0 bottom-4 sm:bottom-6 flex items-end justify-center pointer-events-none">
                  <a
                    [href]="whatsappUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pointer-events-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4 py-2.5 max-w-[calc(100%-2rem)] rounded-full bg-onyx-graphite text-vanilla-bone border border-travertine/30 font-medium tracking-[0.02em] hover:bg-celadon-slate overflow-hidden"
                  >
                    <span class="truncate">Consultar disponibilidade no WhatsApp</span>
                    <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
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
  @ViewChild('collectionHeader') collectionHeader!: ElementRef<HTMLElement>;

  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  private readonly ngZone = inject(NgZone);
  private mm: gsap.MatchMedia | null = null;

  readonly pieces = signal<EditorialPiece[]>([
    {
      id: 'peca-01',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 01',
      image: 'assets/editorial/joia-1-editorial.webp',
      archTop: true,
      columnIndex: 0
    },
    {
      id: 'peca-02',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 02',
      image: 'assets/editorial/joia-2-editorial.webp',
      archTop: false,
      columnIndex: 1
    },
    {
      id: 'peca-03',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 03',
      image: 'assets/editorial/joia-3-editorial.webp',
      archTop: false,
      columnIndex: 0
    },
    {
      id: 'peca-04',
      alt: 'Semijoia selecionada Gotas de Ouro - Fotografia Editorial 04',
      image: 'assets/editorial/joia-4-editorial.webp',
      archTop: true,
      columnIndex: 1
    }
  ]);

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      const rootEl = this.collectionSection?.nativeElement;
      const headerEl = this.collectionHeader?.nativeElement;
      if (!rootEl || !headerEl) return;

      this.mm = gsap.matchMedia();

      this.mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          headerEl,
          { y: 40, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 0.5
            }
          }
        );

        const items = gsap.utils.toArray<HTMLElement>('.collection-item', rootEl);
        items.forEach((item) => {
          const isArch = item.getAttribute('data-arch') === 'true';
          const isRightCol = item.getAttribute('data-column') === '1';
          const shell = item.querySelector<HTMLElement>('.collection-card-shell');
          const photo = item.querySelector<HTMLElement>('.collection-photo');

          const startY = isRightCol ? 110 : 75;
          gsap.fromTo(
            item,
            { y: startY, opacity: 0, scale: 0.92, force3D: true },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                end: 'top 30%',
                scrub: 0.6
              }
            }
          );

          if (isArch && shell) {
            gsap.fromTo(
              shell,
              {
                clipPath: 'inset(15% 8% 0% 8% round 999px 999px 16px 16px)',
                force3D: true
              },
              {
                clipPath: 'inset(0% 0% 0% 0% round 999px 999px 16px 16px)',
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: item,
                  start: 'top 88%',
                  end: 'top 32%',
                  scrub: 0.6
                }
              }
            );
          }

          if (photo) {
            gsap.fromTo(
              photo,
              { scale: 1.15, yPercent: -7, force3D: true },
              {
                scale: 1.15,
                yPercent: 7,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5
                }
              }
            );
          }
        });
      });

      this.mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          headerEl,
          { y: 25, opacity: 0, force3D: true },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 0.5
            }
          }
        );

        const items = gsap.utils.toArray<HTMLElement>('.collection-item', rootEl);
        items.forEach((item) => {
          const isArch = item.getAttribute('data-arch') === 'true';
          const shell = item.querySelector<HTMLElement>('.collection-card-shell');
          const photo = item.querySelector<HTMLElement>('.collection-photo');

          gsap.fromTo(
            item,
            { y: 40, opacity: 0, scale: 0.96, force3D: true },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: {
                trigger: item,
                start: 'top 94%',
                end: 'top 45%',
                scrub: 0.5
              }
            }
          );

          if (isArch && shell) {
            gsap.fromTo(
              shell,
              {
                clipPath: 'inset(8% 4% 0% 4% round 999px 999px 16px 16px)',
                force3D: true
              },
              {
                clipPath: 'inset(0% 0% 0% 0% round 999px 999px 16px 16px)',
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: item,
                  start: 'top 92%',
                  end: 'top 45%',
                  scrub: 0.5
                }
              }
            );
          }

          if (photo) {
            gsap.fromTo(
              photo,
              { scale: 1.15, yPercent: -5, force3D: true },
              {
                scale: 1.15,
                yPercent: 5,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5
                }
              }
            );
          }
        });
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
