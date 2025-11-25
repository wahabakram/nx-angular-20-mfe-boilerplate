import { Component } from '@angular/core';
import { AnnouncementGlobal } from '@ng-mf/components';
import { IncidentsContainer } from '@ng-mf/components';
import {
  LayoutBody,
  Layout,
  LayoutHeader,
  LayoutSidebar, LayoutTopbar
} from '@ng-mf/components';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/_partials/header/header';
import { Sidebar } from '@/_partials/sidebar/sidebar';

@Component({
  selector: 'app-app',
  imports: [
    AnnouncementGlobal,
    Header,
    IncidentsContainer,
    LayoutBody,
    Layout,
    LayoutHeader,
    LayoutSidebar,
    LayoutTopbar,
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
