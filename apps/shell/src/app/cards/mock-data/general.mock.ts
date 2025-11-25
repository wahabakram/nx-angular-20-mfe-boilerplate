import { NewsArticle } from '@/cards/_cards/news-article.model';
import { CustomerReviewsData } from '@/cards/_cards/customer-reviews-card/customer-reviews-card';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    date: 'August 25, 2023',
    title: '8 Things Parents want from a Martial Arts Dojo',
    imageUrl:
      'https://images.pexels.com/photos/8612453/pexels-photo-8612453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    date: 'July 31, 2023',
    title: '7 Benefits of Karate and Martial Arts for Kids',
    imageUrl:
      'https://images.pexels.com/photos/8437060/pexels-photo-8437060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const CUSTOMER_REVIEWS_DATA: CustomerReviewsData = {
  overallRating: 4.7,
  totalRatings: 40,
  distribution: [
    { star: 5, percentage: 84 },
    { star: 4, percentage: 9 },
    { star: 3, percentage: 4 },
    { star: 2, percentage: 2 },
    { star: 1, percentage: 1 },
  ],
};
