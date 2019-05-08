// Core
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, PageEvent, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';

// Services
import { SoundacService } from '../../services/soundac/soundac.service';
import { AuthService } from '../../services/authentication/auth.service';
import { UIService } from '../../services/ui/ui.service';

// Models
import { SoundacContent } from '../../models/soundac-content';
import { Subscription } from '../../../../node_modules/rxjs/Subscription';

@Component({
  selector: 'content-rights-management',
  templateUrl: './rights-management.component.html',
  styleUrls: ['./rights-management.component.scss']
})
export class RightsManagementComponent implements OnInit, OnDestroy {

  constructor(
    private soundacService: SoundacService,
    private auth: AuthService,
    private ui: UIService,
    private router: Router
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorContent') paginatorContent: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscription: Subscription;
  username: any;
  ContentListArray: SoundacContent[] = [];
  dataSourceContent = new MatTableDataSource<SoundacContent>(this.ContentListArray);
  displayedColumnsContent = ['title', 'url', 'timesplayed', 'uploaded'];

  ngOnInit() {

    this.ui.showLoading();
    if (this.auth.user) {
      this.username = this.auth.user.username;
      this.loadcontents();
    }
  }

  loadcontents() {
    this.soundacService.getAccountContent(this.username).then(((result: any[]) => {
      result.forEach(res => {
        const content: SoundacContent = new SoundacContent();
        content.mapContent(res);
        this.dataSourceContent.data.push(content);
      });
      this.dataSourceContent.paginator = this.paginatorContent;
      this.dataSourceContent.sort = this.sort;
      this.ui.hideLoading();
    }));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceContent.filter = filterValue;
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
  test(param) {
    // console.log(param);
  }
}
