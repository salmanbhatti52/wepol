/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
import { IonSearchbar, NavController, AlertController } from '@ionic/angular';
import { RestService } from '../../service/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';

declare let google: any;

@Component({
  selector: 'app-fire-service',
  templateUrl: './fire-service.page.html',
  styleUrls: ['./fire-service.page.scss'],
})
export class FireServicePage implements OnInit {
  @ViewChild('autocomplete', { static: false }) autoComplete: IonSearchbar;
  @ViewChild('autocompleteTraffic', { static: false })
  autoCompleteTraffic: IonSearchbar;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  isLoading = false;
  setImage = false;
  displayImage = '/assets/icon/selectImage.svg';
  imageURI: any;
  map: any;
  address: any;
  infoWindow: any;
  mylocMarker: any;
  latitude: number;
  longitude: number;
  user: any;
  contactNumber = '';
  numberGet = true;
  markers: any = [];
  addAddressManually = false;
  error = {
    status: false,
    message: '',
  };
  constructor(
    private navCtrl: NavController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private rest: RestService,
    private camera: Camera
  ) {}
  ionViewDidEnter() {
    this.showMap();
  }
  showMap() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        const optionsNativeGeo: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5,
        };
        const location = new google.maps.LatLng(this.latitude, this.longitude);
        const myStyles = [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ];

        const options = {
          center: location,
          zoom: 15,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: myStyles,
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.infoWindow = new google.maps.InfoWindow();
        let pos = {
          lat: this.latitude,
          lng: this.longitude,
        };
        this.nativeGeocoder
          .reverseGeocode(pos.lat, pos.lng, optionsNativeGeo)
          .then((result: NativeGeocoderResult[]) => {
            this.latitude = pos.lat;
            this.longitude = pos.lng;
            this.address = `${
              result[0].thoroughfare ? result[0].thoroughfare + ', ' : ''
            }${result[0].subLocality ? result[0].subLocality + ', ' : ''}${
              result[0].locality ? result[0].locality + ', ' : ''
            }${result[0].administrativeArea},${result[0].countryName}`;
            this.infoWindow.setPosition(pos);
            this.infoWindow.setContent(
              `<div>
                  <p>${
                    result[0].thoroughfare ? result[0].thoroughfare + ', ' : ''
                  }${
                result[0].subLocality ? result[0].subLocality + ', ' : ''
              }${result[0].locality ? result[0].locality + ', ' : ''}${
                result[0].administrativeArea
              },${result[0].countryName}
                  </p>
                  <p>Latitude:${result[0].latitude} , Longitude: ${
                result[0].longitude
              }</p>
                </div>`
            );
            this.infoWindow.open(this.map);
            this.map.setCenter(pos);
          })
          .catch((error: any) => console.log(error));
        this.map.addListener('click', (mapsMouseEvent) => {
          this.deleteMarkers();
          // Close the current InfoWindow.
          this.infoWindow.close();
          if (this.mylocMarker) {
            this.mylocMarker.setMap(this.map);
          }
          // Create a new InfoWindow.
          this.infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
          });
          const loc = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
          pos = JSON.parse(loc);
          const marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            icon: 'assets/icon/myLoc.svg',
          });
          this.map.setCenter(pos);
          this.markers.push(marker);

          this.nativeGeocoder
            .reverseGeocode(pos.lat, pos.lng, optionsNativeGeo)
            .then((result: NativeGeocoderResult[]) => {
              this.latitude = pos.lat;
              this.longitude = pos.lng;
              this.address = `${
                result[0].thoroughfare ? result[0].thoroughfare + ', ' : ''
              }${result[0].subLocality ? result[0].subLocality + ', ' : ''}${
                result[0].locality ? result[0].locality + ', ' : ''
              }${result[0].administrativeArea},${result[0].countryName}`;
              this.infoWindow.setPosition(pos);
              this.infoWindow.setContent(
                `<div>
                <p>${
                  result[0].thoroughfare ? result[0].thoroughfare + ', ' : ''
                }${result[0].subLocality ? result[0].subLocality + ', ' : ''}${
                  result[0].locality ? result[0].locality + ', ' : ''
                }${result[0].administrativeArea},${result[0].countryName}
                </p>
                  <p>Latitude:${result[0].latitude} , Longitude: ${
                  result[0].longitude
                }</p>
                </div>`
              );
              this.infoWindow.open(this.map);
              this.map.setCenter(pos);
            })
            .catch((error: any) => console.log(error));
        });
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }
  deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }
  async selectImage() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Select Image',
      buttons: [
        {
          text: 'Choose from Gallery',
          handler: (res) => this.takePhotoFromGallery(),
        },
        {
          text: 'Camera',
          handler: (res) => this.takePhotoFromCamera(),
        },
        {
          text: 'Remove',
          cssClass: 'danger',
          handler: (res) => {
            this.displayImage = '/assets/icon/selectImage.svg';
            this.setImage = false;
          },
        },
        {
          text: 'Cancel',
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }
  async takePhotoFromCamera() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    await this.camera.getPicture(options).then(
      (imageData: any) => {
        this.imageURI = imageData;
        this.displayImage = `data:image/png;base64,${imageData}`;
        this.setImage = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  async takePhotoFromGallery() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: 0,
    };
    await this.camera.getPicture(options).then((imageData: any) => {
      this.imageURI = imageData;
      this.displayImage = `data:image/png;base64,${imageData}`;
      this.setImage = true;
    });
  }
  addAddress() {
    this.addAddressManually = !this.addAddressManually;
    this.getAddress();
  }
  getAddress() {
    this.autoComplete.getInputElement().then((input: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log('eroor');
        } else {
          let locT = JSON.stringify(place.geometry.location.toJSON(), null, 2);
          locT = JSON.parse(locT);
          console.log(place.formatted_address);
          this.address = place.formatted_address;
          this.infoWindow.setPosition(locT);
          this.infoWindow.setContent(`<div>
          <p>${place.formatted_address}
          </p>
        </div>`);
          this.infoWindow.open(this.map);
          this.map.setCenter(locT);
        }
      });
    });
  }
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/help');
  }
  sendReport() {
    if (!this.address) {
      this.error.status = true;
      this.error.message = 'Address is required.';
      setTimeout(() => {
        this.error.status = false;
        this.error.message = '';
      }, 3000);
      return;
    }
    if (!this.contactNumber) {
      this.error.status = true;
      this.error.message = 'Contact number is required.';
      setTimeout(() => {
        this.error.status = false;
        this.error.message = '';
      }, 3000);
      return;
    }
    if (!this.imageURI) {
      this.error.status = true;
      this.error.message = 'Please select an image.';
      setTimeout(() => {
        this.error.status = false;
        this.error.message = '';
      }, 3000);
      return;
    }
    this.isLoading = true;
    this.rest
      .sendRequest('make_reports', {
        requestType: 'fireService',
        user: this.user.user_id,
        contact: this.contactNumber,
        address: this.address,
        image: this.displayImage,
        latitude: this.latitude.toString(),
        longitude: this.longitude.toString(),
      })
      .subscribe(
        async (res) => {
          this.addAddressManually = false;
          this.isLoading = false;
          this.showMap();
          this.displayImage = '/assets/icon/selectImage.svg';
          this.contactNumber = '';
          this.setImage = false;
          const alert = await this.alertController.create({
            cssClass: 'registeredAlert',
            message: 'Report added successfully.',
            buttons: [
              {
                text: 'Ok',
                handler: () => {},
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
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
}
