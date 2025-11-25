import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';

export interface RatingDistribution {
  star: number;
  percentage: number;
}

export interface CustomerReviewsData {
  overallRating: number;
  totalRatings: number;
  distribution: RatingDistribution[];
}

@Component({
  selector: 'app-customer-reviews-card',
  imports: [
    MatProgressBar,
    MatIcon
  ],
  templateUrl: './customer-reviews-card.html',
  styleUrl: './customer-reviews-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'card-container'
  }
})
export class CustomerReviewsCard {
  readonly reviews = input.required<CustomerReviewsData>();
  readonly overallRatingStars = computed(() => {
    const rating = Math.round(this.reviews().overallRating);
    return Array.from({ length: 5 }, (_, i) => i < rating);
  });
}
