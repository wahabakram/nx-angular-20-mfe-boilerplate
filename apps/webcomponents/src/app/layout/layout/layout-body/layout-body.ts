import { booleanAttribute, Component, ElementRef, inject, input, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/overlay';

@Component({
  selector: 'mfc-layout-body',
  exportAs: 'mfcLayoutBody',
  templateUrl: './layout-body.html',
  styleUrl: './layout-body.scss',
  hostDirectives: [
    CdkScrollable
  ],
  host: {
    'class': 'mfc-layout-body mfc-scroll-lg'
  }
})
export class LayoutBody implements OnInit {
  private _router = inject(Router);
  private _elementRef = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);

  autoscrollToTop = input(true, {
    transform: booleanAttribute
  });

  ngOnInit() {
    // Scroll a page to top if url changed
    this._router.events
      .pipe(
        filter(event=> event instanceof NavigationStart)
      )
      .subscribe(() => {
        if (!this.autoscrollToTop()) {
          return;
        }

        if (isPlatformServer(this._platformId)) {
          return;
        }

        this._elementRef.nativeElement.scrollTo({
          top: 0,
          left: 0
        });
      })
    ;
  }
}
