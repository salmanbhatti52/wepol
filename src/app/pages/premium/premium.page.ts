/* eslint-disable radix */
import { CallNumber } from '@ionic-native/call-number/ngx';
import { RestService } from '../../service/rest.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
})
export class PremiumPage implements OnInit {
  locations: any;
  legalAssistNumber = '';
  trackMe = false;
  user: any;
  sub: any;
  deviceID: any;
  checkBack = false;
  selectedTime = '15 Mins';
  selectTime = false;
  checkBackService = false;
  restrictMe = false;
  vipComplaint = false;
  getLegalAssist = false;
  getMedicalAssist = false;
  getGeneralAdvice = false;
  constructor(
    private androidPermissions: AndroidPermissions,
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private rest: RestService
  ) {
    this.locations = [];
  }
  back() {
    this.navCtrl.navigateBack('/main');
  }
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  toggleServices(e) {
    if (e === 'trackMe') {
      this.trackMe = !this.trackMe;
      this.checkBack = false;
      this.restrictMe = false;
      this.vipComplaint = false;
      this.getLegalAssist = false;
      this.getMedicalAssist = false;
      this.getGeneralAdvice = false;
    }
    if (e === 'checkBack') {
      this.checkBack = !this.checkBack;
      this.trackMe = false;
      this.restrictMe = false;
      this.vipComplaint = false;
      this.getLegalAssist = false;
      this.getMedicalAssist = false;
      this.getGeneralAdvice = false;
    }
    if (e === 'restrictMe') {
      this.restrictMe = !this.restrictMe;
      this.trackMe = false;
      this.checkBack = false;
      this.vipComplaint = false;
      this.getLegalAssist = false;
      this.getMedicalAssist = false;
      this.getGeneralAdvice = false;
    }
    if (e === 'vipComplaint') {
      this.vipComplaint = !this.vipComplaint;
      this.trackMe = false;
      this.checkBack = false;
      this.restrictMe = false;
      this.getLegalAssist = false;
      this.getMedicalAssist = false;
      this.getGeneralAdvice = false;
    }
    if (e === 'getLegalAssist') {
      this.getLegalAssist = !this.getLegalAssist;
      this.trackMe = false;
      this.checkBack = false;
      this.restrictMe = false;
      this.vipComplaint = false;
      this.getMedicalAssist = false;
      this.getGeneralAdvice = false;
    }
    if (e === 'getMedicalAssist') {
      this.getMedicalAssist = !this.getMedicalAssist;
      this.trackMe = false;
      this.checkBack = false;
      this.restrictMe = false;
      this.vipComplaint = false;
      this.getLegalAssist = false;
      this.getGeneralAdvice = false;
    }
    if (e === 'getGeneralAdvice') {
      this.getGeneralAdvice = !this.getGeneralAdvice;
      this.trackMe = false;
      this.checkBack = false;
      this.restrictMe = false;
      this.vipComplaint = false;
      this.getLegalAssist = false;
      this.getMedicalAssist = false;
    }
  }
  checkBackBtn() {
    this.checkBackService = !this.checkBackService;
    localStorage.setItem('time', JSON.stringify(parseInt(this.selectedTime)));
    if (this.checkBackService) {
      if (this.checkBackService) {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.SEND_SMS)
          .then(
            (res) => {
              localStorage.setItem(
                'checkBack',
                JSON.stringify(this.checkBackService)
              );

              this.sub = this.rest
                .sendRequest('check_back_notification', {
                  requestType: 'checkBack',
                  deviceID: this.deviceID,
                  userID: this.user.user_id,
                  time: parseInt(this.selectedTime),
                })
                .subscribe((data) => {});
            },
            (err) =>
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.SEND_SMS
              )
          );
      }
    }
    if (!this.checkBackService) {
      this.sub.unsubscribe();
    }
  }
  openTime() {
    this.selectTime = !this.selectTime;
  }
  toggleTime(time) {
    this.selectedTime = time;
    this.selectTime = false;
  }
  callForLegalAssist() {
    this.callNumber
      .callNumber(this.legalAssistNumber, true)
      .then((numRes) => console.log('Launched dialer!', numRes))
      .catch((err) => console.log('Error launching dialer', err));
  }
  getEmergencyNumber() {
    this.rest
      .sendRequest('get_serivce_numbers', {
        requestType: 'legalAssist',
      })
      .subscribe(
        (data: any) => {
          this.legalAssistNumber = data.data.contact;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.deviceID = localStorage.getItem('deviceID');
    this.getEmergencyNumber();
    this.checkBackService = JSON.parse(localStorage.getItem('checkBack'));
  }
}
