import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  isLoading = false;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm){
    this.isLoading = true;
    console.log(form);
    if(form.valid){
      this.authService.logIn(form.value)
        .subscribe(resData=>{
          console.log(resData);
          console.log('Prijava uspesna');
          this.isLoading = false;
          this.router.navigateByUrl('/home');
          this.presentToastSuccess();
        },
        errRes =>{
          console.log(errRes);
          this.isLoading = false;
          const message = 'Incorect email or password!';
          this.presentToastError(message);
        }
      );
    }else{
      this.isLoading = false;
      this.presentToastError('Something is missing!');
    }
  }


    async presentToastSuccess() {
      const toast = await this.toastController.create({
        message: 'Successful login.',
        duration: 500,
        position: 'bottom',
        animated: true
      });
      toast.present();
    }

    async presentToastError(message: string) {
      const toast = await this.toastController.create({
        message,
        duration: 4000
      });
      toast.present();
    }

    onBack(){
      console.log('back');
      this.router.navigateByUrl('');
    }

}
