import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs/rx';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoadingDialogComponent } from './dialogs/loading/loading.dialog.component';
import { UIService } from '../services/ui/ui.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private mediaMatcher: MediaMatcher,
    public ui: UIService
  ) { }

  @ViewChild('sidenav') sidenav;
  mediaQueryList;

  ngOnInit() {
    this.mediaQueryList = this.mediaMatcher.matchMedia('(max-width: 768px)');

    if (!this.auth || !this.auth.user.logged) {
      this.router.navigateByUrl('/login');
    }

  }

  sidenavToggle() {
    this.sidenav.toggle();
  }

}
