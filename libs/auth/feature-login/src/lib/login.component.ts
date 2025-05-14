import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFacade } from '@angular-monorepo/auth/domain';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'auth-feature-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private loginFacade = inject(LoginFacade);

  ngOnInit() {}
}
