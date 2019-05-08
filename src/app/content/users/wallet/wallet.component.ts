// Core
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, PageEvent, MatTableDataSource, MatPaginator } from '@angular/material';

// Services
import { AlertService } from '../../../services/alerts/alert.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { SoundacService } from '../../../services/soundac/soundac.service';
import { UIService } from '../../../services/ui/ui.service';

// Modals
import { ModalTransferComponent } from './modal/modal-transfer.component';
import { ModalDialogVestComponent } from './modal/modal-vest.component';
import { ModalWithdrawComponent } from './modal/modal-withdraw.component';

// Models
import { SoundacAccountHistory } from '../../../models/soundac-account-history';
import { SoundacAccount } from '../../../models/soundac-account';
import { SoundacKeys } from '../../../models/soundac-keys';
import { SoundacWitness } from '../../../models/soundac-witness';

@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor(
    private alert: AlertService,
    private auth: AuthService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private soundacService: SoundacService,
    private router: Router,
    private ui: UIService
  ) {

    // Password Form
    this.passwordForm = fb.group({
      password: fb.control('', Validators.required),
      newPassword: fb.control('', Validators.required),
      understand: fb.control(null, Validators.required),
      saved: fb.control(null, Validators.required)
    });

  }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorWitness') paginatorWitness: MatPaginator;

  userName: any;
  passwordForm: FormGroup;
  account: SoundacAccount = new SoundacAccount();
  defaultDate: Date = new Date('1969-12-31T23:59:59');
  WitnessListArray: SoundacWitness[] = [];
  generatedPassword: string;
  CurrentPass: string;
  marketCap: any;

  showPrivateBasic: boolean = false;
  showPrivateActive: boolean = false;
  showPrivateOwner: boolean = false;
  showPrivateMemo: boolean = false;

  dialogRefTrans: MatDialogRef<ModalTransferComponent>;
  dialogRefVest: MatDialogRef<ModalDialogVestComponent>;
  dialogRefWithd: MatDialogRef<ModalWithdrawComponent>;

  // Account History
  dataSource = new MatTableDataSource<SoundacAccountHistory>(this.account.history);
  displayedColumnsHistory = ['date', 'transaction'];

  // Witness
  dataSourceWitness = new MatTableDataSource<SoundacWitness>(this.WitnessListArray);
  displayedColumnsWitness = ['owner', 'block', 'url'];
  inputWitness: string;

  // Claim of Stake
  inputWIF: string;

  ngOnInit() {
    this.ui.showLoading();

    // Get userName
    this.userName = this.auth.user.username;

    // Get Account Infos
    this.getAccount();
    this.getAccountHistory();
    this.getWitnesses();

  }

  getAccount() {

    // Get Initial Account Info
    this.soundacService.getAccount(this.userName).then(response => {
      this.account.mapAccount(response[0]);
      this.ui.hideLoading();
    });

    // Stream Account info for changes
    this.soundacService.streamAccountInfo$(this.userName).subscribe(response => {
      this.account.mapAccount(response[0]);
      this.getAccountHistory();
      this.ui.hideLoading();
    });

  }

  getAccountHistory() {
    this.soundacService.getAccountHistory(this.userName).then((response: SoundacAccountHistory[]) => {
      this.account.history = response;
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
    });
  }

  getWitnesses() {
    this.soundacService.getWitnesses().then(((result: any[]) => {
      result.forEach(res => {
        const witness: SoundacWitness = new SoundacWitness();
        witness.mapWitness(res);
        // this.WitnessListArray.push(witness);
        this.dataSourceWitness.data.push(witness);
      });
      this.dataSourceWitness.paginator = this.paginatorWitness;
    }));
  }

  transferSoundac() {

    const authPassword = this.auth.user.getPassword();

    this.dialogRefTrans = this.dialog.open(ModalTransferComponent);
    this.dialogRefTrans.afterClosed().subscribe(data => {
      this.ui.showLoading();
      this.soundacService.transferSoundac(this.userName, authPassword, data.transferto, data.amount, data.memo);
    });
  }

  vestSoundac() {
    this.dialogRefVest = this.dialog.open(ModalDialogVestComponent);
    const authPassword = this.auth.user.getPassword();
    this.dialogRefVest.afterClosed().subscribe(data => {
      this.ui.showLoading();
      this.soundacService.transferSoundactoVest(this.userName, authPassword, data);
    });
  }

  withdrawVest() {
    this.dialogRefWithd = this.dialog.open(ModalWithdrawComponent);
    const authPassword = this.auth.user.getPassword();
    this.dialogRefWithd.afterClosed().subscribe(data => {
      this.ui.showLoading();
      this.soundacService.withdrawVesting(this.userName, authPassword, data);
    });
  }

  cancelWithdraw() {
    this.ui.showLoading();
    const authPassword = this.auth.user.getPassword();
    this.soundacService.withdrawVesting(this.userName, authPassword, 0);
  }

  generatePassword() {

    this.generatedPassword = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$%^&*()_+|~-={}[]:;?./';

    const tmpPwd: string[] = [];
    for (let i = 0; i < 52; i++) {
      tmpPwd.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }

    this.generatedPassword = tmpPwd.join('');

  }

  generatedPasswordMatch() {
    if (this.passwordForm.get('newPassword').value === this.generatedPassword) {
      return true;
    }
    this.passwordForm.get('newPassword').setErrors({ generatedPasswordMatch: true });
    return false;
  }

  updatePassword() {

    this.ui.showLoading();

    const truePassword: string = this.auth.user.getPassword();
    const password: string = this.passwordForm.get('password').value;
    const newPassword: string = this.passwordForm.get('newPassword').value;

    let errors: boolean = false;

    if (password !== truePassword) {
      this.alert.showErrorMessage('auth/wrong-password');
      this.passwordForm.get('password').reset();
      errors = true;
      this.ui.hideLoading();
    }

    if (!errors) {

      // Get a set of new Keys based on the new generated password
      // this.auth.getPrivateKeys(this.userName, newPassword).then((keys: SoundacKeys) => {

      //   // Update the actual keys with the new password
      //   this.soundacService.updateAccountKeys(this.userName, password, newPassword, keys.ownerPubkey, keys.activePubkey, keys.basicPubkey, keys.memoPubkey)
      //     .then((response: boolean) => {
      //       this.ui.hideLoading();

      //       if (response) {
      //         this.generatedPassword = null;
      //         this.passwordForm.reset();              
      //       }

      //     });

      // });

    }

  }

  loadPrivateKeys() {
    const password = this.auth.user.getPassword();
    this.auth.getPrivateKeys(this.userName, password).then((keys: SoundacKeys) => {
      this.account.keys.basic = keys.basic;
      this.account.keys.active = keys.active;
      this.account.keys.owner = keys.owner;
      this.account.keys.memo = keys.memo;
    });
  }

  togglePrivatekeys(key: string) {

    if (key === 'basic') {
      if (!this.showPrivateBasic) {
        if (this.account.keys.basic === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateBasic = true;
      } else {
        this.showPrivateBasic = false;
      }
    }

    if (key === 'active') {
      if (!this.showPrivateActive) {
        if (this.account.keys.active === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateActive = true;
      } else {
        this.showPrivateActive = false;
      }
    }

    if (key === 'owner') {
      if (!this.showPrivateOwner) {
        if (this.account.keys.owner === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateOwner = true;
      } else {
        this.showPrivateOwner = false;
      }
    }

    if (key === 'memo') {
      if (!this.showPrivateMemo) {
        if (this.account.keys.memo === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateMemo = true;
      } else {
        this.showPrivateMemo = false;
      }
    }

  }

  voteWitness(witnessOwner: string, vote: boolean) {
    console.log(vote);
    this.ui.showLoading();
    const password = this.auth.user.getPassword();
    this.soundacService.voteWitness(this.userName, password, witnessOwner, vote);
  }

  claimWIF() {
    this.ui.showLoading();
    this.soundacService.claimBalance(this.userName, this.inputWIF); // ToDo: Check SOUNDAC-js library to figure source of current error
  }

}
