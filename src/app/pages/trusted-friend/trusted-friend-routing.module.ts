import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrustedFriendPage } from './trusted-friend.page';

const routes: Routes = [
  {
    path: '',
    component: TrustedFriendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrustedFriendPageRoutingModule {}
