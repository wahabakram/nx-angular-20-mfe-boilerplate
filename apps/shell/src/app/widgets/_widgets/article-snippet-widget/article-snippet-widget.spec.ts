import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSnippetWidget } from './article-snippet-widget';

describe('ArticleSnippetWidget', () => {
  let component: ArticleSnippetWidget;
  let fixture: ComponentFixture<ArticleSnippetWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleSnippetWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleSnippetWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
