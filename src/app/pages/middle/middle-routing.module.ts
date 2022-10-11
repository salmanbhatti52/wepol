import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiddlePage } from './middle.page';

const routes: Routes = [
  {
    path: '',
    component: MiddlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiddlePageRoutingModule {}
