import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import reviewsData from '../../../assets/data/reviews.json';

export interface VerifiedReview {
  id: number;
  author: string;
  badge: string;
  rating: number;
  relativeTime: string;
  text: string;
}

@Component({
  selector: 'app-social-proof-carousel',
  standalone: true,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="avaliacoes" class="relative py-24 sm:py-36 bg-vanilla-bone border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-25 mix-blend-multiply"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 mb-14 sm:mb-20">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 elastic-scroll-target">
          <div>
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-soft-linen border border-travertine mb-6">
              <div class="flex items-center gap-1 text-onyx-graphite">
                <svg *ngFor="let s of [1,2,3,4,5]" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-onyx-graphite">
                {{ rating() }} ({{ totalReviews() }} avaliações verificadas no Google)
              </span>
            </div>

            <h2 class="font-editorial text-4xl sm:text-5xl lg:text-[56px] leading-[1.06] tracking-tight text-onyx-graphite max-w-[18ch]">
              A confiança de quem veste <span class="italic font-light leading-[1.1] pb-1 inline-block">nossa curadoria.</span>
            </h2>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              [href]="mapsUrl()"
              target="_blank"
              rel="noopener noreferrer"
              appMagneticSpring
              [magneticStrength]="0.22"
              class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-onyx-graphite bg-soft-linen text-onyx-graphite text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-onyx-graphite hover:text-vanilla-bone transition-colors duration-300"
            >
              <span class="magnetic-inner inline-flex items-center gap-2 whitespace-nowrap">
                <span>Conferir todas as avaliações verificadas no Google</span>
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div class="relative z-10 flex flex-col gap-6">
        <div class="overflow-hidden w-full">
          <div class="animate-marquee-left gap-6 px-3">
            <article
              *ngFor="let rev of topRowReviews()"
              class="w-[340px] sm:w-[400px] shrink-0 rounded-2xl bg-vanilla-bone border border-travertine p-6 flex flex-col justify-between gap-5 shadow-[0_8px_28px_rgba(30,30,28,0.03)]"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <div class="flex items-center gap-1 text-onyx-graphite">
                    <svg *ngFor="let s of [1,2,3,4,5]" class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-[11px] text-mineral-taupe">{{ rev.relativeTime }}</span>
                </div>

                <p class="text-sm text-onyx-graphite leading-relaxed line-clamp-3">
                  “{{ rev.text }}”
                </p>
              </div>

              <div class="pt-3 border-t border-travertine/70 flex items-center justify-between gap-2">
                <div>
                  <p class="text-xs font-semibold text-onyx-graphite">{{ rev.author }}</p>
                  <p class="text-[11px] text-mineral-taupe">{{ rev.badge }}</p>
                </div>
                <span class="text-[10px] uppercase tracking-[0.14em] text-celadon-slate">Verificada</span>
              </div>
            </article>
          </div>
        </div>

        <div class="overflow-hidden w-full">
          <div class="animate-marquee-right gap-6 px-3">
            <article
              *ngFor="let rev of bottomRowReviews()"
              class="w-[340px] sm:w-[400px] shrink-0 rounded-2xl bg-vanilla-bone border border-travertine p-6 flex flex-col justify-between gap-5 shadow-[0_8px_28px_rgba(30,30,28,0.03)]"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <div class="flex items-center gap-1 text-onyx-graphite">
                    <svg *ngFor="let s of [1,2,3,4,5]" class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-[11px] text-mineral-taupe">{{ rev.relativeTime }}</span>
                </div>

                <p class="text-sm text-onyx-graphite leading-relaxed line-clamp-3">
                  “{{ rev.text }}”
                </p>
              </div>

              <div class="pt-3 border-t border-travertine/70 flex items-center justify-between gap-2">
                <div>
                  <p class="text-xs font-semibold text-onyx-graphite">{{ rev.author }}</p>
                  <p class="text-[11px] text-mineral-taupe">{{ rev.badge }}</p>
                </div>
                <span class="text-[10px] uppercase tracking-[0.14em] text-celadon-slate">Verificada</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `
})
export class SocialProofCarouselComponent {
  readonly rating = signal<number>(reviewsData.rating || 4.9);
  readonly totalReviews = signal<number>(reviewsData.totalReviews || 199);
  readonly mapsUrl = signal<string>(
    reviewsData.mapsUrl || 'https://www.google.com/maps/place//data=!4m2!3m1!19sChIJz6XpMoOJzpQRwt6tTNCvKrE'
  );

  private readonly allReviews: VerifiedReview[] = (reviewsData.reviews || []) as VerifiedReview[];

  readonly topRowReviews = signal<VerifiedReview[]>([
    ...this.allReviews.slice(0, 12),
    ...this.allReviews.slice(0, 12)
  ]);

  readonly bottomRowReviews = signal<VerifiedReview[]>([
    ...this.allReviews.slice(12, 24),
    ...this.allReviews.slice(12, 24)
  ]);
}
