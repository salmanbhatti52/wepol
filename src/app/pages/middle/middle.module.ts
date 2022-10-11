import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiddlePageRoutingModule } from './middle-routing.module';

import { MiddlePage } from './middle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiddlePageRoutingModule
  ],
  declarations: [MiddlePage]
})
export class MiddlePageModule {}
