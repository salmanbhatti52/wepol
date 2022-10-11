/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { RestService } from './service/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { SMS } from '@ionic-native/sms/ngx';

declare let window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  interVal: any;
  latitude: any;
  longitude: any;
  arr: any;
  identy: any;
  user: any;
  oneSignalAppId = 'ad28189a-7e35-4aef-bf35-4cb1aa08eadc';
  oneSignalFirebaseId = '782553208837';
  constructor(
    private androidPermissions: AndroidPermissions,
    private oneSignal: OneSignal,
    public platform: Platform,
    public toastController: ToastController,
    public rest: RestService,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private sms: SMS,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController
  ) {
    this.platform.ready().then(() => {
      this.rest.authState.subscribe((state) => {
        if (state) {
          this.user = JSON.parse(localStorage.getItem('user'));
          if (this.user.user_id !== 'anonymous') {
            this.navCtrl.navigateRoot('/main');
          }
        }
      });
      this.rest.isLoggedIn();
    });
    this.getDeviceId();
    this.pushNotification();
  }
  getDeviceId() {
    this.oneSignal.setLogLevel({ logLevel: 6, visualLevel: 2 });
    this.oneSignal.startInit(this.oneSignalAppId, this.oneSignalFirebaseId);
    this.oneSignal.endInit();
    this.oneSignal.getIds().then((identity) => {
      this.identy = identity;
      const deviceID = localStorage.getItem('deviceID');
      if (deviceID) {
        localStorage.setItem('deviceID', this.identy.userId);
      } else {
        localStorage.setItem('deviceID', this.identy.userId);
        this.rest
          .sendRequest('update_user_one_signal_id', {
            oneSignalID: deviceID,
          })
          .subscribe(
            (data: any) => {},
            (err) => {
              console.log(err);
            }
          );
      }
    });
  }
  pushNotification() {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.oneSignal.startInit(this.oneSignalAppId, this.oneSignalFirebaseId);

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );
    this.oneSignal.handleNotificationReceived().subscribe(async (data) => {
      const time = JSON.parse(localStorage.getItem('time'));
      this.countDown();
      const deviceID = localStorage.getItem('deviceID');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.showNotificaton(data.payload.body);
      const alert = await this.alertController.create({
        cssClass: 'notificationAlert',
        message: data.payload.body,
        backdropDismiss: false,
        buttons: [
          {
            text: 'No',
            cssClass: 'btn_no',
            handler: () => {
              this.showPopUp();
            },
          },
          {
            text: 'Yes',
            cssClass: 'btn_yes',
            handler: () => {
              clearInterval(this.interVal);
              this.rest
                .sendRequest('check_back_notification', {
                  requestType: 'checkBack',
                  deviceID,
                  userID: this.user.user_id,
                  time,
                })
                .subscribe((notiData: any) => {});
            },
          },
        ],
      });

      await alert.present();
      await alert.onDidDismiss();
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (data) => {
      const time = JSON.parse(localStorage.getItem('time'));
      this.user = JSON.parse(localStorage.getItem('user'));
      const deviceID = localStorage.getItem('deviceID');
      const alert = await this.alertController.create({
        cssClass: 'notificationAlert',
        message: data.notification.payload.body,
        backdropDismiss: false,
        buttons: [
          {
            text: 'No',
            cssClass: 'btn_no',
            handler: () => {
              this.showPopUp();
            },
          },
          {
            text: 'Yes',
            cssClass: 'btn_yes',
            handler: () => {
              clearInterval(this.interVal);
              this.rest
                .sendRequest('check_back_notification', {
                  requestType: 'checkBack',
                  deviceID,
                  userID: this.user.user_id,
                  time,
                })
                .subscribe((notiData: any) => {});
            },
          },
        ],
      });

      await alert.present();
      await alert.onDidDismiss();
    });

    this.oneSignal.endInit();
  }
  async showNotificaton(msg: string) {
    const toast = await this.toastController.create({
      header: 'Check Back Notification',
      message: msg,
      color: 'light',
      duration: 2000,
      position: 'top',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
    await toast.onDidDismiss();
  }
  countDown() {
    this.interVal = setInterval(() => {
      this.showPopUp();
    }, 10000);
  }
  showPopUp() {
    clearInterval(this.interVal);
    this.rest
      .sendRequest('add_friend', {
        requestType: 'get',
        user_id: this.user.user_id,
      })
      .subscribe(
        (data: any) => {
          const friendNumber = data.data.F_number;
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
                this.androidPermissions
                  .checkPermission(this.androidPermissions.PERMISSION.SEND_SMS)
                  .then(
                    (res) => console.log('Has permission?', res.hasPermission),
                    (err) =>
                      this.androidPermissions.requestPermission(
                        this.androidPermissions.PERMISSION.SEND_SMS
                      )
                  );
                address = `${result[0].thoroughfare},${result[0].subLocality},${result[0].locality},${result[0].administrativeArea},${result[0].countryName}`;
                message = `HELP!
  ${address}
  Latitude: ${this.latitude} , Longitude: ${this.longitude}`;
                const options = {
                  replaceLineBreaks: false,
                  android: {
                    intent: '',
                  },
                };
                try {
                  await this.sms.send(friendNumber, message, options);
                } catch (e) {
                  console.log(e);
                }
              })
              .catch((error: any) => console.log(error));
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
