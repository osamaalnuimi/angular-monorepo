import { LoginFacade, User } from '@angular-monorepo/auth/domain';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';
import { Subject } from 'rxjs';

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
    InputSwitchModule,
    FormsModule,
    Ripple,
    RouterOutlet,
    RouterLink,
  ],
  selector: 'layout-feature-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  drawerRef = viewChild.required<Drawer>('drawerRef');

  private loginFacade = inject(LoginFacade);

  items: MenuItem[] | undefined;

  // Convert observables to signals
  user = toSignal(this.loginFacade.user$, {
    initialValue: null as User | null,
  });
  userPermissions = toSignal(this.loginFacade.userPermissions$, {
    initialValue: [] as string[],
  });

  // UI state
  visible = signal(false);
  darkMode = signal(false);

  private destroy$ = new Subject<void>();

  constructor() {
    // Set up effect to apply dark mode when the signal changes
    effect(() => {
      this.applyDarkMode();
      localStorage.setItem('darkMode', this.darkMode().toString());
    });
  }

  ngOnInit(): void {
    this.setupNavigationItems();
    this.initDarkMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupNavigationItems(): void {
    // The header menu will now be minimal or empty since we moved navigation to the drawer
    this.items = [
      // Empty or add any global actions here if needed
    ];
  }

  closeCallback(e: any): void {
    this.drawerRef().close(e);
  }

  logout(): void {
    this.loginFacade.logout();
  }

  toggleDarkMode() {
    this.darkMode.update((current) => !current);
  }

  private initDarkMode() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.darkMode.set(savedDarkMode === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.darkMode.set(prefersDark);
    }

    // Apply dark mode on initialization
    this.applyDarkMode();
  }

  private applyDarkMode() {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
