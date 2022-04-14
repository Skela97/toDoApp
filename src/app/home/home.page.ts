import { AuthService } from './../auth.service';
import { TaskModalComponent } from './../task-modal/task-modal.component';
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';
import { Task } from '../task-element/task.model';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

 tasks: Task[];
 private taskSub: Subscription;
 //private disabled = false;

  constructor(private tasksService: TasksService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private router: Router) {
    //this.tasks = this.tasksService.tasks;
  }
  ngOnInit() {
     this.taskSub = this.tasksService.tasks.subscribe((tasks)=>{
       this.tasks = tasks;
           
     });
  }
  
  ionViewWillEnter(){
    this.tasksService.getTasks().subscribe((tasks)=>{
      console.log(tasks);
      //this.tasks = tasks;
    });
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(){
    if(this.taskSub){
      this.taskSub.unsubscribe();
    }
  }

  openModal(){
    this.modalCtrl.create(
    {
      component: TaskModalComponent,
      componentProps: {title: 'Add task'}
    }).then((modal)=>{
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData)=>{
      if(resultData.role === 'confirm'){
        console.log(resultData);
        this.tasksService.addTask(
          resultData.data.taskData.subject,
          resultData.data.taskData.task,
          resultData.data.taskData.date,
          resultData.data.taskData.imageUrl
          ).subscribe((tasks)=>{
            //this.tasks = tasks;
            console.log();
          });
      }else if(resultData.role === 'close'){
        console.log('close');
      }
    });
  }
  onLogOut(){
    this.authService.logOut();
    this.router.navigateByUrl('');
  }


}
