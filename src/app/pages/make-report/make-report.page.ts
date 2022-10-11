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
  selector: 'app-make-report',
  templateUrl: './make-report.page.html',
  styleUrls: ['./make-report.page.scss'],
})
export class MakeReportPage implements OnInit {
  @ViewChild('autocomplete', { static: false }) autoComplete: IonSearchbar;
  @ViewChild('autocompleteTraffic', { static: false })
  autoCompleteTraffic: IonSearchbar;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  @ViewChild('map2', { read: ElementRef, static: false }) mapRef2: ElementRef;
  map: any;
  infoWindow: any;
  imageURI: any;
  image = '';
  formData: any;
  setImage = false;
  displayImage = '/assets/icon/selectImage.svg';
  isLoading = false;
  displayOption = false;
  makeReport = false;
  form1 = false;
  form2 = false;
  mylocMarker: any;
  address: any;
  latitude: number;
  longitude: number;
  markers: any = [];
  addAddressManually = false;
  countryName: any;
  defaultImage = '';
  name = '';
  note = '';
  category = '';
  user: any;
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
    this.showMap2();
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
  getAddress2() {
    this.autoCompleteTraffic
      .getInputElement()
      .then((input: HTMLInputElement) => {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode'],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            console.log('eroor');
          } else {
            let locT = JSON.stringify(
              place.geometry.location.toJSON(),
              null,
              2
            );
            locT = JSON.parse(locT);
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
            this.countryName = result[0].countryName;
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
              this.countryName = result[0].countryName;
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
  showMap2() {
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
        this.map = new google.maps.Map(this.mapRef2.nativeElement, options);
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
            this.countryName = result[0].countryName;
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
              this.countryName = result[0].countryName;
              this.address = `${result[0].thoroughfare},${result[0].subLocality},${result[0].locality},${result[0].administrativeArea},${result[0].countryName}`;
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
  ngOnInit() {
    this.map = null;
    this.infoWindow = null;
    this.displayOption = false;
    this.makeReport = false;
    this.form2 = false;
    this.addAddressManually = false;
    this.defaultImage = '';
    this.name = '';
    this.category = '';
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/main');
  }
  toggleOption() {
    this.displayOption = !this.displayOption;
  }
  addAddress() {
    this.addAddressManually = !this.addAddressManually;
    this.getAddress();
    this.getAddress2();
  }
  selectOption(el) {
    this.category = el.value;
    this.makeReport = false;
    this.form1 = false;
    this.form2 = false;
    this.displayOption = false;
  }
  showForm() {
    if (this.category === 'Kidnapping') {
      this.addAddressManually = false;
      this.showMap();
      this.form1 = !this.form1;
      this.makeReport = !this.makeReport;
    } else if (this.category === 'Traffic Accident') {
      this.addAddressManually = false;
      this.showMap2();
      this.makeReport = !this.makeReport;
      this.form2 = !this.form2;
    } else {
      this.makeReport = false;
      this.form1 = false;
    }
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
    if (!this.note) {
      this.error.status = true;
      this.error.message = 'Note is required.';
      setTimeout(() => {
        this.error.status = false;
        this.error.message = '';
      }, 3000);
      return;
    }
    if (this.category === 'Traffic Accident') {
      this.isLoading = true;
      this.rest
        .sendRequest('make_reports', {
          requestType: 'add',
          category: this.category,
          user: this.user.user_id,
          note: this.note,
          address: this.address,
          countryName: this.countryName,
          latitude: this.latitude.toString(),
          longitude: this.longitude.toString(),
        })
        .subscribe(
          async (res) => {
            this.addAddressManually = false;
            this.isLoading = false;
            const alert = await this.alertController.create({
              cssClass: 'registeredAlert',
              message: 'Report added successfully.',
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.address = '';
                    this.showMap2();
                    this.note = '';
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
    } else {
      if (!this.name) {
        this.error.status = true;
        this.error.message = 'Name is required.';
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
          requestType: 'add',
          category: this.category,
          user: this.user.user_id,
          name: this.name,
          note: this.note,
          address: this.address,
          image: this.displayImage,
          countryName: this.countryName,
          latitude: this.latitude.toString(),
          longitude: this.longitude.toString(),
        })
        .subscribe(
          async (res) => {
            this.isLoading = false;
            this.addAddressManually = false;
            const alert = await this.alertController.create({
              cssClass: 'registeredAlert',
              message: 'Report added successfully.',
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.address = '';
                    this.showMap();
                    this.name = '';
                    this.note = '';
                    this.setImage = false;
                    this.displayImage = '/assets/icon/selectImage.svg';
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
  }
}
