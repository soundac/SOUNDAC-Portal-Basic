import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alerts/alert.service';
import { environment } from '../../../environments/environment';
import { SoundacKeys } from '../../models/soundac-keys';
import { AuthUser } from '../../models/authUser';
import * as soundac from 'museblockchain-js';

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private alert: AlertService
  ) {

    // Persistent Loggin
    const username: string = localStorage.getItem('userName');
    const password: string = localStorage.getItem('password');
    const key: string = localStorage.getItem('key');

    if (username && password && key) {
      this.user = new AuthUser();
      this.user.username = username;
      this.user.password = password;
      this.user.key = key;
      this.user.logged = true;
    }
  }

  user: AuthUser = new AuthUser();

  setSocket() {
    soundac.config.set('websocket', 'wss://node.soundac.io');
    // soundac.config.set('websocket', 'wss://testnet.soundac.io');
  }

  getPrivateKeys(userName, password): Promise<void | SoundacKeys> {

    // Set Socket
    this.setSocket();

    // Get Keys
    return new Promise<SoundacKeys>(function (resolve, reject) {

      const keys = soundac.auth.getPrivateKeys(userName, password, ['owner', 'active', 'basic', 'memo']);

      if (!keys) {
        reject('Failed to load keys.');
      }

      resolve(keys);

    }).catch((err) => {
      this.alert.showErrorMessage('getPrivateKeys(): ' + err);
    });

  }

  register(userName, password) {

    // Set Socket
    this.setSocket();

    const me = this;

    // Register SOUNDAC Account
    return new Promise((resolve, reject) => {
      this.getPrivateKeys(userName, password).then((keys: SoundacKeys) => {

        soundac.broadcast.accountCreate(
          environment.blockchainFaucetConfig.private_wif,
          environment.blockchainFaucetConfig.account_creation_fee,
          environment.blockchainFaucetConfig.account,
          userName,
          {
            'weight_threshold': 1,
            'account_auths': [],
            'key_auths': [[keys.ownerPubkey, 1]]
          },
          {
            'weight_threshold': 1,
            'account_auths': [],
            'key_auths': [[keys.activePubkey, 1]]
          },
          {
            'weight_threshold': 0,
            'account_auths': [],
            'key_auths': [[keys.basicPubkey, 1]]
          }, keys.memoPubkey, {}, function (err, result) {
            if (err) {
              reject(err);
            } else {

              resolve(result);

              me.login(userName, password);

            }
          });
      });
    }).then(() => {
      soundac.broadcast.transferToVestingAsync(environment.blockchainFaucetConfig.private_wif, environment.blockchainFaucetConfig.account, userName, '0.01 2.28.0');
    }).catch((err) => {
      this.alert.showErrorMessage('registerSoundacAccount(): ' + err);
    });
  }

  login(userName, password) {

    // Set Socket
    this.setSocket();

    console.log('login: ', userName, password);
    const me = this;
    // Login
    return new Promise(function (resolve, reject) {

      soundac.login(userName.toLowerCase(), password, function (err, success) {

        if (err !== 1) {
          me.alert.showErrorMessage('authAccount(): ' + err);
          reject(err);
        } else {
          resolve(success);
          me.user.username = userName;
          me.user.encryptPassword(password);
          me.user.login();
          // Redirect
          me.router.navigateByUrl('/');
        }
      });
    });
  }

  logout() {

    localStorage.removeItem('userName');
    localStorage.removeItem('password');
    localStorage.removeItem('key');

    this.user = new AuthUser();

    this.router.navigateByUrl('/login');

  }

}
