/* eslint-disable max-len */
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../task-element/task.model';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {

  task: Task; //= {id: 't1', subject:'Faks', task: 'Ispit 1', done: false, imageUrl:'https://img.favpng.com/16/4/17/computer-icons-action-item-task-android-clip-art-png-favpng-qEkWRa0viGcdBEf3Yp3T6mkyz.jpg'};

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('taskId')){
        this.navCtrl.navigateBack('/home');
        return;
      }
      this.isLoading = true;
      this.tasksService
      .getTask(paramMap.get('taskId'))
      .subscribe((task)=>{
        this.task = task;
        console.log(task);
        this.isLoading = false;
      });
    });
  }

  onDelete(){
    this.loadingCtrl.create({message:'Deleting...'}).then(loadingEl=>{
      loadingEl.present();
      this.tasksService.deleteTask(this.task.id).subscribe(()=>{
        loadingEl.dismiss();
        this.navCtrl.navigateBack('/home');
      });
    });
  }

  onSave(){
    this.modalCtrl
      .create({
        component: TaskModalComponent,
        componentProps: {title: 'Edit task', subject: this.task.subject, task: this.task.task, date: this.task.date, imageUrl: this.task.imageUrl},
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData);

        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({message: 'Editing...'})
            .then((loadingEl) => {
              loadingEl.present();
              this.tasksService
                .editTask(
                  this.task.id,
                  resultData.data.taskData.subject,
                  resultData.data.taskData.task,
                  resultData.data.taskData.date,
                  resultData.data.taskData.imageUrl,
                  this.task.userId
                )
                .subscribe((tasks) => {
                  this.task.task = resultData.data.taskData.task;
                  this.task.subject = resultData.data.taskData.subject;
                  this.task.date = resultData.data.taskData.date;
                  this.task.imageUrl = resultData.data.taskData.imageUrl;
                  loadingEl.dismiss();
                });
            });
        }
      });

  }
  onEdit(){}

}
