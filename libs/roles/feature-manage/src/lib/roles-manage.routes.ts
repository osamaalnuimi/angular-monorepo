import { Routes } from '@angular/router';
import { ManageComponent } from './manage.component';
import { ManageFacade } from '@angular-monorepo/roles/domain';
import { provideRolesFeature } from './roles-feature.providers';

export const rolesManageRoutes: Routes = [
  {
    path: '',
    providers: [
      {
        provide: ManageFacade,
        useClass: ManageFacade,
      },
      provideRolesFeature(),
    ],
    component: ManageComponent,
  },
];
