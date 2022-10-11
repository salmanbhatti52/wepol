/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../../service/rest.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  count = 0;
  countDown = 60;
  interval;
  sendAgainEmail = true;
  isLoading = false;
  showPass = false;
  showConPass = false;
  recoveryEmail: any;
  newPassword: any;
  confirmPassword: any;
  pin1: any;
  pin2: any;
  pin3: any;
  pin4: any;
  pin5: any;
  displayEmailSend = true;
  displayChangePassword = false;
  displayPinCode = false;
  emailError = {
    status: false,
    message: '',
  };
  pinError = {
    status: false,
    message: '',
  };
  passError = {
    status: false,
    message: '',
  };
  newPassError = {
    status: false,
    message: '',
  };
  confPassError = {
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
    public alertController: AlertController
  ) {}
  togglePass() {
    this.showPass = !this.showPass;
  }
  toggleConPass() {
    this.showConPass = !this.showConPass;
  }
  next(e, elNext, elBack) {
    if (e.keyCode === 8) {
      elBack.setFocus();
    } else {
      elNext.setFocus();
    }
  }
  ngOnInit() {}
  sendEmail(sendEmail?) {
    if (this.recoveryEmail) {
      if (!this.validateEmail(this.recoveryEmail)) {
        this.emailError.status = true;
        this.emailError.message = 'Invalid Email address.';
        setTimeout(() => {
          this.emailError.status = false;
          this.emailError.message = '';
        }, 3000);
        return;
      } else {
        if (sendEmail) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
        }
        this.rest
          .sendRequest('forgot_password', {
            requestType: 'send_code',
            user_email: this.recoveryEmail.trim(),
          })
          .subscribe(
            (data: any) => {
              this.isLoading = false;
              this.displayEmailSend = false;
              this.displayPinCode = true;
              this.pin1 = '';
              this.pin2 = '';
              this.pin3 = '';
              this.pin4 = '';
            },
            (err) => {
              this.isLoading = false;
              this.emailError.status = true;
              this.emailError.message = err.error.message;
              setTimeout(() => {
                this.emailError.status = false;
                this.emailError.message = '';
              }, 3000);
            }
          );
      }
    }
    if (!this.recoveryEmail) {
      this.emailError.status = true;
      this.emailError.message = 'Email is required';
    }
    setTimeout(() => {
      this.emailError.status = false;
      this.emailError.message = '';
    }, 3000);
  }
  pincodeSend() {
    if (this.pin1 && this.pin2 && this.pin3 && this.pin4 && this.pin5) {
      console.log(this.pin1 + this.pin2 + this.pin3 + this.pin4 + this.pin5);
      if (
        !this.isANumber(this.pin1) ||
        !this.isANumber(this.pin2) ||
        !this.isANumber(this.pin3) ||
        !this.isANumber(this.pin4) ||
        !this.isANumber(this.pin5)
      ) {
        this.pinError.status = true;
        this.pinError.message = 'Pin should contain only numbers!';
        setTimeout(() => {
          this.pinError.status = false;
          this.pinError.message = '';
        }, 3000);
      } else {
        this.isLoading = true;
        this.rest
          .sendRequest('forgot_password', {
            requestType: 'verify_code',
            user_email: this.recoveryEmail,
            code: this.pin1 + this.pin2 + this.pin3 + this.pin4 + this.pin5,
          })
          .subscribe(
            (data: any) => {
              this.isLoading = false;
              this.pin1 = '';
              this.pin2 = '';
              this.pin3 = '';
              this.pin4 = '';
              this.pin5 = '';
              this.displayPinCode = false;
              this.displayChangePassword = true;
            },
            (err) => {
              this.isLoading = false;
              this.pinError.status = true;
              this.pinError.message = err.error.message;
              setTimeout(() => {
                this.pinError.status = false;
                this.pinError.message = '';
              }, 3000);
            }
          );
      }
    } else {
      this.pinError.status = true;
      this.pinError.message = 'Pin is required';
      setTimeout(() => {
        this.pinError.status = false;
        this.pinError.message = '';
      }, 3000);
    }
  }
  sendAgain() {
    this.sendAgainEmail = false;
    this.sendEmail(false);
    this.timer();
  }
  timer() {
    this.interval = setInterval(() => {
      if (this.countDown === 0) {
        clearInterval(this.interval);
        this.sendAgainEmail = true;
        this.countDown = 60;
      } else {
        this.countDown = --this.countDown;
      }
    }, 1000);
  }
  isANumber(n) {
    const numStr = /^[0-9]+$/;
    return numStr.test(n.toString());
  }
  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  sendPinCode() {
    this.displayEmailSend = false;
    this.displayPinCode = false;
    this.displayChangePassword = true;
  }
  async reset() {
    if (this.newPassword && this.confirmPassword) {
      if (this.newPassword === this.confirmPassword) {
        this.isLoading = true;
        this.rest
          .sendRequest('forgot_password', {
            requestType: 'reset_password',
            user_email: this.recoveryEmail,
            user_password: this.newPassword,
          })
          .subscribe(
            async (data: any) => {
              this.isLoading = false;
              this.recoveryEmail = '';
              this.pin1 = '';
              this.pin2 = '';
              this.pin3 = '';
              this.pin4 = '';
              this.newPassword = '';
              this.confirmPassword = '';
              const alert = await this.alertController.create({
                cssClass: 'registeredAlert',
                message: 'Your Password is Reset.',
                backdropDismiss: false,
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.displayEmailSend = true;
                      this.displayPinCode = false;
                      this.displayChangePassword = false;
                      this.navCtrl.navigateRoot('/middle');
                    },
                    cssClass: 'btn_ok',
                  },
                ],
              });

              await alert.present();
              await alert.onDidDismiss();
            },
            (err) => {
              this.isLoading = false;
              this.passError.status = true;
              this.passError.message = err.error.message;
              setTimeout(() => {
                this.passError.status = false;
                this.passError.message = '';
              }, 3000);
            }
          );
      } else {
        this.confPassError.status = true;
        this.confPassError.message = 'Password not match!';
        setTimeout(() => {
          this.confPassError.status = false;
          this.confPassError.message = '';
        }, 3000);
      }
    }
    if (!this.newPassword) {
      this.newPassError.status = true;
      this.newPassError.message = 'Password is required';
    }
    if (!this.confirmPassword) {
      this.confPassError.status = true;
      this.confPassError.message = 'Confirm Password is required';
    }
    setTimeout(() => {
      this.newPassError.status = false;
      this.newPassError.message = '';
      this.confPassError.status = false;
      this.confPassError.message = '';
    }, 3000);
  }
  signup() {
    this.navCtrl.navigateForward('/signup');
  }
}
