import { Component } from '@angular/core';
import {
  LayoutBody,
  Layout,
  LayoutHeader,
  LayoutSidebar
} from '@ng-mf/components';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [
    Header,
    LayoutBody,
    Layout,
    LayoutHeader,
    LayoutSidebar,
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {}
