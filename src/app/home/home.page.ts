/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  slideOpts = {
    loop: true,
    initialSlide: 0,
    speed: 400,
  };
  @ViewChild('slides', { static: true }) slides: IonSlides;
  constructor(private navCtrl: NavController) {}
  ionSlideDidChange(e) {
    this.slides.startAutoplay();
  }
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

  skip() {
    this.navCtrl.navigateRoot('/middle');
  }
  ngOnInit() {
    this.slides.startAutoplay();
  }
}
