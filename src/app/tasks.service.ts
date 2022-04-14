/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Task } from './task-element/task.model';
import { AuthService } from './auth.service';

interface TaskData {
  subject: string;
  task: string;
  date: string;
  imageUrl: string;
  userId: string;

}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private _tasks = new BehaviorSubject<Task[]>([]);

   /*oldtasks: Task[] = [
     {id: 't1', subject:'Faks', task: 'Ispit 1', date: "01.01.21", done: true, imageUrl:'https://img.favpng.com/16/4/17/computer-icons-action-item-task-android-clip-art-png-favpng-qEkWRa0viGcdBEf3Yp3T6mkyz.jpg',userId:""},
     // eslint-disable-next-line max-len
     {id: 't2', subject:'Faks', task: 'Ispit 1', date: "01.02.21", done: false, imageUrl:'https://img.favpng.com/16/4/17/computer-icons-action-item-task-android-clip-art-png-favpng-qEkWRa0viGcdBEf3Yp3T6mkyz.jpg',userId:""}
   ];*/

  constructor(private http: HttpClient, private authService: AuthService) { }

  get tasks(){
    // eslint-disable-next-line no-underscore-dangle
    return this._tasks.asObservable();
  }



  addTask(subject: string, task: string, date: string, imageUrl: string)
  {
    let generatedId;
    let newTask: Task;
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId=>{
        fetchedUserId = userId;
        return this.authService.token;

      }),take(1),
      switchMap((token)=>{
        newTask = new Task(
          null,
          subject,
          task,
          date,
          imageUrl,
          fetchedUserId
          );
          return this.http
    .post<{name: string}>
    (`https://todo-mr-fon-default-rtdb.europe-west1.firebasedatabase.app/tasks.json?auth=${token}`, newTask);
      }),
      take(1),
      switchMap((resData)=>{
        generatedId = resData.name;
        return this.tasks;
      }),
      take(1),
      tap((tasks)=>{
        newTask.id = generatedId;
        // eslint-disable-next-line no-underscore-dangle
        this._tasks.next(tasks.concat(newTask));
      })
      );
  }

  getTasks(){
    let fuserId;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId=>{
        fuserId = userId;
        return this.authService.token;
      })
    ,take(1),
      switchMap((token)=>this.http
        .get<{[key: string]: TaskData}>(
          `https://todo-mr-fon-default-rtdb.europe-west1.firebasedatabase.app/tasks.json?auth=${token}`)),
      map((taskData: any)=>{
        const tasks: Task[] = [];
        for(const key in taskData){
          if(taskData.hasOwnProperty(key)){
            if(taskData[key].userId === fuserId){
            tasks.push(new Task(key, taskData[key].subject, taskData[key].task, taskData[key].date, taskData[key].imageUrl, taskData[key].userId)
            );}
          }
        }
        return tasks;
      }),
      tap(tasks=>{
        // eslint-disable-next-line no-underscore-dangle
        this._tasks.next(tasks);
      })
    );
  }

  getTask(id: string){
    return this.authService.token.pipe(
      take(1),
      switchMap((token)=>this.http.get<TaskData>(
          `https://todo-mr-fon-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json?auth=${token}`
        )),
      map((resData: TaskData)=>new Task(
          id,
          resData.subject,
          resData.task,
          resData.date,
          resData.imageUrl,
          resData.userId
        ))
    );
  }

  deleteTask(id: string){
    return this.authService.token.pipe(
      take(1),
      switchMap((token)=>this.http.delete(
          `https://todo-mr-fon-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json?auth=${token}`
        )),
      switchMap(()=>this.tasks),
      take(1),
      tap((tasks)=>{
        // eslint-disable-next-line no-underscore-dangle
        this._tasks.next(tasks.filter((q) => q.id !== id));
      })
    );
  }

  editTask(
    id: string,
    subject: string,
    task: string,
    date: string,
    imageUrl: string,
    userId: string
    ){
      // if(imageUrl === "red"){
      //   imageUrl = "https://www.fundermax.at/fileadmin/redakteure/_processed_/a/3/csm_0674_Marsrot_A4_RGB_52b0a3202a.jpg";
      // }else if(imageUrl === "orange"){
      //   imageUrl = "https://i1.sndcdn.com/avatars-000291473999-m7ddns-t500x500.jpg";
      // }else if(imageUrl === "yellow"){
      //   imageUrl = "https://thecolor.blog/wp-content/uploads/2021/02/Amarillo-Canario.png";
      // } else if(imageUrl === "blue"){
      //   imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/2048px-Solid_blue.svg.png";
      // } else if(imageUrl === "green"){
      //   imageUrl = "https://www.colorcombos.com/images/colors/5BC236.png";
      // }
      return this.authService.token.pipe(
        take(1),
        switchMap((token) => this.http.put(
            `https://todo-mr-fon-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json?auth=${token}`,
            {
              subject,
              task,
              date,
              imageUrl,
              userId,
            }
          )),
        switchMap(() => this.tasks),
        take(1),
        tap((tasks) => {
          const updatedQuoteIndex = tasks.findIndex((q) => q.id === id);
          const updatedQuotes = [...tasks];
          updatedQuotes[updatedQuoteIndex] = new Task(
            id,
            subject,
            task,
            date,
            imageUrl,
            userId
          );
          // eslint-disable-next-line no-underscore-dangle
          this._tasks.next(updatedQuotes);
        })
      );
    }

}
