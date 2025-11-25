import { Component, inject, input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ComponentConfig } from '../form-config.model';

@Component({
  selector: 'mf-text-content',
  imports: [],
  templateUrl: './text-content.html',
  styleUrl: './text-content.scss'
})
export class TextContent implements OnInit {
  private _sanitizer = inject(DomSanitizer);
  config = input.required<ComponentConfig>();
  sanitizedHtml: SafeHtml = '';

  constructor() {}

  ngOnInit() {
    this.sanitizedHtml = this._sanitizer.bypassSecurityTrustHtml(
      this.config().content?.['htmlContent'] || ''
    );
  }
}
