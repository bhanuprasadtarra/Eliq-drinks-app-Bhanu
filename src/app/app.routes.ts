import { Routes } from '@angular/router';
import { ListPage } from './pages/list/list.page';
import { DetailsPage } from './pages/details/details.page';

export const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: ListPage },
  { path: 'details', component: DetailsPage },
];
