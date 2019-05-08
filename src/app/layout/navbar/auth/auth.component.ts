import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-navbar-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class NavbarAuthComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {

  }

}
