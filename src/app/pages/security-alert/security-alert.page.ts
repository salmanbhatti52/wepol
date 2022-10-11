import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../../service/rest.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-security-alert',
  templateUrl: './security-alert.page.html',
  styleUrls: ['./security-alert.page.scss'],
})
export class SecurityAlertPage implements OnInit {
  latitude: number;
  longitude: number;
  countryName: any = '';
  reports: any = [];
  isLoading = true;
  constructor(
    private navCtrl: NavController,
    private rest: RestService,
    private photoViewer: PhotoViewer,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.countryName = localStorage.getItem('country');
    if (this.countryName) {
      this.getReports();
    }
    this.getLocation();
  }
  getLocation() {
    const optionsNativeGeo: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    if (!this.countryName) {
      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          this.latitude = resp.coords.latitude;
          this.longitude = resp.coords.longitude;
          if (!this.countryName) {
            this.nativeGeocoder
              .reverseGeocode(this.latitude, this.longitude, optionsNativeGeo)
              .then((result: NativeGeocoderResult[]) => {
                localStorage.setItem('country', result[0].countryName);
                this.countryName = result[0].countryName;
                this.getReports();
              })
              .catch((error: any) => console.log(error));
          }
        })
        .catch((error) => {
          console.log('Error getting location', error);
        });
    }
  }
  getReports() {
    this.rest
      .sendRequest('make_reports', {
        requestType: 'get',
        countryName: this.countryName,
      })
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          data.data.forEach((rep) => {
            if (rep.category === 'Traffic Accident') {
              this.reports.push({
                title: rep.category,
                message: rep.note,
                address: rep.address,
                date: rep.date.split(' ')[0],
                time:
                  rep.date.split(' ')[1].split('-')[1] + rep.date.split(' ')[2],
              });
            } else {
              this.reports.push({
                title: rep.name,
                message: rep.note,
                address: rep.address,
                date: rep.date.split(' ')[0],
                time:
                  rep.date.split(' ')[1].split('-')[1] + rep.date.split(' ')[2],
                image: `https://dev.eigix.com/wepol/${rep.image}`,
              });
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }
  back() {
    this.navCtrl.navigateBack('/main');
  }
  openImage(image) {
    this.photoViewer.show(image);
  }
  home() {
    this.navCtrl.navigateRoot('/main');
  }
}
