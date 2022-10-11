import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FireServicePageRoutingModule } from './fire-service-routing.module';

import { FireServicePage } from './fire-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FireServicePageRoutingModule
  ],
  declarations: [FireServicePage]
})
export class FireServicePageModule {}
