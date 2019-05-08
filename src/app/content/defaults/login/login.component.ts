import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { fadeInAnimation } from '../../../modules/shared/utilities/route.animation';
import { AuthService } from '../../../services/authentication/auth.service';
import { UIService } from '../../../services/ui/ui.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInAnimation]
})

export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public ui: UIService
  ) {

    // Build Form
    this.form = fb.group({
      userName: fb.control('', Validators.required),
      password: fb.control('', Validators.required)
    });

  }

  form: FormGroup;

  ngOnInit() {
    this.ui.hideLoading(); // Quick Fix
  }

  login() {
    this.auth.login(this.form.get('userName').value, this.form.get('password').value);
  }

}
