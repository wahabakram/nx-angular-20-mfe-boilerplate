import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PageLoadingBar } from '@ng-mf/components';
import {
  Analytics,
  Environment,
  InactivityTracker,
  Seo,
} from '@ng-mf/components';
import { SplashScreen } from '@ng-mf/components';
import { TextLogo } from '@ng-mf/components';

@Component({
  imports: [RouterOutlet, PageLoadingBar, SplashScreen, TextLogo],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private _analyticsService = inject(Analytics);
  private _inactivityTracker = inject(InactivityTracker);
  private _seoService = inject(Seo);
  private _envService = inject(Environment);
  private _router = inject(Router);

  constructor() {
    afterNextRender(() => {
      // Scroll a page to top if url changed
      this._router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo({
            top: 0,
            left: 0,
          });
        });

      this._analyticsService.trackPageViews();
      this._inactivityTracker.setupInactivityTimer().subscribe(() => {
        // console.log('Inactive mode has been activated!');
        // this._inactivityTracker.reset();
      });
    });
  }

  ngOnInit(): void {
    this._seoService.trackCanonicalChanges(
      this._envService.getValue('siteUrl')
    );
  }
}
