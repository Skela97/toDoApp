/* eslint-disable max-len */
import { AuthService } from './../auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private router: Router, private toastController: ToastController, private authService: AuthService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('Ime'),
      email: new FormControl(null),
      password: new FormControl(null)
    });
  }

  onRegister(){
    //console.log(this.registerForm);
    if(this.registerForm.valid){
      this.loadingCtrl
      .create({message: 'Registering...'})
      .then((loadingEl)=>{
        loadingEl.present();
        this.authService.register(this.registerForm.value).subscribe(resData=>{
          console.log('Reg uspesna');
          console.log(resData);
          this.router.navigateByUrl('/welcome');
          this.presentToastSuccess();
          this.loadingCtrl.dismiss();
        });
      });
      
    }else{
      this.loadingCtrl.dismiss();    
      this.router.navigateByUrl('/register');
      this.presentToastError();
    }
  }

  async presentToastSuccess() {
    const toast = await this.toastController.create({
      message: 'Successful registration.',
      duration: 500,
      position: 'bottom',
      animated: true
    });
    toast.present();
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Something is missing!',
      duration: 400
    });
    toast.present();
  }

}
