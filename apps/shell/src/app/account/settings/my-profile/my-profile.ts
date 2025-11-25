import { Component, inject, signal } from '@angular/core';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { Dicebear } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import { MatError, MatHint, MatInput, MatLabel, MatPrefix, MatSuffix } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { UploadFileSelectedEvent, UploadTriggerDirective } from '@ng-mf/components';
import { CountrySelect } from '@ng-mf/components';
import { PhoneInput } from '@ng-mf/components';
import { TimezoneSelect } from '@ng-mf/components';
import { DateFormatSelect } from '@ng-mf/components';
import { ButtonDirective } from '@ng-mf/components';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { Icon } from '@ng-mf/components';
import { usernameValidator } from '@ng-mf/components';
import { SOCIAL_MEDIA_LIST, SocialMediaItem } from '@/account/settings/mock-data/my-profile.mock';

@Component({
  imports: [
    MatButton,
    Dicebear,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    UploadTriggerDirective,
    CountrySelect,
    PhoneInput,
    TimezoneSelect,
    DateFormatSelect,
    ButtonDirective,
    MatSuffix,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatPrefix,
    Icon,
    MatMiniFabButton,
    MatHint,
    MatError,
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private formBuilder = inject(FormBuilder);

  readonly isUsernameReadOnly = signal(true);
  readonly socialMediaList = signal<SocialMediaItem[]>(SOCIAL_MEDIA_LIST);

  myProfileForm = this.formBuilder.group({
    fullName: ['Pavel Salauyou', [Validators.required]],
    jobTitle: ['Team Lead'],
    bio: ['Senior Angular Developer'],
    phoneNumber: ['+1 916-555-2284'],
    avatarUrl: [''],
    language: ['US'],
    timezone: [''],
    facebookLink: [''],
    discordLink: [''],
    xLink: [''],
    githubLink: [''],
    username: ['pavelsol', [Validators.required, usernameValidator()]],
    company: ['Elementarlabs'],
    dateFormat: ['MM/dd/yyyy', [Validators.required]],
    address: this.formBuilder.group({
      country: ['', [Validators.required]],
      city: ['London', [Validators.required]],
      postalCode: ['WC36 4UF'],
      street: ['Broadway', [Validators.required]],
      building: [93, [Validators.required]],
      apartment: [1, [Validators.required]],
      additionalInfo: ['']
    })
  });

  readonly avatarUploading = signal(false);
  readonly saving = signal(false);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Account',
        route: '/account/settings',
        type: 'link',
      },
      {
        id: 'myProfile',
        name: 'My Profile',
        type: null
      }
    ]);
  }

  get avatarUrl(): string {
    return this.myProfileForm.get('avatarUrl')?.value as string;
  }

  onAvatarFileSelected(event: UploadFileSelectedEvent) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.myProfileForm.patchValue({
        avatarUrl: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);

    // Upload the image to the server
    this.avatarUploading.set(true);
    setTimeout(() => {
      this.avatarUploading.set(false);
    }, 3000);
  }

  changeUsername() {
    this.isUsernameReadOnly.set(false);
  }

  removeAvatarUrl() {
    this.myProfileForm.patchValue({
      avatarUrl: ''
    });
  }

  save() {
    this.saving.set(true);
    // save the form data to the server
    setTimeout(() => {
      this.saving.set(false);
    }, 2000);
  }
}
