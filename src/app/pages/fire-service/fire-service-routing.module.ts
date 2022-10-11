import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FireServicePage } from './fire-service.page';

const routes: Routes = [
  {
    path: '',
    component: FireServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FireServicePageRoutingModule {}
