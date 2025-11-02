import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  Renderer2
} from '@angular/core';
import { SplashScreenStore } from '../splash-screen.store';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'mfc-splash-screen',
  exportAs: 'mfcSplashScreen',
  imports: [],
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.scss',
  host: {
    'class': 'mfc-splash-screen',
  }
})
export class SplashScreen {
  private _store = inject(SplashScreenStore);
  private _renderer = inject(Renderer2);
  private _elementRef = inject(ElementRef);
  private _router = inject(Router);

  animationDuration = input(500, {
    transform: numberAttribute
  }); // in milliseconds
  hideDelay = input(1000, {
    transform: numberAttribute
  }); // in milliseconds

  constructor() {
    const initialVisible = this._store.visible();

    effect(() => {
      const currentVisible = this._store.visible();

      if (initialVisible === currentVisible) {
        return;
      }

      if (currentVisible) {
        this._show();
      } else {
        this._hide();
      }
    });

    afterNextRender(() => {
      const subscription = this._router.events
        .pipe(
          filter(event=> event instanceof NavigationEnd)
        )
        .subscribe(() => {
          subscription.unsubscribe();
          setTimeout(() => {
            this._hide();
            subscription.unsubscribe();
          }, this.hideDelay());
        })
      ;
    });
  }

  ngOnInit() {
    this._renderer.setProperty(
      this._elementRef.nativeElement, '--mfc-splash-screen-hide-animation-duration', (this.animationDuration() / 1000) + 's'
    );
  }

  private _show(): void {
    const loaderEl = this._elementRef.nativeElement as HTMLElement;
    this._renderer.setStyle(loaderEl, 'visibility', 'visible');
    this._renderer.setStyle(loaderEl, 'zIndex', '9999999');
  }

  private _hide(): void {
    const loaderEl = this._elementRef.nativeElement as HTMLElement;
    this._renderer.addClass(loaderEl, 'hide');
    setTimeout(() => {
      this._renderer.setStyle(loaderEl, 'visibility', 'hidden');
      this._renderer.setStyle(loaderEl, 'zIndex', '-9999999');
    }, this.animationDuration());
  }
}
