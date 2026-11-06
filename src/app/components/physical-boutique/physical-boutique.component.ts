import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import reviewsData from '../../../assets/data/reviews.json';

@Component({
  selector: 'app-physical-boutique',
  standalone: true,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="boutique" class="relative py-24 sm:py-36 bg-soft-linen border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-20 mix-blend-multiply"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div class="lg:col-span-5 elastic-scroll-target">
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3">
              Nossa Boutique Física &amp; Envio Nacional
            </p>

            <h2 class="font-editorial text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-onyx-graphite">
              Presença física sólida, <span class="italic font-light leading-[1.1] pb-1 inline-block">alcance em todo o Brasil.</span>
            </h2>

            <p class="mt-5 text-sm sm:text-base text-mineral-taupe leading-relaxed">
              Além de despachar diariamente para todas as capitais e interior do Brasil através do nosso atendimento digital personalizado, a Gotas de Ouro mantém sua boutique física na Grande São Paulo como ponto de encontro, curadoria presencial e lastro de confiança.
            </p>

            <div class="mt-8 space-y-5 pt-6 border-t border-travertine">
              <div class="flex items-start gap-3.5">
                <svg class="w-5 h-5 text-celadon-slate shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-5.686-7-11a7 7 0 1 1 14 0c0 5.314-7 11-7 11Z" />
                  <circle cx="12" cy="10" r="2.5" stroke-width="1.6" />
                </svg>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-onyx-graphite">Endereço da Boutique</p>
                  <p class="text-sm text-mineral-taupe mt-1 leading-relaxed">{{ address() }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <svg class="w-5 h-5 text-celadon-slate shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
                </svg>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-onyx-graphite">Horários de Atendimento Presencial</p>
                  <p *ngFor="let line of openingHours()" class="text-sm text-mineral-taupe mt-1">
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-9 flex flex-wrap items-center gap-3">
              <a
                [href]="mapsUrl()"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.24"
                class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs sm:text-[13px] font-medium tracking-[0.03em] hover:bg-celadon-slate transition-colors duration-300"
              >
                <span class="magnetic-inner inline-flex items-center gap-2 whitespace-nowrap">
                  <span>Traçar rota no Google Maps</span>
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
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
                class="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-travertine bg-vanilla-bone text-onyx-graphite text-xs sm:text-[13px] font-medium hover:border-celadon-slate transition-colors duration-300"
              >
                <span class="magnetic-inner whitespace-nowrap">Atendimento Exclusivo</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
            <div class="sm:col-span-7 border border-travertine bg-vanilla-bone p-3 rounded-2xl">
              <div class="overflow-hidden rounded-xl">
                <img
                  src="assets/editorial/fachada-editorial-1.jpg"
                  alt="Boutique fisica Gotas de Ouro Semijoias"
                  class="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-spring hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div class="pt-3 px-2 flex items-center justify-between text-xs text-mineral-taupe">
                <span>Arquitetura &amp; Vitrine Física</span>
                <span>São Paulo / Guarulhos</span>
              </div>
            </div>

            <div class="sm:col-span-5 arch-mask-frame border border-travertine bg-vanilla-bone p-3">
              <div class="overflow-hidden rounded-t-[999px]">
                <img
                  src="assets/editorial/fachada-editorial-2.jpg"
                  alt="Entrada da boutique fisica Gotas de Ouro"
                  class="w-full aspect-[3/4] object-cover transition-transform duration-700 ease-spring hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div class="pt-3 px-2 flex items-center justify-between text-xs text-mineral-taupe">
                <span>Curadoria Presencial</span>
                <span>Loja 14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PhysicalBoutiqueComponent {
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
}
