import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  headers = new HttpHeaders();
  baseURL = 'https://dev.eigix.com/wepol/webservices';
  authState = new BehaviorSubject(false);
  constructor(private http: HttpClient, private platform: Platform) {
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append(
      'Access-Control-Allow-Methods',
      'POST, GET, DELETE, PUT'
    );
    this.platform.ready().then(() => {
      this.isLoggedIn();
    });
  }

  sendRequest(action, data) {
    return this.http.post(`${this.baseURL}/${action}/`, JSON.stringify(data), {
      headers: this.headers,
    });
  }
  makeReport(action, data) {
    return this.http.post(`${this.baseURL}/${action}/`, data, {
      headers: this.headers,
    });
  }
  googleUserData(token) {
    return this.http.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
  }
  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.authState.next(true);
    } else {
      this.authState.next(false);
      localStorage.removeItem('user');
    }
  }
  isAuthenticated() {
    return this.authState.value;
  }
}
