import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecurityAlertPageRoutingModule } from './security-alert-routing.module';

import { SecurityAlertPage } from './security-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecurityAlertPageRoutingModule
  ],
  declarations: [SecurityAlertPage]
})
export class SecurityAlertPageModule {}
