import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnowYourAreaPage } from './know-your-area.page';

const routes: Routes = [
  {
    path: '',
    component: KnowYourAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowYourAreaPageRoutingModule {}
