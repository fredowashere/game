import { Component, QueryList, ViewChildren } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { intersection } from 'src/app/utils/array';

interface SidebarSubitem {
  title: string;
  path: string;
  icon?: string;
  roles?: string[];
}

interface SidebarItem {
  isActive: boolean; // Make the collapse work
  title: string;
  path?: string;
  icon?: string;
  children?: SidebarSubitem[];
  roles?: string[];
}

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class DashboardSidebarComponent {

  // Get all view children with #rla applied
  @ViewChildren('rla')
  rlaList!: QueryList<RouterLinkActive>;
  
  intersection = intersection;

  sidebarItems: SidebarItem[] = [
    {
      isActive: false,
      title: 'Maps',
      icon: 'fa fa-map',
      path: '/dashboard/maps-manager',
    },
    {
      isActive: false,
      title: 'Materials',
      icon: 'bi bi-palette-fill',
      path: '/dashboard/materials-manager',
    }
  ];

  username$: Observable<string | undefined>; 

  constructor(
    public sidebarService: SidebarService,
    public authService: AuthService
  ) {
    this.username$ = this.authService.user$
      .pipe(map(user => user.username));
  }

  ngAfterViewInit(): void {

    if (!this.rlaList) return;

    // Wait for the router to activate
    setTimeout(() => {

      // Look for the currently activated route
      const activeItemIndex = this.rlaList.toArray()
        .findIndex(x => x.isActive);

      // If there's and active item, then expand it
      if (activeItemIndex > -1)
        this.sidebarItems[activeItemIndex].isActive = true;
    }, 150);
  }
}
