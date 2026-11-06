import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    <div class="noise-gpu-layer fixed inset-0 z-50" aria-hidden="true"></div>

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
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly scrollPhysics = inject(ScrollPhysicsService);

  ngAfterViewInit(): void {
    this.scrollPhysics.init();
  }

  ngOnDestroy(): void {
    this.scrollPhysics.destroy();
  }
}
