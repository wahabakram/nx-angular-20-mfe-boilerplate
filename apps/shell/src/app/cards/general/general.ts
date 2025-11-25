import { Component, inject, signal } from '@angular/core';
import { LatestNewsCard } from '@/cards/_cards/latest-news-card/latest-news-card';
import { NewsArticle } from '@/cards/_cards/news-article.model';
import {
  CustomerReviewsCard,
  CustomerReviewsData
} from '@/cards/_cards/customer-reviews-card/customer-reviews-card';
import {
  AddCreditCardFormCard
} from '@/cards/_cards/add-credit-card-form-card/add-credit-card-form-card';
import { UpgradeProPlanCard } from '@/cards/_cards/upgrade-pro-plan-card/upgrade-pro-plan-card';
import { BreadcrumbsStore } from '@ng-mf/components';
import { CUSTOMER_REVIEWS_DATA, NEWS_ARTICLES } from '@/cards/mock-data/general.mock';

@Component({
  selector: 'app-general',
  imports: [
    LatestNewsCard,
    CustomerReviewsCard,
    AddCreditCardFormCard,
    UpgradeProPlanCard,
  ],
  templateUrl: './general.html',
  styleUrl: './general.scss'
})
export class General {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  newsArticles = signal<NewsArticle[]>(NEWS_ARTICLES);
  customerReviewsData = signal<CustomerReviewsData>(CUSTOMER_REVIEWS_DATA);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'cards',
        name: 'Cards',
        route: '/cards/general',
        type: 'link',
      },
      {
        id: 'notifications',
        name: 'General',
        type: null
      }
    ]);
  }
}
