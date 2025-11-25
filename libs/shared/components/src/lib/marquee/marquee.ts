import {
  Component,
  ElementRef,
  input,
  AfterContentInit,
  inject,
  PLATFORM_ID,
  booleanAttribute,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'mf-marquee',
  exportAs: 'mfMarquee',
  templateUrl: './marquee.html',
  styleUrl: './marquee.scss',
  host: {
    'class': 'mf-marquee'
  }
})
export class Marquee implements AfterContentInit, OnChanges, OnDestroy {
  private _elementRef = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);
  private _intersectionObserver?: IntersectionObserver;

  reverse = input(false, {
    transform: booleanAttribute
  });
  pauseOnHover = input(false, {
    transform: booleanAttribute
  });

  protected isInView = false;

  protected get nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reverse']) {
      this.nativeElement.style.setProperty('--mf-marquee-reverse', changes['reverse'].currentValue ? 'reverse' : '');
    }

    if (changes['pauseOnHover']) {
      this.nativeElement.style.setProperty('--mf-marquee-pause', changes['pauseOnHover'].currentValue ? 'paused' : 'running');
    }
  }

  ngAfterContentInit(): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    this._intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!this.isInView) {
          this.isInView = true;
        }
      } else if (this.isInView) {
        this.isInView = false;
      }
    });
    this._intersectionObserver.observe(this.nativeElement);
  }

  ngOnDestroy(): void {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
  }
}
