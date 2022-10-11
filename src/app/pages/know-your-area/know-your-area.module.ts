import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KnowYourAreaPageRoutingModule } from './know-your-area-routing.module';

import { KnowYourAreaPage } from './know-your-area.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KnowYourAreaPageRoutingModule
  ],
  declarations: [KnowYourAreaPage]
})
export class KnowYourAreaPageModule {}
