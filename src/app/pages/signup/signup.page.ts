/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable max-len */
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { RestService } from '../../service/rest.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  showPass = false;
  isLoading = false;
  fbSignUp = false;
  googleSignUp = false;
  userData: any;
  showConPass = false;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  emailError = {
    status: false,
    message: '',
  };
  usernameError = {
    status: false,
    message: '',
  };
  passwordError = {
    status: false,
    message: '',
  };
  confirmPasswordError = {
    status: false,
    message: '',
  };
  error = {
    status: false,
    message: '',
  };
  constructor(
    private navCtrl: NavController,
    public alertController: AlertController,
    private rest: RestService,
    private googlePlus: GooglePlus,
    private fb: Facebook
  ) {}
  togglePass() {
    this.showPass = !this.showPass;
  }
  toggleConPass() {
    this.showConPass = !this.showConPass;
  }
  login() {
    this.navCtrl.navigateBack('/login');
  }
  signup() {
    if (this.email && this.username && this.password && this.confirmPassword) {
      if (!this.validateEmail(this.email)) {
        this.emailError.status = true;
        this.emailError.message = 'Invalid Email address.';
        setTimeout(() => {
          this.emailError.status = false;
          this.emailError.message = '';
        }, 3000);
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError.status = true;
        this.confirmPasswordError.message = "Password didn't match.";
        setTimeout(() => {
          this.confirmPasswordError.status = false;
          this.confirmPasswordError.message = '';
        }, 3000);
        return;
      }
      this.isLoading = true;
      this.rest
        .sendRequest('signup', {
          email: this.email,
          username: this.username,
          password: this.password,
        })
        .subscribe(
          async (data: any) => {
            this.isLoading = false;
            localStorage.setItem('user', JSON.stringify(data.data));
            this.isLoading = false;
            const alert = await this.alertController.create({
              cssClass: 'registeredAlert',
              message: 'Registered successfully.',
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.email = '';
                    this.username = '';
                    this.password = '';
                    this.confirmPassword = '';
                    if (data.data.message === 'verifyEmail') {
                      const navigationExtras: NavigationExtras = {
                        state: {
                          email: data.data.email,
                        },
                      };
                      this.navCtrl.navigateForward(
                        ['verify-email'],
                        navigationExtras
                      );
                    }
                  },
                  cssClass: 'btn_ok',
                },
              ],
            });

            await alert.present();
            await alert.onDidDismiss();
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
    if (!this.email) {
      this.emailError.status = true;
      this.emailError.message = 'Email address is required';
    }
    if (!this.username) {
      this.usernameError.status = true;
      this.usernameError.message = 'Username is required';
    }
    if (!this.password) {
      this.passwordError.status = true;
      this.passwordError.message = 'Password is required';
    }
    if (!this.confirmPassword) {
      this.confirmPasswordError.status = true;
      this.confirmPasswordError.message = 'Confirm Password is required';
    }
    setTimeout(() => {
      this.emailError.status = false;
      this.emailError.message = '';
      this.usernameError.status = false;
      this.usernameError.message = '';
      this.passwordError.status = false;
      this.passwordError.message = '';
      this.confirmPasswordError.status = false;
      this.confirmPasswordError.message = '';
    }, 3000);
  }
  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  back() {
    this.navCtrl.navigateBack('/middle');
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
              .sendRequest('signup', {
                email: this.userData.email,
                username: this.userData.name,
                fb_user_id: this.userData.id,
              })
              .subscribe(
                async (data: any) => {
                  this.fbSignUp = false;
                  localStorage.setItem('user', JSON.stringify(data.data));
                  this.isLoading = false;
                  const alert = await this.alertController.create({
                    cssClass: 'registeredAlert',
                    message: 'Registered successfully.',
                    backdropDismiss: false,
                    buttons: [
                      {
                        text: 'Ok',
                        handler: () => {
                          this.email = '';
                          this.username = '';
                          this.password = '';
                          this.confirmPassword = '';
                          if (Object.keys(localStorage).includes('user')) {
                            this.navCtrl.navigateRoot('/main');
                          }
                        },
                        cssClass: 'btn_ok',
                      },
                    ],
                  });

                  await alert.present();
                  await alert.onDidDismiss();
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
          });
      });
  }
  googlePlusSignup() {
    this.googleSignUp = true;
    this.googlePlus
      .login({})
      .then((res) => {
        this.userData = res;
        this.rest
          .sendRequest('signup', {
            email: this.userData.email,
            username: this.userData.displayName,
            google_user_id: this.userData.userId,
          })
          .subscribe(
            async (data: any) => {
              this.googleSignUp = false;
              localStorage.setItem('user', JSON.stringify(data.data));
              this.isLoading = false;
              const alert = await this.alertController.create({
                cssClass: 'registeredAlert',
                message: 'Registered successfully.',
                backdropDismiss: false,
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.email = '';
                      this.username = '';
                      this.password = '';
                      this.confirmPassword = '';
                      if (Object.keys(localStorage).includes('user')) {
                        this.navCtrl.navigateRoot('/main');
                      }
                    },
                    cssClass: 'btn_ok',
                  },
                ],
              });

              await alert.present();
              await alert.onDidDismiss();
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
      .catch((err) => console.error(err));
  }
  ngOnInit() {
    this.email = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
