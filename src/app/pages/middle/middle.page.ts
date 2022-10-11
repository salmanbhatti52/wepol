/* eslint-disable @typescript-eslint/naming-convention */
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.page.html',
  styleUrls: ['./middle.page.scss'],
})
export class MiddlePage implements OnInit {
  constructor(private navCtrl: NavController) {}
  login() {
    this.navCtrl.navigateForward('/login');
  }
  signup() {
    this.navCtrl.navigateForward('/signup');
  }
  anonymous() {
    localStorage.setItem('user', JSON.stringify({ user_id: 'anonymous' }));
    this.navCtrl.navigateRoot('/main');
  }

  ngOnInit() {}
}
