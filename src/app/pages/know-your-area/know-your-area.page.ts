/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable radix */
/* eslint-disable max-len */
import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../service/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';

declare let google;
interface Marker {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  content: string;
}
@Component({
  selector: 'app-know-your-area',
  templateUrl: './know-your-area.page.html',
  styleUrls: ['./know-your-area.page.scss'],
})
export class KnowYourAreaPage implements OnInit {
  map = null;
  latitude: number;
  longitude: number;
  countryName: any = '';
  infoWindows: any = [];
  googleMarkers: any = [];
  markers: Marker[] = [];

  constructor(
    private navCtrl: NavController,
    private rest: RestService,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.countryName = localStorage.getItem('country');
    this.map = null;
    this.infoWindows = [];
    this.googleMarkers = [];
    if (this.countryName) {
      this.getReports();
    }
    this.loadMap();
  }

  loadMap() {
    const optionsNativeGeo: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
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
        // create a new map by passing HTMLElement
        const mapEle: HTMLElement = document.getElementById('map');
        // create LatLng object
        const myLatLng = { lat: this.latitude, lng: this.longitude };
        // create map
        const myStyles = [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ];

        this.map = new google.maps.Map(mapEle, {
          center: myLatLng,
          zoom: 16,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: myStyles,
        });
        mapEle.focus();
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.renderMarkers();
          mapEle.classList.add('show-map');
        });
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }

  renderMarkers() {
    this.markers.forEach((marker) => {
      const newMarker = this.addMarker(marker);
      const infoWindow = new google.maps.InfoWindow({
        content: newMarker.content,
        maxWidth: 400,
      });
      this.infoWindows.push(infoWindow);
      this.googleMarkers.push(newMarker);
      let count = 0;
      newMarker.addListener('click', () => {
        this.infoWindows.forEach((win) => {
          win.close();
        });
        count++;
        if (count === 2) {
          count = 0;
          infoWindow.close(this.map, newMarker);
        } else {
          infoWindow.open(this.map, newMarker);
        }
      });
      this.map.addListener('click', () => {
        count = 0;
        infoWindow.close(this.map, newMarker);
      });
    });
  }
  closeInfoWindows() {}
  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
      content: marker.content,
      icon: '/assets/icon/marker.svg',
    });
  }
  getReports() {
    this.rest
      .sendRequest('make_reports', {
        requestType: 'get',
        countryName: this.countryName,
      })
      .subscribe(
        (data: any) => {
          this.markers = [];
          data.data.forEach((report) => {
            let contentString;
            if (report.category === 'Traffic Accident') {
              contentString = `<div>
              <h5>${report.category}</h5>
              <p>${report.address}</p>
              <h6 style="font-size:12px">${report.date.split(' ')[0]},${
                report.note
              }</h6>
              </div>`;
            } else {
              contentString = `<div>
              <h5>${report.name}</h5>
              <p>${report.address}</p>
              <h6 style="font-size:12px">${report.date.split(' ')[0]},${
                report.note
              } </h6>
              </div>`;
            }
            this.markers.push({
              position: {
                lat: parseFloat(report.latitude),
                lng: parseFloat(report.longitude),
              },
              title: report.category,
              content: contentString,
            });
          });
          this.renderMarkers();
        },
        (err) => {
          console.log(err);
        }
      );
  }
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/main');
  }
}
