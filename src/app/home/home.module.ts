import { TaskElementComponent } from './../task-element/task-element.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TaskModalComponent } from '../task-modal/task-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, TaskElementComponent, TaskModalComponent],
  entryComponents: [TaskModalComponent]
})
export class HomePageModule {}
