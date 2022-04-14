/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Task } from './task.model';

@Component({
  selector: 'app-task-element',
  templateUrl: './task-element.component.html',
  styleUrls: ['./task-element.component.scss'],
})
export class TaskElementComponent implements OnInit {

  @Input() task: Task = {id:'t2', subject:'Posao', task:'Neki tekst', date:'01 01 21', imageUrl:'https://img.favpng.com/16/4/17/computer-icons-action-item-task-android-clip-art-png-favpng-qEkWRa0viGcdBEf3Yp3T6mkyz.jpg',userId:''};

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {}

  openAlert(event){
    event.stopPropagation();

    this.alertCtrl.create({
      header: '',
      message: '',
      buttons: [
        {
          text: 'Save',
          handler: ()=>{
            console.log('Save it');

          }
        }
      ]
    }).then((alert) => alert.present());
  }

}
