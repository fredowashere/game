import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { SidebarService } from '../services/sidebar.service';
import { DEFAULT_ENGINE_SETTINGS } from './features/models/engine-settings';
import { DEFAULT_MATERIALS } from './features/models/materials';
import { DEFAULT_LEVELS } from './features/models/levels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  destroy$ = new Subject<void>();

  constructor(
    public sidebarService: SidebarService,
    private router: Router
  ) { }

  ngOnInit() {

    // Autoscroll to top on route change
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd),
        tap(() => document.querySelector('.sb-layout__main')?.scrollTop)
      )
      .subscribe();

    // Populate localStorage with default settings
    if (!localStorage.getItem("engineSettings")) {
      localStorage.setItem("engineSettings", JSON.stringify(DEFAULT_ENGINE_SETTINGS));
    }
    if (!localStorage.getItem("levels")) {
      localStorage.setItem("levels", JSON.stringify(DEFAULT_LEVELS));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
