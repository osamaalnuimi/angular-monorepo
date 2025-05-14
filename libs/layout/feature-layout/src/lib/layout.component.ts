import { Component, OnInit, viewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { NgClass } from '@angular/common';

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
    NgClass,
  ],
  selector: 'layout-feature-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  drawerRef = viewChild.required<Drawer>('drawerRef');
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home',
      },
      {
        label: 'About',
        icon: 'pi pi-info',
        routerLink: '/about',
      },
      {
        label: 'Contact',
        icon: 'pi pi-phone',
        routerLink: '/contact',
      },
    ];
  }

  closeCallback(e: any): void {
    this.drawerRef().close(e);
  }

  visible = false;
}
