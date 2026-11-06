import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import { ScrollPhysicsService } from '../../services/scroll-physics.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <footer class="relative w-full max-w-full overflow-hidden bg-soft-linen border-t border-travertine">
      <div class="pointer-events-none absolute inset-0 texture-surface-travertine opacity-[0.12]"></div>

      <div class="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-4 sm:px-6 lg:px-12">
        <div class="min-w-0">
          <img
            src="assets/editorial/logo-gotas-de-ouro.svg"
            alt="Gotas de Ouro Semijoias"
            class="h-14 sm:h-16 w-auto object-contain -ml-2"
            loading="eager"
            decoding="async"
          />
          <p class="mt-4 text-sm text-mineral-taupe max-w-[36ch] leading-relaxed">
            Vitrine editorial de semijoias com acabamento primoroso, atendimento individualizado via WhatsApp e envio cuidadoso para todo o território nacional.
          </p>
        </div>

        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-onyx-graphite mb-4">Navegação</p>
          <ul class="space-y-2.5 text-sm text-mineral-taupe">
            <li>
              <a href="#manifesto" (click)="navigate($event, '#manifesto')" class="hover:text-onyx-graphite">
                Essência &amp; Curadoria
              </a>
            </li>
            <li>
              <a href="#colecoes" (click)="navigate($event, '#colecoes')" class="hover:text-onyx-graphite">
                Acervo Autoral
              </a>
            </li>
            <li>
              <a href="#atelier-filme" (click)="navigate($event, '#atelier-filme')" class="hover:text-onyx-graphite">
                Matéria &amp; Luz
              </a>
            </li>
            <li>
              <a href="#avaliacoes" (click)="navigate($event, '#avaliacoes')" class="hover:text-onyx-graphite">
                Avaliações no Google
              </a>
            </li>
            <li>
              <a href="#boutique" (click)="navigate($event, '#boutique')" class="hover:text-onyx-graphite">
                Nossa Boutique Física
              </a>
            </li>
          </ul>
        </div>

        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-onyx-graphite mb-4">Boutique &amp; Horários</p>
          <div class="space-y-2 text-sm text-mineral-taupe leading-relaxed">
            <p>R. Tamotsu Iwasse, 03 - Loja 14</p>
            <p>Guarulhos, São Paulo - SP</p>
            <p class="pt-1">Seg a Sáb: 10h00 às 21h00</p>
            <p>Domingos: 09h00 às 15h00</p>
          </div>
        </div>

        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-onyx-graphite mb-4">Canais Oficiais</p>
          <p class="text-sm text-mineral-taupe leading-relaxed mb-5">
            Atendimento digital personalizado com envio para todo o Brasil.
          </p>
          <div class="flex flex-wrap items-center gap-2.5">
            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              appMagneticSpring
              [magneticStrength]="0.22"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-onyx-graphite text-vanilla-bone text-xs font-medium tracking-[0.03em] hover:bg-celadon-slate gpu-animated"
            >
              <span class="magnetic-inner whitespace-nowrap">Atendimento Exclusivo</span>
            </a>

            <a
              [href]="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              appMagneticSpring
              [magneticStrength]="0.2"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-travertine bg-vanilla-bone text-onyx-graphite text-xs font-medium hover:border-celadon-slate gpu-animated"
            >
              <span class="magnetic-inner whitespace-nowrap">Instagram Oficial</span>
            </a>
          </div>
        </div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 border-t border-travertine flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-mineral-taupe pb-20 sm:pb-6">
        <p>Gotas de Ouro Semijoias. Todos os direitos reservados.</p>
        <p>Curadoria Autoral &amp; Envio Nacional para todo o Brasil.</p>
      </div>
    </footer>

    <a
      [href]="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      appMagneticSpring
      [magneticStrength]="0.32"
      aria-label="Atendimento Exclusivo via WhatsApp"
      class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-onyx-graphite text-vanilla-bone border border-[#D8D3C8] text-xs shadow-lg hover:bg-celadon-slate gpu-animated"
    >
      <span class="magnetic-inner inline-flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span class="font-medium tracking-[0.03em] whitespace-nowrap">Atendimento Exclusivo</span>
      </span>
    </a>
  `
})
export class FooterComponent {
  private readonly scrollService = inject(ScrollPhysicsService);
  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';
  readonly instagramUrl = 'https://www.instagram.com/gotasdeouro.bonsucesso/';

  navigate(event: Event, selector: string): void {
    event.preventDefault();
    this.scrollService.scrollToSection(selector);
  }
}
