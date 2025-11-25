import { Component, input } from '@angular/core';
import { NewsArticle } from '@/cards/_cards/news-article.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgOptimizedImage } from '@angular/common';
import { HorizontalDivider } from '@ng-mf/components';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-latest-news-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgOptimizedImage,
    HorizontalDivider,
    RouterLink,
  ],
  templateUrl: './latest-news-card.html',
  styleUrl: './latest-news-card.scss',
  host: {
    'class': 'card-container'
  }
})
export class LatestNewsCard {
  readonly articles = input.required<NewsArticle[]>();
}
