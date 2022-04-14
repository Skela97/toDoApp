import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnInit {

  @Input() title: string;
  @Input() subject: string;
  @Input() task: string;
  @Input() date: string;
  @Input() imageUrl: string;
  @Input() done: boolean;
  @ViewChild('f',{static: true})  form: NgForm;

  constructor(private modalCtrl: ModalController) { }

  //imageUrl: string;

  ngOnInit() {
  }

  onClose(){
    this.modalCtrl.dismiss( null, 'close');
  }

  onAddTask(){
    if(!this.form.valid){
      return;
    }
    console.log(this.form.value.imageUrl);


    if(this.form.value.imageUrl === 'red'){
      this.imageUrl = 'https://www.fundermax.at/fileadmin/redakteure/_processed_/a/3/csm_0674_Marsrot_A4_RGB_52b0a3202a.jpg';
    }else if(this.form.value.imageUrl === 'orange'){
      this.imageUrl = 'https://i1.sndcdn.com/avatars-000291473999-m7ddns-t500x500.jpg';
    }else if(this.form.value.imageUrl === 'yellow'){
      this.imageUrl = 'https://thecolor.blog/wp-content/uploads/2021/02/Amarillo-Canario.png';
    } else if(this.form.value.imageUrl === 'blue'){
      this.imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/2048px-Solid_blue.svg.png';
    } else if(this.form.value.imageUrl === 'green'){
      this.imageUrl = 'https://www.colorcombos.com/images/colors/5BC236.png';
    }
    console.log(this.imageUrl);

    this.modalCtrl.dismiss(
      {
        taskData:
        {
          subject: this.form.value.subject,
          task: this.form.value.task,
          date: this.form.value.date,
          imageUrl: this.imageUrl
        }
      },'confirm');


  }

}
