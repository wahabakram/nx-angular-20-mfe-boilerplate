import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebar } from '../../components/app-sidebar/app-sidebar';
import { AppHeader } from '../../components/app-header/app-header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, AppSidebar, AppHeader],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
