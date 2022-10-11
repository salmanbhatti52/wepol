import { NavController } from '@ionic/angular';
import { RestService } from '../../service/rest.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  interval: any;
  countDown = 5;
  countDownStart = false;
  user: any;
  showInfo = false;
  userType = false;
  showTick = false;
  constructor(private navCtrl: NavController, public rest: RestService) {}

  ngOnInit() {
    this.user = null;
    this.showInfo = false;
    this.showTick = false;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.userType = true;
    }
    if (this.user.user_id === 'anonymous') {
      this.userType = false;
    }
    const deviceID = localStorage.getItem('deviceID');
    if (deviceID) {
      this.rest
        .sendRequest('update_user_one_signal_id', {
          oneSignalID: deviceID,
          userID: this.user.user_id,
        })
        .subscribe(
          (data: any) => {},
          (err) => {
            console.log(err);
          }
        );
    }
  }
  ionViewWillEnter() {
    this.showInfo = false;
    this.showTick = false;
  }
  toggleInfo() {
    this.showInfo = !this.showInfo;
  }
  sendPanic() {
    if (this.showTick) {
      this.showTick = false;
      this.countDown = 5;
      return;
    }
    if (this.countDownStart) {
      clearInterval(this.interval);
      this.countDownStart = false;
      this.countDown = 5;
    } else {
      this.countDownStart = true;
      this.interval = setInterval(() => {
        this.countDown--;
        if (this.countDown === 0) {
          clearInterval(this.interval);
          this.countDownStart = false;
          this.showTick = !this.showTick;
          this.countDown = 5;
          setTimeout(() => {
            this.showTick = false;
          }, 5000);
        }
      }, 1000);
    }
  }
  gotoMakeAReport() {
    this.navCtrl.navigateForward('/make-report');
  }
  gotoSecurityAlert() {
    this.navCtrl.navigateForward('/security-alert');
  }
  gotoKnowYourArea() {
    this.navCtrl.navigateForward('/know-your-area');
  }
  getPoliceService() {
    this.navCtrl.navigateForward('/get-police-service');
  }
  gotoHelp() {
    this.navCtrl.navigateForward('/help');
  }
  gotoPremium() {
    this.navCtrl.navigateForward('/premium');
  }
  logout() {
    const deviceID = localStorage.getItem('deviceID');
    this.rest
      .sendRequest('logout', {
        deviceID,
      })
      .subscribe((data: any) => console.log(data.message));
    localStorage.removeItem('user');
    localStorage.removeItem('checkBack');
    this.navCtrl.navigateRoot('/home');
  }
  back() {
    this.navCtrl.navigateRoot('/middle');
  }
}
