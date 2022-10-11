/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { RestService } from '../../service/rest.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPass = false;
  isLoading = false;
  fbSignUp = false;
  googleSignUp = false;
  userData: any;
  username: string;
  password: string;
  passwordError = {
    status: false,
    message: '',
  };
  usernameError = {
    status: false,
    message: '',
  };
  error = {
    status: false,
    message: '',
  };
  constructor(
    private navCtrl: NavController,
    private rest: RestService,
    private googlePlus: GooglePlus,
    private fb: Facebook
  ) {}
  togglePass() {
    this.showPass = !this.showPass;
  }
  signup() {
    this.navCtrl.navigateForward('/signup');
  }
  forgotPass() {
    this.navCtrl.navigateForward('/forgot-password');
  }
  login() {
    if (this.username && this.password) {
      this.isLoading = true;
      this.rest
        .sendRequest('login', {
          username: this.username,
          signupType: 'user',
          requestType: 'user',
          password: this.password,
        })
        .subscribe(
          async (data: any) => {
            this.isLoading = false;
            if (data.data.message === 'verifyEmail') {
              const navigationExtras: NavigationExtras = {
                state: {
                  email: data.data.email,
                },
              };
              this.navCtrl.navigateForward(['verify-email'], navigationExtras);
            } else {
              localStorage.setItem('user', JSON.stringify(data.data));
              this.username = '';
              this.password = '';
              if (Object.keys(localStorage).includes('user')) {
                this.navCtrl.navigateRoot('/main');
              }
            }
          },
          (err) => {
            console.log(err);
            this.isLoading = false;
            this.error.status = true;
            this.error.message = err.error.message;
            setTimeout(() => {
              this.error.status = false;
              this.error.message = '';
            }, 3000);
          }
        );
    }
    if (!this.username) {
      this.usernameError.status = true;
      this.usernameError.message = 'Username is required';
    }
    if (!this.password) {
      this.passwordError.status = true;
      this.passwordError.message = 'Password is required';
    }
    setTimeout(() => {
      this.usernameError.status = false;
      this.usernameError.message = '';
      this.passwordError.status = false;
      this.passwordError.message = '';
    }, 3000);
  }
  loginWithFB() {
    this.fbSignUp = true;
    this.fb
      .login(['email', 'public_profile'])
      .then((response: FacebookLoginResponse) => {
        this.fb
          .api('me?fields=id,name,email,first_name', [])
          .then(async (profile) => {
            this.userData = profile;
            this.rest
              .sendRequest('login', {
                email: this.userData.email,
                username: this.userData.name,
                signupType: 'facebook',
                requestType: 'user',
                fb_user_id: this.userData.id,
              })
              .subscribe(
                (data: any) => {
                  this.fbSignUp = false;
                  localStorage.setItem('user', JSON.stringify(data.data));
                  if (Object.keys(localStorage).includes('user')) {
                    this.navCtrl.navigateRoot('/main');
                  }
                },
                (err) => {
                  console.log(err);
                  this.fbSignUp = false;
                  this.error.status = true;
                  this.error.message = err.error.message;
                  setTimeout(() => {
                    this.error.status = false;
                    this.error.message = '';
                  }, 3000);
                }
              );
          })
          .catch((err) => {
            this.fbSignUp = false;
            console.log(JSON.stringify(err));
          });
      })
      .catch((err) => {
        this.fbSignUp = false;
        console.log(JSON.stringify(err));
      });
  }
  googlePlusSignup() {
    this.googleSignUp = true;
    this.googlePlus
      .login({})
      .then((res) => {
        this.userData = res;
        this.rest
          .sendRequest('login', {
            email: this.userData.email,
            signupType: 'google',
            requestType: 'user',
            username: this.userData.displayName,
            google_user_id: this.userData.userId,
          })
          .subscribe(
            (data: any) => {
              this.googleSignUp = false;
              localStorage.setItem('user', JSON.stringify(data.data));
              if (Object.keys(localStorage).includes('user')) {
                this.navCtrl.navigateRoot('/main');
              }
            },
            (err) => {
              console.log(err);
              this.googleSignUp = false;
              this.error.status = true;
              this.error.message = err.error.message;
              setTimeout(() => {
                this.error.status = false;
                this.error.message = '';
              }, 3000);
            }
          );
      })
      .catch((err) => {
        this.googleSignUp = false;
        console.error(err);
      });
  }
  back() {
    this.navCtrl.navigateBack('/middle');
  }
  ngOnInit() {}
}
