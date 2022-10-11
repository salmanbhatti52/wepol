import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetPoliceServicePage } from './get-police-service.page';

const routes: Routes = [
  {
    path: '',
    component: GetPoliceServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetPoliceServicePageRoutingModule {}
