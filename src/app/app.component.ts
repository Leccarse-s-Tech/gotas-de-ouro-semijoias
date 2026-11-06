import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { CuratedCollectionComponent } from './components/curated-collection/curated-collection.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroEditorialComponent } from './components/hero-editorial/hero-editorial.component';
import { InstagramEditorialFeedComponent } from './components/instagram-editorial-feed/instagram-editorial-feed.component';
import { ManifestoTactileComponent } from './components/manifesto-tactile/manifesto-tactile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PhysicalBoutiqueComponent } from './components/physical-boutique/physical-boutique.component';
import { SocialProofCarouselComponent } from './components/social-proof-carousel/social-proof-carousel.component';
import { VideoScrubShowcaseComponent } from './components/video-scrub-showcase/video-scrub-showcase.component';
import { ScrollPhysicsService } from './services/scroll-physics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroEditorialComponent,
    ManifestoTactileComponent,
    CuratedCollectionComponent,
    VideoScrubShowcaseComponent,
    SocialProofCarouselComponent,
    PhysicalBoutiqueComponent,
    InstagramEditorialFeedComponent,
    FooterComponent
  ],
  template: `
    <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      <svg class="w-full h-full opacity-[0.038]">
        <filter id="editorial-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#editorial-film-grain)" />
      </svg>
    </div>

    <app-navbar></app-navbar>

    <main class="relative z-10">
      <app-hero-editorial></app-hero-editorial>
      <app-manifesto-tactile></app-manifesto-tactile>
      <app-curated-collection></app-curated-collection>
      <app-video-scrub-showcase></app-video-scrub-showcase>
      <app-social-proof-carousel></app-social-proof-carousel>
      <app-physical-boutique></app-physical-boutique>
      <app-instagram-editorial-feed></app-instagram-editorial-feed>
    </main>

    <app-footer></app-footer>
  `
})
export class AppComponent implements AfterViewInit {
  private readonly scrollPhysics = inject(ScrollPhysicsService);

  ngAfterViewInit(): void {
    this.scrollPhysics.init();
  }
}
