import { Component, signal, computed, inject } from '@angular/core';
import { PanelBody, Panel, PanelHeader } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { OverlayScrollbar } from '@ng-mf/components';
import { ReactiveFormsModule } from '@angular/forms';
import { Dicebear } from '@ng-mf/components';
import { Container } from '@/_partials/container/container';
import {
  BlockState,
  BlockStateContent,
  BlockStateIcon,
  BlockStateTitle,
} from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

export interface Contact {
  name: string;
  jobTitle: string;
  avatarUrl?: string;
}

@Component({
  imports: [
    Panel,
    PanelHeader,
    PanelBody,
    MatButton,
    MatIcon,
    MatRipple,
    OverlayScrollbar,
    ReactiveFormsModule,
    Dicebear,
    Container,
    BlockState,
    BlockStateContent,
    BlockStateIcon,
    BlockStateTitle,
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  private readonly allContacts = signal<Contact[]>([
    {
      name: 'Alice Harding',
      jobTitle: 'Track Service Worker',
      avatarUrl: 'https://i.pravatar.cc/80?u=AliceHarding',
    },
    {
      name: 'Alissa Nelson',
      jobTitle: 'Bindery Machine Operator',
      avatarUrl: 'https://i.pravatar.cc/80?u=AlissaNelson',
    },
    {
      name: 'Alvarado Turner',
      jobTitle: 'Fundraising Director',
      avatarUrl: 'https://i.pravatar.cc/80?u=AlvaradoTurner',
    },
    {
      name: 'Alyce Cash',
      jobTitle: 'Weather Analyst',
      avatarUrl: 'https://i.pravatar.cc/80?u=AlyceCash',
    },
    {
      name: 'Angela Gallagher',
      jobTitle: 'Electromedical Equipment Technician',
      avatarUrl: 'https://i.pravatar.cc/80?u=AngelaGallagher',
    },
    {
      name: 'Barber Johnson',
      jobTitle: 'Talent Manager',
      avatarUrl: 'https://i.pravatar.cc/80?u=BarberJohnson',
    },
    {
      name: 'Bernard Langley',
      jobTitle: 'Electromedical Equipment Technician',
      avatarUrl: 'https://i.pravatar.cc/80?u=BernardLangley',
    },
    {
      name: 'Best Blackburn',
      jobTitle: 'Hotel Manager',
      avatarUrl: 'https://i.pravatar.cc/80?u=BestBlackburn',
    },
    { name: 'Bolton Obrien', jobTitle: 'Banker Mason' },
    {
      name: 'Casey Jordan',
      jobTitle: 'Systems Analyst',
      avatarUrl: 'https://i.pravatar.cc/80?u=CaseyJordan',
    },
    {
      name: 'Cameron Ortiz',
      jobTitle: 'UX/UI Designer',
      avatarUrl: 'https://i.pravatar.cc/80?u=CameronOrtiz',
    },
    { name: 'Charlie Rivera', jobTitle: 'DevOps Engineer' },
    {
      name: 'Chris Evans',
      jobTitle: 'Project Manager',
      avatarUrl: 'https://i.pravatar.cc/80?u=ChrisEvans',
    },
    {
      name: 'Cody Fisher',
      jobTitle: 'Data Scientist',
      avatarUrl: 'https://i.pravatar.cc/80?u=CodyFisher',
    },
    {
      name: 'Chloe Green',
      jobTitle: 'Marketing Specialist',
      avatarUrl: 'https://i.pravatar.cc/80?u=ChloeGreen',
    },
    {
      name: 'Connor Hill',
      jobTitle: 'Network Administrator',
      avatarUrl: 'https://i.pravatar.cc/80?u=ConnorHill',
    },
    {
      name: 'Claire Mitchell',
      jobTitle: 'Graphic Designer',
      avatarUrl: 'https://i.pravatar.cc/80?u=ClaireMitchell',
    },
    { name: 'Caleb Perez', jobTitle: 'Mechanical Engineer' },
    {
      name: 'Catalina Roberts',
      jobTitle: 'Accountant',
      avatarUrl: 'https://i.pravatar.cc/80?u=CatalinaRoberts',
    },
    {
      name: 'Daisy Phillips',
      jobTitle: 'HR Coordinator',
      avatarUrl: 'https://i.pravatar.cc/80?u=DaisyPhillips',
    },
    {
      name: 'David Lee',
      jobTitle: 'Software Developer',
      avatarUrl: 'https://i.pravatar.cc/80?u=DavidLee',
    },
    { name: 'Diana Ross', jobTitle: 'Chief Financial Officer' },
    {
      name: 'Derek Wright',
      jobTitle: 'Operations Manager',
      avatarUrl: 'https://i.pravatar.cc/80?u=DerekWright',
    },
    {
      name: 'Dylan Flores',
      jobTitle: 'Quality Assurance Tester',
      avatarUrl: 'https://i.pravatar.cc/80?u=DylanFlores',
    },
    {
      name: 'Eleanor Vance',
      jobTitle: 'Content Strategist',
      avatarUrl: 'https://i.pravatar.cc/80?u=EleanorVance',
    },
    {
      name: 'Ethan Hunt',
      jobTitle: 'Security Consultant',
      avatarUrl: 'https://i.pravatar.cc/80?u=EthanHunt',
    },
    {
      name: 'Eva Chen',
      jobTitle: 'Product Owner',
      avatarUrl: 'https://i.pravatar.cc/80?u=EvaChen',
    },
    { name: 'Elijah Wood', jobTitle: 'Digital Marketer' },
    {
      name: 'Emily White',
      jobTitle: 'Lead Developer',
      avatarUrl: 'https://i.pravatar.cc/80?u=EmilyWhite',
    },
    {
      name: 'Felix Grant',
      jobTitle: 'Business Analyst',
      avatarUrl: 'https://i.pravatar.cc/80?u=FelixGrant',
    },
    {
      name: 'Fiona Scott',
      jobTitle: 'Customer Support Rep',
      avatarUrl: 'https://i.pravatar.cc/80?u=FionaScott',
    },
    { name: 'Frank Murphy', jobTitle: 'IT Support Specialist' },
    {
      name: 'Faith Howard',
      jobTitle: 'Sales Director',
      avatarUrl: 'https://i.pravatar.cc/80?u=FaithHoward',
    },
    {
      name: 'George Clooney',
      jobTitle: 'Brand Ambassador',
      avatarUrl: 'https://i.pravatar.cc/80?u=GeorgeClooney',
    },
    {
      name: 'Grace Hall',
      jobTitle: 'Recruiter',
      avatarUrl: 'https://i.pravatar.cc/80?u=GraceHall',
    },
    {
      name: 'Gavin Nelson',
      jobTitle: 'Database Administrator',
      avatarUrl: 'https://i.pravatar.cc/80?u=GavinNelson',
    },
    {
      name: 'Gabriella Adams',
      jobTitle: 'Legal Counsel',
      avatarUrl: 'https://i.pravatar.cc/80?u=GabriellaAdams',
    },
    {
      name: 'Henry Cavill',
      jobTitle: 'Public Relations Manager',
      avatarUrl: 'https://i.pravatar.cc/80?u=HenryCavill',
    },
    { name: 'Hannah Baker', jobTitle: 'Social Media Manager' },
    {
      name: 'Ian Somerhalder',
      jobTitle: 'Chief Technology Officer',
      avatarUrl: 'https://i.pravatar.cc/80?u=IanSomerhalder',
    },
    {
      name: 'Isla Fisher',
      jobTitle: 'Research Scientist',
      avatarUrl: 'https://i.pravatar.cc/80?u=IslaFisher',
    },
    {
      name: 'Ivan Petrov',
      jobTitle: 'Machine Learning Engineer',
      avatarUrl: 'https://i.pravatar.cc/80?u=IvanPetrov',
    },
    { name: 'Ivy Dickens', jobTitle: 'Executive Assistant' },
    {
      name: 'Jack Grealish',
      jobTitle: 'Financial Analyst',
      avatarUrl: 'https://i.pravatar.cc/80?u=JackGrealish',
    },
    {
      name: 'Jasmine Taylor',
      jobTitle: 'Medical Doctor',
      avatarUrl: 'https://i.pravatar.cc/80?u=JasmineTaylor',
    },
    {
      name: 'Jason Momoa',
      jobTitle: 'Creative Director',
      avatarUrl: 'https://i.pravatar.cc/80?u=JasonMomoa',
    },
    {
      name: 'Jessica Day',
      jobTitle: 'School Teacher',
      avatarUrl: 'https://i.pravatar.cc/80?u=JessicaDay',
    },
    {
      name: 'Kevin Hart',
      jobTitle: 'Logistics Coordinator',
      avatarUrl: 'https://i.pravatar.cc/80?u=KevinHart',
    },
    { name: 'Katherine Pierce', jobTitle: 'Lead Architect' },
    {
      name: 'Leo DiCaprio',
      jobTitle: 'Environmental Scientist',
      avatarUrl: 'https://i.pravatar.cc/80?u=LeoDiCaprio',
    },
    {
      name: 'Luna Lovegood',
      jobTitle: 'Technical Writer',
      avatarUrl: 'https://i.pravatar.cc/80?u=LunaLovegood',
    },
    {
      name: 'Mason Mount',
      jobTitle: 'Compliance Officer',
      avatarUrl: 'https://i.pravatar.cc/80?u=MasonMount',
    },
    { name: 'Mia Thermopolis', jobTitle: 'Public Relations' },
    {
      name: 'Nathan Drake',
      jobTitle: 'Archaeologist',
      avatarUrl: 'https://i.pravatar.cc/80?u=NathanDrake',
    },
    {
      name: 'Nora West-Allen',
      jobTitle: 'Forensic Scientist',
      avatarUrl: 'https://i.pravatar.cc/80?u=NoraWestAllen',
    },
    {
      name: 'Oliver Queen',
      jobTitle: 'CEO',
      avatarUrl: 'https://i.pravatar.cc/80?u=OliverQueen',
    },
    { name: 'Olivia Pope', jobTitle: 'Crisis Manager' },
    {
      name: 'Peter Parker',
      jobTitle: 'Photographer',
      avatarUrl: 'https://i.pravatar.cc/80?u=PeterParker',
    },
    {
      name: 'Penelope Garcia',
      jobTitle: 'Technical Analyst',
      avatarUrl: 'https://i.pravatar.cc/80?u=PenelopeGarcia',
    },
  ]);
  readonly searchTerm = signal<string>('');
  readonly filteredGroupedContacts = computed(() => {
    const filterText = this.searchTerm().toLowerCase();
    const contacts = this.allContacts();

    const filtered = filterText
      ? contacts.filter((c) => c.name.toLowerCase().includes(filterText))
      : contacts;

    const grouped = filtered.reduce((groups, contact) => {
      const letter = contact.name[0].toUpperCase();
      const group = groups.get(letter) || [];
      group.push(contact);
      groups.set(letter, group);
      return groups;
    }, new Map<string, Contact[]>());

    return new Map([...grouped.entries()].sort());
  });

  readonly totalContacts = computed(() => this.allContacts().length);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'contacts',
        name: 'Contacts',
        type: null,
      },
    ]);
  }

  onSearchTermChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  public addContact(): void {}
}
