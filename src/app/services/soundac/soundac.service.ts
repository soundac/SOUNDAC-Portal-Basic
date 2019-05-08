// Angular & Rxjs
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

// Services
import { AlertService } from '../alerts/alert.service';
import { AuthService } from '../authentication/auth.service';

// Api
import * as soundac from 'museblockchain-js';
import { SoundacAccountHistory } from '../../models/soundac-account-history';
import { SoundacWitness } from '../../models/soundac-witness';
import { SoundacKeys } from '../../models/soundac-keys';

@Injectable()
export class SoundacService {

  constructor(
    private alertService: AlertService,
    private auth: AuthService
  ) { }

  setWebSocket() {
    soundac.config.set('websocket', 'wss://node.soundac.io');
    // soundac.config.set('websocket', 'wss://testnet.soundac.io');
  }

  getAccount(userName): Promise<any> {
    this.setWebSocket();
    return soundac.api.getAccounts([userName]).catch((err) => {
      this.alertService.showErrorMessage('getAccount(): ' + err);
    });
  }

  getAccountContent(username): Promise<any> {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.api.getContentByUploader(username, function (err, success) {
        if (err) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('getAccountContent(): ' + err);
    });
  }

  streamAccountInfo$(userName): Observable<any> {
    this.setWebSocket();
    return new Observable((observer: Observer<any>) => {
      soundac.api.streamOperationsAsync((err, result) => {
        soundac.api.getAccounts([userName]).then((results => {
          observer.next(results);
        }), error => {
          this.alertService.showErrorMessage('streamAccountInfo$(): ' + error);
        });
      });
    });
  }

  getAccountHistory(userName): Promise<void | SoundacAccountHistory[]> {
    this.setWebSocket();

    return new Promise<SoundacAccountHistory[]>(function (resolve, reject) {
      soundac.api.getAccountHistory(userName, 9999, 24, function (error, result) {

        if (error) {
          reject(error);
        }
        if (!error) {
          const SoundacAccountHistories: SoundacAccountHistory[] = [];
          result.forEach(soundacHistory => {
            const accountHistory: SoundacAccountHistory = new SoundacAccountHistory();
            accountHistory.mapHistory(soundacHistory[1]);
            SoundacAccountHistories.push(accountHistory);
          });
          resolve(SoundacAccountHistories.reverse());
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('getAccountHistory(): ' + err);
    });
  }

  getWitnesses() {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.api.getWitnessesByVote('', 100, function (err, success) {
        if (err) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('getWitnesses(): ' + err);
    });
  }

  transferSoundac(userName, password, transferTo, amount, memo) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.transferFunds(userName, password, transferTo, amount, memo, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('transferFunds(): ' + err);
    });
  }

  transferSoundactoVest(userName, password, amount) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.transferFundsToVestings(userName, password, null, amount, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('transferSoundactoVest(): ' + err);
    });
  }

  withdrawVesting(userName, password, amount) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.withdrawVesting(userName, password, amount, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('withdrawVesting(): ' + err);
    });
  }

  voteWitness(userName, password, witnessOwner: string, vote: boolean) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.witnessVote(userName, password, witnessOwner, vote, (code, message) => {
        if (code === 1) {
          resolve(true);
        } else {
          reject(message);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('voteWitness(): ' + err);
    });
  }

  claimBalance(userName, wif) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      soundac.claimBalance(userName, wif, (code, message) => {
        if (code === 1) {
          resolve(true);
        } else {
          reject(message);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('Sorry, Unable to process. Please check your WIF or try again later.');
    });
  }

  userExist(username): Promise<any> {
    return this.getAccount(username).then(
      user => {
        if (user.length !== 0) {
          return true;
        } else {
          return false;
        }
      }
    );
  }

  postContent(password, username, content) {
    this.setWebSocket();
    const me = this;
    return new Promise(function (resolve, reject) {
      me.auth.getPrivateKeys(username, password).then((keys: SoundacKeys) => {

        soundac.broadcast.content(
          keys.active,
          username,
          content.url,
          // content.album_meta,

          {
            part_of_album: content.album_meta.partOfAlbum,
            album_title: content.album_meta.albumTitle,
            album_artist: content.album_meta.albumArtists,
            genre_1: content.album_meta.albumGenre1,
            genre_2: content.album_meta.albumGenre2,
            country_of_origin: content.album_meta.countryOrigin,
            explicit_: content.album_meta.explicit,
            p_line: content.album_meta.albumPLine,
            c_line: content.album_meta.albumCLine,
            upc_or_ean: content.album_meta.upcEan,
            release_date: content.album_meta.releaseDate,
            release_year: content.album_meta.releaseYear,
            sales_start_date: content.album_meta.salesStartDate,
            album_producer: content.album_meta.albumProducer,
            album_type: content.album_meta.albumType,
            master_label_name: content.album_meta.masterLabelName,
            display_label_name: content.album_meta.displayLabelName,
          },
          {
            track_title: content.track_meta.trackTitle,
            ISRC: content.track_meta.isrc,
            track_artists: content.track_meta.trackArtists,
            featured_artist: content.track_meta.featuredArtist,
            featured_artist_ISNI: content.track_meta.featuredArtistIsni,
            track_producer: content.track_meta.trackProducer,
            genre_1: content.track_meta.trackGenre1,
            genre_2: content.track_meta.trackGenre2,
            p_line: content.track_meta.trackPLine,
            track_no: content.track_meta.trackNo,
            track_volume: content.track_meta.trackVolumeNo,
            copyright: content.track_meta.copyright,
            track_duration: content.track_meta.trackDuration,
            samples: content.track_meta.hasSample,
          },
          {
            composition_title: content.comp_meta.compTitle,
            alternate_composition_title: content.comp_meta.compTitleAlt,
            ISWC: content.comp_meta.compTitleIswc,
            third_party_publishers: content.comp_meta.isThirdPartyPublishers,
            publishers: content.comp_meta.publishers,
            writers: content.comp_meta.writers,
            PRO: content.comp_meta.performingRightsOrg,
          },

          content.distributions,
          content.management,
          content.management_threshold,
          content.distributionsComp,
          content.managementComp,
          content.management_threshold_comp,
          content.playing_reward,
          content.publishers_share,

          function (err, success) {
            if (err) {
              reject(err);
            } else {
              resolve(success);
            }
          });
      }).catch((err) => {
        this.alertService.showErrorMessage('postContent(): ' + err);
      });
    });
  }


  // updateAccountKeys(userName, password, newPassword, ownerPubkey, activePubkey, basicPubkey, memoPubkey): Promise<void | boolean> {
  //   const alert = this.alert;
  //   this.setSoundacSocket();
  //   return new Promise<boolean>(function (resolve, reject) {
  //     soundac.updateAccountKeys(userName, password, ownerPubkey, activePubkey, basicPubkey, memoPubkey, (code, message) => {
  //       if (code === 0) {
  //         CryptoService.encrypt(newPassword);
  //         alert.showSuccessMessage('Password Changed!', 'Your password has been successfully changed.'); // TODO: Set messages in a resource file
  //         resolve(true);
  //       } else {
  //         reject(message);
  //       }
  //     });
  //   }).catch((err) => {
  //     this.alert.showErrorMessage('updateAccountKeys(): ' + err);
  //   });
  // }

}
