import { Component, computed, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import { MatButton, MatIconAnchor, MatIconButton } from '@angular/material/button';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIcon } from '@angular/material/icon';

import { MatTooltip } from '@angular/material/tooltip';
import { UploadTriggerDirective } from '@ng-mf/components';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Drawer } from '@ng-mf/components';
import { PanelBody, Panel, PanelHeader } from '@ng-mf/components';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow } from '@angular/material/chips';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { TimeAgoPipe } from '@ng-mf/components';
import { Topic, Channel } from '../post.model';
import { MarkdownEditor } from '@ng-mf/components';
import { AutoFocusDirective } from '@ng-mf/components';
import { OverlayScrollbar } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import findRecursive from '@/_utils/find-recursive';

@Component({
  selector: 'app-new',
  imports: [
    MatButton,
    CdkTextareaAutosize,
    MatIcon,
    ReactiveFormsModule,
    TimeAgoPipe,
    MatIconAnchor,
    RouterLink,
    MatTooltip,
    UploadTriggerDirective,
    MarkdownEditor,
    FormsModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIconButton,
    Drawer,
    Panel,
    PanelHeader,
    PanelBody,
    MatHint,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatFormField,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatChipInput,
    MatChipGrid,
    MatChipRemove,
    MatChipRow,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatButton,
    TimeAgoPipe,
    AutoFocusDirective,
    OverlayScrollbar
  ],
  templateUrl: './new.html',
  styleUrl: './new.scss'
})
export class New {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private _route = inject(ActivatedRoute);
  private _formBuilder = inject(FormBuilder);
  private _matDialog = inject(MatDialog);
  private _topicInput = viewChild.required<ElementRef>('topicInput');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  // Local state (no publication object)
  status = signal<{ type: 'draft' | 'published' } | null>(null);
  channel = signal<Channel | null>(null);
  updatedAt = signal<string | null>(null);
  hasChanges = signal<boolean>(false);
  hash = signal<string>('');
  form = this._formBuilder.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    authorId: ['', [Validators.required]],
    licenseTypeId: ['all-rights-reserved', [Validators.required]],
    channelId: [''],
    metaTitle: [''],
    metaDescription: [''],
    topics: [[]],
    canonicalUrl: [''],
    discussionEnabled: [false],
    pinned: [false]
  });
  saving = signal(false);
  featuredImageUploading = signal(false);
  featuredImageUrl = signal<string>('');
  allTopics = signal<Topic[]>([]);
  filteredTopics = signal<Topic[]>([]);
  topicNameControl = new FormControl('');
  topics = signal<Topic[]>([]);
  channels = signal<Channel[]>([]);
  openAIApiKey = signal('');
  licenseTypes = signal<any[]>([
    {
      id: 'all-rights-reserved',
      name: 'All rights reserved',
      position: 0,
      rules: [
        {
          name: 'Others cannot copy, distribute, or perform your work without your permission (or as permitted by fair use).',
          icon: 'assets/license-types/creative-commons-cc.svg',
        },
      ],
      isDefault: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Some rights reserved',
      rules: [
        {
          name: 'Others can distribute, remix, and build upon your work as long as they credit you.',
          icon: 'assets/license-types/creative-commons-attribution.svg',
        },
      ],
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Attribution',
          rules: [],
          position: 0,
        },
        {
          id: crypto.randomUUID(),
          name: 'Attribution, no derivatives',
          position: 1,
          rules: [
            {
              name: 'Others can only distribute non-derivative copies of your work.',
              icon: 'assets/license-types/creative-commons-nd.svg',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Attribution, share alike',
          position: 2,
          rules: [
            {
              name: 'Others must distribute derivatives of your work under the same license.',
              icon: 'assets/license-types/creative-commons-sharealike.svg',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Attribution, non-commercial',
          position: 3,
          rules: [
            {
              name: 'Others can use your work for non-commercial purposes only.',
              icon: 'assets/license-types/creative-commons-nc.svg',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Attribution, non-commercial, no derivatives',
          position: 4,
          rules: [
            {
              name: 'Others can use your work for non-commercial purposes only.',
              icon: 'assets/license-types/creative-commons-nc.svg',
            },
            {
              name: 'Others can only distribute non-derivative copies of your work.',
              icon: 'assets/license-types/creative-commons-sharealike.svg',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Attribution, non-commercial, share alike',
          position: 5,
          rules: [
            {
              name: 'Others can use your work for non-commercial purposes only.',
              icon: 'assets/license-types/creative-commons-zero.svg',
            },
            {
              name: 'Others must distribute derivatives of your work under the same license.',
              icon: '',
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: 'No rights reserved',
      position: 3,
      rules: [],
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Creative Commons copyright waiver',
          position: 0,
          rules: [
            {
              name: 'You waive all your copyright and related rights in this work, worldwide.',
              icon: '',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Public domain',
          position: 1,
          rules: [
            {
              name: 'This work is already in the public domain and free of copyright restrictions.',
              icon: '',
            },
          ],
        },
      ],
    },
  ]);

  featureImageBackgroundColor = model('#fef9c3');
  textColor = model('#000');
  autoposting = signal(false);

  content = signal<any>(null);

  pattern = model('none');
  patterns = signal([
    {
      name: 'None',
      value: 'none'
    },
    {
      name: 'Dots Pattern',
      value: 'dotsPattern'
    },
    {
      name: 'Dots Pattern 2',
      value: 'dotsPattern2'
    }
  ]);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'home',
        name: 'Posts',
        route: '/management/posts/list',
        type: 'link',
      },
      {
        id: 'createNew',
        name: 'Create New Post',
        type: null
      }
    ]);
  }

  get licenseRules(): any[] {
    const licenseTypeId = this.form.value.licenseTypeId;
    const licenseType = findRecursive<any>(
      this.licenseTypes(), (_: any) => _.id === licenseTypeId
    );

    if (licenseType) {
      let rules = licenseType.rules || [];
      const parent = findRecursive<any>(
        this.licenseTypes(), (_: any) => _.id === licenseType.parentId
      );

      if (parent) {
        rules = [...parent.rules, ...rules];
      }

      return rules;
    }

    return [];
  }

  ngOnInit() {
    this._initAutoSaving();
  }

  imageSelected(selectedFileEvent: any): void {
    this.featuredImageUploading.set(true);
    this.featuredImageUrl.set(window.URL.createObjectURL(selectedFileEvent.files[0]));
    const formData = new FormData();
    formData.append('image', selectedFileEvent.files[0]);

    // Simulated async upload completion
    setTimeout(() => {
      this.featuredImageUploading.set(false);
    }, 500);
  }

  deleteFeaturedImage(): void {
    this.featuredImageUrl.set('');

    // Simulate async delete
    setTimeout(() => {
      // no-op; image url already cleared
    }, 300);
  }

  publish(): void {
    this.featuredImageUrl.set('');

    // Simulated publish
    setTimeout(() => {
      this.status.set({ type: 'published' });
      this.updatedAt.set(new Date().toISOString());
      this.hasChanges.set(false);
    }, 400);
  }

  addTopic(event: MatChipInputEvent): void {
    if (this.topics().length >= 6) {
      return;
    }

    const value = (event.value || '').trim();

    if (value) {
      const existingTopic = this.allTopics().find(_ => _.name.toLowerCase() === value.toLowerCase());

      if (!existingTopic) {
        const newTopic: Topic = {
          id: crypto.randomUUID(),
          slug: crypto.randomUUID(),
          name: value,
          logoUrl: '',
          description: '',
          publicationsCount: 0,
          followersCount: 0
        };
        this.allTopics.update(list => [...list, newTopic]);
        this.topics.update(list => [...list, newTopic]);
      } else {
        const publicationTopicsIndex = this.topics().findIndex(
          _ => _.name.toLowerCase() === value.toLowerCase()
        );

        if (publicationTopicsIndex === -1) {
          this.topics.update(list => [...list, existingTopic]);
        }
      }

      // @ts-ignore
      this.form.get('topics')?.setValue(this.topics());
    }

    event.chipInput!.clear();
    this.topicNameControl.setValue(null);
  }

  removeTopic(topic: Topic): void {
    const currentTopics = this.topics();
    const publicationTopicsIndex = currentTopics.findIndex(_ => _.id === topic.id);

    if (publicationTopicsIndex >= 0) {
      const updated = [
        ...currentTopics.slice(0, publicationTopicsIndex),
        ...currentTopics.slice(publicationTopicsIndex + 1)
      ];
      this.topics.set(updated);
      // @ts-ignore
      this.form.get('topics')?.setValue(updated);
    }
  }

  topicSelected(event: MatAutocompleteSelectedEvent): void {
    const currentTopics = this.topics();
    const publicationTopicsIndex = currentTopics.findIndex(_ => _.id === event.option.value.id);

    if (publicationTopicsIndex === -1) {
      const updated = [...currentTopics, event.option.value];
      this.topics.set(updated);
      // @ts-ignore
      this.form.get('topics')?.setValue(updated);
    }

    this._topicInput().nativeElement.value = '';
    this.topicNameControl.setValue(null);
  }

  get imageUploadUrl() {
    const hash = this.hash();
    return `studio/publication/edit/${hash}/upload/image`;
  }

  onContentChange(value: any): void {
    this.form.get('content')?.setValue(value);
  }

  get topicsString(): string {
    const topics: any = this.form.value.topics;
    return topics.map((topic: any) => topic.name).join(', ');
  }

  addChannel(channel: Channel | null = null): void {
    // const dialogRef = this._matDialog.open(ChannelListModal, {
    //   width: '800px',
    //   maxWidth: '800px',
    //   minHeight: '740px',
    //   data: {
    //     channel
    //   }
    // });
    // dialogRef.afterClosed().subscribe((channel: Channel | null) => {
    //   const pub = this.publication();
    //   if (pub) {
    //     this.publication.set({ ...pub, channel });
    //   }
    //
    //   if (channel) {
    //     this.form.get('channelId')?.setValue(channel.id);
    //   } else if (channel === null) {
    //     this.form.get('channelId')?.setValue(null);
    //   }
    // });
  }

  generateImage() {
    if (!this.form.value.title) {
      return;
    }

    // const dialogRef = this._matDialog.open(GenerateAiImageModal, {
    //   width: '960px',
    //   maxWidth: '960px',
    //   minHeight: '500px',
    //   data: {
    //     title: this.form.value.title
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //
    //   }
    // });
  }

  private _initAutoSaving(): void {
    const hash = this._route.snapshot.params['hash'];
    this.hash.set(hash || '');
    let timeout: any;
    this.form
      .valueChanges
      .subscribe(() => {
        this.hasChanges.set(true);
        this.saving.set(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          // Simulated async save
          setTimeout(() => {
            this.updatedAt.set(new Date().toISOString());
            this.hasChanges.set(false);
            this.saving.set(false);
          }, 300);
        }, 1000);
      })
    ;
  }

  autopost() {
    this.autoposting.set(true);

    // Simulated autoposting
    setTimeout(() => {
      // we could set a flag if needed; keeping minimal changes
      this.autoposting.set(false);
    }, 600);
  }
}
