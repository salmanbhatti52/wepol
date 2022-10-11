/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { RestService } from '../../service/rest.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  userEmail: any;
  isLoading = false;
  count = 0;
  countDown = 60;
  interval;
  sendAgainEmail = true;
  pin1: any;
  pin2: any;
  pin3: any;
  pin4: any;
  pin5: any;
  pinError = {
    status: false,
    message: '',
  };
  error = {
    status: false,
    message: '',
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private rest: RestService,
    public alertController: AlertController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.userEmail = this.router.getCurrentNavigation().extras.state.email;
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  ngOnInit() {}
  next(e, elNext, elBack) {
    if (e.keyCode === 8) {
      elBack.setFocus();
    } else {
      elNext.setFocus();
    }
  }
  sendAgain() {
    this.sendAgainEmail = false;
    this.sendEmail();
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
  sendEmail() {
    this.rest
      .sendRequest('verify_email', {
        requestType: 'send_code',
        user_email: this.userEmail,
      })
      .subscribe(
        (data: any) => {},
        (err) => {
          this.error.status = true;
          this.error.message = err.error.message;
          setTimeout(() => {
            this.error.status = false;
            this.error.message = '';
          }, 3000);
        }
      );
  }
  isANumber(n) {
    const numStr = /^[0-9]+$/;
    return numStr.test(n.toString());
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
          .sendRequest('verify_email', {
            requestType: 'verify_code',
            user_email: this.userEmail,
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
              localStorage.setItem('user', JSON.stringify(data.data));
              if (Object.keys(localStorage).includes('user')) {
                this.navCtrl.navigateRoot('/main');
              }
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
  back() {
    this.navCtrl.navigateRoot('/login');
  }
}
