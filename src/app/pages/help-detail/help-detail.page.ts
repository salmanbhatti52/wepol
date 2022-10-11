/* eslint-disable @typescript-eslint/quotes */
import { NavController, AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { RestService } from '../../service/rest.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-detail',
  templateUrl: './help-detail.page.html',
  styleUrls: ['./help-detail.page.scss'],
})
export class HelpDetailPage implements OnInit {
  emergencyNumber = '';
  constructor(
    private navCtrl: NavController,
    private rest: RestService,
    private callNumber: CallNumber,
    public alertController: AlertController
  ) {}
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/help');
  }
  async showAlert() {
    const alert = await this.alertController.create({
      cssClass: 'policeServiceAlert',
      backdropDismiss: false,
      message:
        "Are you sure for emergency call? If you're raising false Alarm you will be fined.",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn_no',
        },
        {
          text: 'Yes',
          cssClass: 'btn_yes',
          handler: () => {
            this.callEmergencyNumber();
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
  }
  callEmergencyNumber() {
    this.callNumber
      .callNumber(this.emergencyNumber, true)
      .then((numRes) => console.log('Launched dialer!', numRes))
      .catch((err) => console.log('Error launching dialer', err));
  }
  getEmergencyNumber() {
    this.rest
      .sendRequest('get_serivce_numbers', {
        requestType: 'emergency',
      })
      .subscribe(
        (data: any) => {
          this.emergencyNumber = data.data.contact;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  ngOnInit() {
    this.getEmergencyNumber();
  }
}
