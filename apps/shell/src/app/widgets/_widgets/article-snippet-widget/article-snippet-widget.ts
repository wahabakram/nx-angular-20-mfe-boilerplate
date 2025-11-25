import { Component, input, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { DatePipe } from '@angular/common';

export interface IArticleSnippetWidget {
  title: string;
  publishedAt: Date | string;
  imagePreviewUrl: string;
}

@Component({
  selector: 'app-article-snippet-widget',
  imports: [
    MatRipple,
    DatePipe
  ],
  templateUrl: './article-snippet-widget.html',
  styleUrl: './article-snippet-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class ArticleSnippetWidget implements OnInit {
  widget = input.required<IArticleSnippetWidget>();

  ngOnInit() {
  }
}
