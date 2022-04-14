/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresId: string;
  registrated?: boolean;
}

interface UserData{
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = false;
  private _user = new BehaviorSubject<User>(null);

  register(user: UserData){
    // eslint-disable-next-line no-underscore-dangle
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
    {email: user.email, password: user.password, returnSecureToken: true})
    .pipe(
      tap((userData)=>{
        const expirationTime = new Date(new Date().getTime() + +userData.expiresId * 1000);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
        // eslint-disable-next-line no-underscore-dangle
        this._user.next(user);
      })
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(private http: HttpClient) { }



  logIn(user: UserData){
    // eslint-disable-next-line no-underscore-dangle
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
    {email: user.email, password: user.password, returnSecureToken: true})
    .pipe(
      tap((userData)=>{
        const expirationTime = new Date(new Date().getTime() + +userData.expiresId * 1000);
        const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
        // eslint-disable-next-line no-underscore-dangle
        this._user.next(user);
      })
      );
  }
  logOut(){
    this._user.next(null);
  }

  get isUserAuthenticated(){
    return this._user.asObservable().pipe(
      map((user)=>{
        if(user){
          return ! !user.token;
        }else{
          return false;
        }
      })
    );
  }

  get userId(){
    return this._user.asObservable().pipe(
      map((user)=>{
        if(user){
          return user.id;
        }else{
          return null;
        }
      })
    );
  }

  get token(){
    return this._user.asObservable().pipe(
      map((user)=>{
        if(user){
          return user.token;
        }else{
          return null;
        }
      })
    );
  }

}
