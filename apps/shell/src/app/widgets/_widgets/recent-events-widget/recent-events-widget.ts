import { Component, input, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Post {
  image: string;
  title: string;
}

@Component({
  selector: 'app-recent-events-widget',
  imports: [
    MatTab,
    NgOptimizedImage,
    MatTabGroup,
    RouterLink
  ],
  templateUrl: './recent-events-widget.html',
  styleUrl: './recent-events-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class RecentEventsWidget {
  readonly creatorHighlights = input<Post[]>([
    {
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop',
      title: "From Corporate Consulting to Online Training: Jeff Skipper's Journey with Forento",
    },
    {
      image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=500&auto=format&fit=crop',
      title: "One Academy Wasn't Enough – Roni's Building Four",
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop',
      title: 'Axel Bard Bringéus: Helping Founders Master Fundraising with Forento',
    },
  ]);

  readonly productUpdates = input<Post[]>([
    {
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&auto=format&fit=crop',
      title: 'New Feature: Advanced Analytics Dashboard Now Live!',
    },
    {
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop',
      title: 'Integration with YouTube is Now Available for All Creators.',
    },
  ]);
}
