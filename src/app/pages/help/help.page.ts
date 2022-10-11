import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  showHelpCall = false;
  showHelpFire = false;
  showHelpFriend = false;
  constructor(private navCtrl: NavController) {}
  toggleShowHelp(e) {
    if (e === 'showHelpCall') {
      this.showHelpCall = !this.showHelpCall;
      this.showHelpFire = false;
      this.showHelpFriend = false;
    }
    if (e === 'showHelpFire') {
      this.showHelpCall = false;
      this.showHelpFire = !this.showHelpFire;
      this.showHelpFriend = false;
    }
    if (e === 'showHelpFriend') {
      this.showHelpCall = false;
      this.showHelpFire = false;
      this.showHelpFriend = !this.showHelpFriend;
    }
  }
  home() {
    this.navCtrl.navigateRoot('/main');
  }
  back() {
    this.navCtrl.navigateBack('/main');
  }
  gotoHelpDetail() {
    this.navCtrl.navigateForward('/help-detail');
  }
  gotoTrustedFriend() {
    this.navCtrl.navigateForward('/trusted-friend');
  }
  gotoFireService() {
    this.navCtrl.navigateForward('/fire-service');
  }
  ngOnInit() {}
}
