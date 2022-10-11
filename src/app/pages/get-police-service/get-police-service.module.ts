import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetPoliceServicePageRoutingModule } from './get-police-service-routing.module';

import { GetPoliceServicePage } from './get-police-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetPoliceServicePageRoutingModule
  ],
  declarations: [GetPoliceServicePage]
})
export class GetPoliceServicePageModule {}
