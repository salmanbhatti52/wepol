/* eslint-disable @typescript-eslint/quotes */
import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-police-service',
  templateUrl: './get-police-service.page.html',
  styleUrls: ['./get-police-service.page.scss'],
})
export class GetPoliceServicePage implements OnInit {
  constructor(
    private navCtrl: NavController,
    public alertController: AlertController
  ) {}

  ngOnInit() {}
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/main');
  }
  async showAlert() {
    const alert = await this.alertController.create({
      cssClass: 'policeServiceAlert',
      backdropDismiss: false,
      message:
        'Are you sure about a meeting? If you raise a false alarm/information, you will be fined.',
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
            this.navCtrl.navigateRoot('/main');
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
  }
}
