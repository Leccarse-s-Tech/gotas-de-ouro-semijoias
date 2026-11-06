import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

@Component({
  selector: 'app-manifesto-tactile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="manifesto" class="relative w-full max-w-full overflow-hidden py-16 md:py-28 px-4 sm:px-6 lg:px-12 bg-soft-linen border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div class="lg:col-span-6 min-w-0">
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-3 sm:mb-4">
              Essência &amp; Curadoria
            </p>
            <h2 class="font-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-onyx-graphite max-w-[18ch]">
              O luxo silencioso de uma escolha <span class="italic font-light leading-[1.1] pb-1 inline-block">feita com tempo.</span>
            </h2>
          </div>

          <div class="lg:col-span-6 flex flex-col justify-between gap-5 sm:gap-6 lg:pt-4 min-w-0">
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

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 pt-10 border-t border-travertine">
          <div class="flex flex-col gap-2 min-w-0">
            <span class="text-[11px] uppercase tracking-[0.22em] text-celadon-slate">01</span>
            <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
              Acabamento Primoroso
            </h3>
            <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
              Semijoias selecionadas com banho de alta qualidade, excelente durabilidade e acabamento delicado.
            </p>
          </div>

          <div class="flex flex-col gap-2 lg:border-l lg:border-travertine lg:pl-8 min-w-0">
            <span class="text-[11px] uppercase tracking-[0.22em] text-celadon-slate">02</span>
            <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
              Olhar Consultivo
            </h3>
            <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
              Atendimento humano por especialistas que auxiliam na escolha para você ou para presentear.
            </p>
          </div>

          <div class="flex flex-col gap-2 lg:border-l lg:border-travertine lg:pl-8 min-w-0">
            <span class="text-[11px] uppercase tracking-[0.22em] text-celadon-slate">03</span>
            <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
              Alcance Nacional
            </h3>
            <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
              Envio rastreado e cuidadoso para todas as regiões do território brasileiro.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ManifestoTactileComponent {
  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
}
