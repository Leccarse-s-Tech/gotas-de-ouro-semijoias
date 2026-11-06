import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';

@Component({
  selector: 'app-manifesto-tactile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <section id="manifesto" class="relative py-28 sm:py-40 bg-soft-linen border-t border-travertine overflow-hidden">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div class="lg:col-span-6">
            <p class="text-[11px] uppercase tracking-[0.24em] text-mineral-taupe mb-4">
              Essência &amp; Curadoria
            </p>
            <h2 class="font-editorial text-4xl sm:text-5xl lg:text-[62px] leading-[1.06] tracking-tight text-onyx-graphite max-w-[16ch]">
              O luxo silencioso de uma escolha <span class="italic font-light leading-[1.1] pb-1 inline-block">feita com tempo.</span>
            </h2>
          </div>

          <div class="lg:col-span-6 flex flex-col justify-between gap-6 lg:pt-6">
            <p class="text-base sm:text-[17px] text-mineral-taupe leading-relaxed max-w-[58ch]">
              Na Gotas de Ouro, acreditamos que uma semijoia não deve ser escolhida em uma prateleira digital impessoal. Cada peça do nosso acervo passa por uma cuidadosa seleção que valoriza o brilho delicado, o caimento elegante e a harmonia em cada detalhe.
            </p>

            <p class="text-base sm:text-[17px] text-mineral-taupe leading-relaxed max-w-[58ch]">
              Por meio do nosso atendimento individualizado no WhatsApp, apresentamos vídeos reais das peças em detalhes, auxiliamos nas combinações e preparamos o envio com todo o cuidado para qualquer estado do Brasil.
            </p>

            <div class="pt-2">
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                appMagneticSpring
                [magneticStrength]="0.25"
                class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone text-[13px] font-medium tracking-[0.04em] hover:bg-celadon-slate"
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
        </div>

        <div class="mt-16 sm:mt-24 pt-12 border-t border-travertine grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          <div class="flex flex-col gap-2">
            <span class="text-[11px] uppercase tracking-[0.22em] text-celadon-slate">01</span>
            <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
              Acabamento Primoroso
            </h3>
            <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
              Semijoias selecionadas com banho de alta qualidade, excelente durabilidade e acabamento delicado.
            </p>
          </div>

          <div class="flex flex-col gap-2 md:border-l md:border-travertine md:pl-10">
            <span class="text-[11px] uppercase tracking-[0.22em] text-celadon-slate">02</span>
            <h3 class="font-editorial italic text-2xl sm:text-3xl text-onyx-graphite leading-[1.1] pb-1">
              Olhar Consultivo
            </h3>
            <p class="text-sm text-mineral-taupe leading-relaxed max-w-[42ch]">
              Atendimento humano por especialistas que auxiliam na escolha para você ou para presentear.
            </p>
          </div>

          <div class="flex flex-col gap-2 md:border-l md:border-travertine md:pl-10">
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
