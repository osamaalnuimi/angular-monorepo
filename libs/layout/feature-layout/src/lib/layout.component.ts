import { Component, OnInit, OnDestroy, viewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { LoginFacade } from '@angular-monorepo/auth/domain';
import { Subject, takeUntil } from 'rxjs';
import { User } from '@angular-monorepo/auth/domain';

@Component({
  imports: [
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    MenubarModule,
    BadgeModule,
    InputTextModule,
    Ripple,
    RouterModule,
  ],
  selector: 'layout-feature-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  drawerRef = viewChild.required<Drawer>('drawerRef');
  items: MenuItem[] | undefined;
  user: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private loginFacade: LoginFacade) {}

  ngOnInit(): void {
    // Subscribe to user information
    this.loginFacade.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      this.setupNavigationItems();
    });

    // Subscribe to user permissions
    this.loginFacade.userPermissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setupNavigationItems();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupNavigationItems(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users',
        visible: this.hasPermission('manage_users'),
      },
      {
        label: 'Roles',
        icon: 'pi pi-cog',
        routerLink: '/roles',
        visible: this.hasPermission('manage_roles'),
      },
    ];
  }

  closeCallback(e: any): void {
    this.drawerRef().close(e);
  }

  logout(): void {
    this.loginFacade.logout();
  }

  hasPermission(permission: string): boolean {
    return this.user?.role?.permissions?.includes(permission) || false;
  }

  visible = false;
}
