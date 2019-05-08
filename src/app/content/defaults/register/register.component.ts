// Core
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

// Utilities
import { fadeInAnimation } from '../../../modules/shared/utilities/route.animation';
import { AlertBtnText } from '../../../modules/shared/utilities/enums';

// Services
import { AlertService } from '../../../services/alerts/alert.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { UIService } from '../../../services/ui/ui.service';

// Components
import { LoadingDialogComponent } from '../../../layout/dialogs/loading/loading.dialog.component';
import { TacComponent } from './terms-conditions/tac.component';

// Models
import { User } from '../../../services/users/models/user';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],

  // host: {
  //   '[@fadeInAnimation]': 'true'
  // },

  animations: [fadeInAnimation]
})
export class RegisterComponent {

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public ui: UIService
  ) {

    // Build Form
    this.form = fb.group({
      userName: fb.control('', Validators.required),
      password: fb.control('', Validators.required),
      passwordConfirm: fb.control('', Validators.required),
      terms: fb.control(false, Validators.required),
    });

  }

  form: FormGroup;

  termsAndCond() {
    this.dialog.open(TacComponent, {
      disableClose: true,
      data: {
        title: 'Terms and Conditions',
        message: '\<p>\<b>The standard Lorem Ipsum passage, used since the 1500s</b></p>\n',
        btnEnd: AlertBtnText.Close
      }
    });
  }

  passwordMatch() {
    if (this.form.get('password').value === this.form.get('passwordConfirm').value) {
      return true;
    }
    this.form.get('passwordConfirm').setErrors({ MatchPassword: true });
    return false;
  }

  register() {

    const userName: string = this.form.get('userName').value;
    const password: string = this.form.get('password').value;

    // Register
    this.auth.register(userName.toLowerCase(), password);

  }

}
