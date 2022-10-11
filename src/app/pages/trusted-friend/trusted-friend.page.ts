/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable radix */
import { NavController } from '@ionic/angular';
import { RestService } from '../../service/rest.service';
import { SMS } from '@ionic-native/sms/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit } from '@angular/core';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-trusted-friend',
  templateUrl: './trusted-friend.page.html',
  styleUrls: ['./trusted-friend.page.scss'],
})
export class TrustedFriendPage implements OnInit {
  form3 = false;
  isLoading = false;
  isLoading3 = false;
  latitude: any;
  longitude: any;
  friendId = '';
  friendName = '';
  friendNumber = '';
  addFri = {
    addfriendName: '',
    addfriendNumber: '',
  };
  countryCode = '+234';
  user: any;
  error = {
    status: false,
    message: '',
  };
  form3error = {
    status: false,
    message: '',
  };
  form = false;
  sendingLoading = false;
  trustedFriends = [];
  constructor(
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private rest: RestService,
    private sms: SMS
  ) {}
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/help');
  }
  gotoHelpDetail() {
    this.navCtrl.navigateBack('/help-detail');
  }
  editFriend(friend) {
    this.form = !this.form;
    this.friendId = friend.F_id;
    this.friendName = friend.F_Name;
    this.friendNumber = friend.F_number.split('+234')[1];
  }
  additionalFriend() {
    if (
      this.addFri.addfriendName === '' ||
      this.addFri.addfriendNumber === ''
    ) {
      this.form3error.status = true;
      this.form3error.message = 'Fill all the fields.';
      setTimeout(() => {
        this.form3error.status = false;
        this.form3error.message = '';
      }, 3000);
    } else {
      this.isLoading3 = true;
      this.rest
        .sendRequest('add_friend', {
          F_name: this.addFri.addfriendName,
          requestType: 'add',
          user_id: this.user.user_id,
          F_number: this.countryCode + this.addFri.addfriendNumber,
        })
        .subscribe(
          (data: any) => {
            this.isLoading3 = false;
            if (data.data.length === 0) {
              this.trustedFriends = data.data;
            } else {
              this.form = !this.form;
              this.form3 = !this.form3;
              this.trustedFriends = data.data;
            }
          },
          (err) => {
            console.log(err);
            this.isLoading3 = false;
            this.form3error.status = true;
            this.form3error.message = err.error.message;
            setTimeout(() => {
              this.form3error.status = false;
              this.form3error.message = '';
            }, 3000);
          }
        );
    }
  }
  addFriend() {
    if (
      this.friendName === '' ||
      this.countryCode === '' ||
      this.friendNumber === ''
    ) {
      this.error.status = true;
      this.error.message = 'Fill all the fields.';
      setTimeout(() => {
        this.error.status = false;
        this.error.message = '';
      }, 3000);
    } else {
      this.isLoading = true;
      this.rest
        .sendRequest('add_friend', {
          F_name: this.friendName,
          requestType: 'add',
          user_id: this.user.user_id,
          F_number: this.countryCode + this.friendNumber,
          friendId: this.friendId,
        })
        .subscribe(
          (data: any) => {
            this.isLoading = false;
            if (data.data.length === 0) {
              this.trustedFriends = [];
            } else {
              this.form = !this.form;
              this.form3 = false;
              this.trustedFriends = data.data;
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
  }
  async sendSos() {
    let numbers = '';
    this.trustedFriends.forEach((el, i) => {
      numbers += el.F_number;
      if (i !== this.trustedFriends.length - 1) {
        numbers += ',';
      }
    });
    let message;
    this.geolocation.getCurrentPosition().then(async (resp) => {
      let address;
      const optionsNativeGeo: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.nativeGeocoder
        .reverseGeocode(this.latitude, this.longitude, optionsNativeGeo)
        .then(async (result: NativeGeocoderResult[]) => {
          address = `${result[0].thoroughfare},${result[0].subLocality},${result[0].locality},${result[0].administrativeArea},${result[0].countryName}`;
          message = `HELP!
        ${address}
        Latitude: ${this.latitude} , Longitude: ${this.longitude}`;
          const options = {
            replaceLineBreaks: false,
            android: {
              intent: 'INTENT',
            },
          };
          this.sendingLoading = true;

          try {
            await this.sms.send(numbers, message, options);
            this.sendingLoading = false;
          } catch (e) {
            this.sendingLoading = false;
            console.log(e);
          }
        })
        .catch((error: any) => console.log(error));
    });
  }
  getFriend() {
    this.isLoading = true;
    this.rest
      .sendRequest('add_friend', {
        requestType: 'get',
        user_id: this.user.user_id,
      })
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          if (data.data.length === 0) {
            this.form = true;
            this.trustedFriends = data.data;
          } else {
            this.trustedFriends = data.data;
          }
        },
        (err) => {
          console.log(err);
          this.isLoading = false;
          this.form = !this.form;
        }
      );
  }
  addNewFriend() {
    this.form3 = !this.form3;
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getFriend();
  }
}
