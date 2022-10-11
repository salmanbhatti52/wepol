import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrustedFriendPageRoutingModule } from './trusted-friend-routing.module';

import { TrustedFriendPage } from './trusted-friend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrustedFriendPageRoutingModule,
  ],
  declarations: [TrustedFriendPage],
})
export class TrustedFriendPageModule {}
