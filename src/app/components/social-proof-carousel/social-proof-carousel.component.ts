import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import reviewsData from '../../../assets/data/reviews.json';

export interface VerifiedReview {
  author: string;
  stars: number;
  text: string;
}

@Component({
  selector: 'app-social-proof-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="avaliacoes" class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-6 lg:px-12 bg-vanilla-bone border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-linen opacity-[0.12]"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div class="min-w-0">
            <div class="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-soft-linen border border-travertine mb-5 max-w-full">
              <div class="flex items-center gap-0.5 text-onyx-graphite shrink-0">
                <svg *ngFor="let s of [1,2,3,4,5]" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-onyx-graphite truncate">
                {{ rating() }} ({{ totalReviews() }} avaliações no Google)
              </span>
            </div>

            <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-onyx-graphite max-w-[18ch]">
              A confiança de quem veste <span class="italic font-light leading-[1.1] pb-1 inline-block">nossa curadoria.</span>
            </h2>
          </div>

          <a
            [href]="mapsUrl()"
            target="_blank"
            rel="noopener noreferrer"
            appMagneticSpring
            [magneticStrength]="0.22"
            class="w-fit max-w-full inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-onyx-graphite bg-soft-linen text-onyx-graphite text-xs sm:text-[13px] font-medium tracking-[0.02em] hover:bg-onyx-graphite hover:text-vanilla-bone shrink-0 gpu-animated"
          >
            <span class="magnetic-inner inline-flex items-center gap-2 overflow-hidden">
              <span class="truncate">Conferir todas as avaliações no Google</span>
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </a>
        </div>

        <div class="relative z-10 overflow-hidden w-full">
          <div class="animate-marquee-left gap-4 sm:gap-6 py-1">
            <article
              *ngFor="let rev of marqueeReviews()"
              class="w-[280px] sm:w-[340px] md:w-[380px] shrink-0 rounded-2xl bg-soft-linen border border-[#D8D3C8] p-5 sm:p-6 flex flex-col justify-between gap-5"
            >
              <div class="flex flex-col gap-3.5">
                <div class="flex items-center gap-1 text-onyx-graphite" aria-label="5 estrelas">
                  <svg *ngFor="let s of [1,2,3,4,5]" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <p class="text-sm sm:text-[15px] text-onyx-graphite leading-relaxed">
                  “{{ rev.text }}”
                </p>
              </div>

              <div class="pt-3.5 border-t border-[#D8D3C8]/70">
                <p class="text-xs font-semibold text-onyx-graphite tracking-[0.02em] truncate">{{ rev.author }}</p>
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

  private readonly realReviews: VerifiedReview[] = (reviewsData.reviews || []) as VerifiedReview[];

  readonly marqueeReviews = signal<VerifiedReview[]>([
    ...this.realReviews,
    ...this.realReviews
  ]);
}
