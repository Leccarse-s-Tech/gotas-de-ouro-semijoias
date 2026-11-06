import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MagneticSpringDirective } from '../../directives/magnetic-spring.directive';
import { ScrollPhysicsService } from '../../services/scroll-physics.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MagneticSpringDirective],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-40 w-full max-w-full border-b gpu-animated"
      [ngClass]="scrollService.isScrolled() ? 'bg-vanilla-bone border-travertine' : 'bg-vanilla-bone/95 border-travertine/60'"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-4">
        <a
          href="#topo"
          (click)="navigate($event, '#topo')"
          class="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0 min-w-0"
          aria-label="Gotas de Ouro Semijoias"
        >
          <img
            src="assets/editorial/logo-symbol.svg"
            alt="Simbolo Gotas de Ouro"
            loading="eager"
            decoding="async"
            class="w-6 h-5 sm:w-8 sm:h-6 object-contain shrink-0"
          />
          <div class="flex flex-col min-w-0">
            <span class="font-editorial italic text-lg sm:text-2xl leading-none tracking-tight text-onyx-graphite whitespace-nowrap">
              Gotas de Ouro
            </span>
            <span class="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-mineral-taupe mt-0.5 whitespace-nowrap">
              Semijoias
            </span>
          </div>
        </a>

        <nav class="hidden xl:flex items-center gap-8 text-[13px] font-medium text-onyx-graphite/85">
          <a
            href="#manifesto"
            (click)="navigate($event, '#manifesto')"
            class="hover:text-celadon-slate py-1 whitespace-nowrap"
          >
            Essência &amp; Curadoria
          </a>
          <a
            href="#colecoes"
            (click)="navigate($event, '#colecoes')"
            class="hover:text-celadon-slate py-1 whitespace-nowrap"
          >
            Acervo Autoral
          </a>
          <a
            href="#atelier-filme"
            (click)="navigate($event, '#atelier-filme')"
            class="hover:text-celadon-slate py-1 whitespace-nowrap"
          >
            Matéria &amp; Luz
          </a>
          <a
            href="#avaliacoes"
            (click)="navigate($event, '#avaliacoes')"
            class="hover:text-celadon-slate py-1 whitespace-nowrap"
          >
            Reconhecimento
          </a>
          <a
            href="#boutique"
            (click)="navigate($event, '#boutique')"
            class="hover:text-celadon-slate py-1 whitespace-nowrap"
          >
            Boutique Física
          </a>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <div class="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-linen border border-travertine text-[11px] tracking-[0.06em] text-celadon-slate whitespace-nowrap">
            <svg class="w-3.5 h-3.5 text-celadon-slate shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18Z" />
            </svg>
            <span>Envio para todo o Brasil</span>
          </div>

          <a
            [href]="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            appMagneticSpring
            [magneticStrength]="0.24"
            class="inline-flex items-center gap-1.5 sm:gap-2 text-xs xl:text-[13px] px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-full bg-onyx-graphite text-vanilla-bone font-medium tracking-[0.02em] hover:bg-celadon-slate shrink-0 gpu-animated"
          >
            <span class="magnetic-inner inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <span>Atendimento Exclusivo</span>
              <svg class="hidden sm:inline w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </a>

          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="xl:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-travertine bg-soft-linen text-onyx-graphite shrink-0"
            aria-label="Abrir menu de navegacao"
          >
            <svg *ngIf="!mobileMenuOpen()" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
            </svg>
            <svg *ngIf="mobileMenuOpen()" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div
        *ngIf="mobileMenuOpen()"
        class="xl:hidden border-t border-travertine bg-vanilla-bone px-4 sm:px-6 py-6"
      >
        <div class="max-w-7xl mx-auto flex flex-col gap-4">
          <div class="md:hidden inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-soft-linen border border-travertine text-[11px] tracking-[0.06em] text-celadon-slate">
            <span>Envio para todo o Brasil</span>
          </div>
          <a href="#manifesto" (click)="navigate($event, '#manifesto')" class="text-lg font-editorial italic text-onyx-graphite py-1.5 border-b border-travertine/60">
            Essência &amp; Curadoria
          </a>
          <a href="#colecoes" (click)="navigate($event, '#colecoes')" class="text-lg font-editorial italic text-onyx-graphite py-1.5 border-b border-travertine/60">
            Acervo Autoral
          </a>
          <a href="#atelier-filme" (click)="navigate($event, '#atelier-filme')" class="text-lg font-editorial italic text-onyx-graphite py-1.5 border-b border-travertine/60">
            Matéria &amp; Luz
          </a>
          <a href="#avaliacoes" (click)="navigate($event, '#avaliacoes')" class="text-lg font-editorial italic text-onyx-graphite py-1.5 border-b border-travertine/60">
            Reconhecimento
          </a>
          <a href="#boutique" (click)="navigate($event, '#boutique')" class="text-lg font-editorial italic text-onyx-graphite py-1.5">
            Boutique Física
          </a>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly scrollService = inject(ScrollPhysicsService);
  readonly mobileMenuOpen = signal<boolean>(false);
  readonly whatsappUrl = 'https://api.whatsapp.com/message/7HFJMJM3JWS6D1?autoload=1&app_absent=0&utm_source=ig';

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  navigate(event: Event, selector: string): void {
    event.preventDefault();
    this.mobileMenuOpen.set(false);
    this.scrollService.scrollToSection(selector);
  }
}
