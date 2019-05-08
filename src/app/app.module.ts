// Core
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { environment } from '../environments/environment';

// Modules
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';
import * as firebase from 'firebase';

// Services
import { AlertService } from './services/alerts/alert.service';
import { AuthService } from './services/authentication/auth.service';
import { SoundacService } from './services/soundac/soundac.service';
import { UIService } from './services/ui/ui.service';
import { UserService } from './services/users/user.service';


// Layout
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NavbarAuthComponent } from './layout/navbar/auth/auth.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { ErrorDialogComponent } from './layout/dialogs/error/error.dialog.component';
import { LoadingDialogComponent } from './layout/dialogs/loading/loading.dialog.component';
import { AlertDialogComponent } from './layout/dialogs/alert/alert.dialog.component';

// Components
import { HomeComponent } from './content/defaults/home/home.component';
import { PageNotFoundComponent } from './content/defaults/page-not-found/page-not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './content/defaults/login/login.component';
import { RegisterComponent } from './content/defaults/register/register.component';
import { TacComponent } from './content/defaults/register/terms-conditions/tac.component';
import { WalletComponent } from './content/users/wallet/wallet.component';
import { RightsManagementComponent } from './content/rights-management/rights-management.component';
import { ContentComponent } from './content/rights-management/content/content.component';
import { ModalTransferComponent } from './content/users/wallet/modal/modal-transfer.component';
import { ModalDialogVestComponent } from './content/users/wallet/modal/modal-vest.component';
import { ModalWithdrawComponent } from './content/users/wallet/modal/modal-withdraw.component';
import { GenreComponent } from './content/rights-management/genre/genre.component';
import { CountriesComponent } from './content/rights-management/countries/countries.component';

import { ProsComponent } from './content/rights-management/pros/pros.component';
import { SamplesComponent } from './content/rights-management/samples/samples.component';
import { WriterRolesComponent } from './content/rights-management/writer-roles/writer-roles.component';
import { ProductTypeComponent } from './content/rights-management/product-type/product-type.component';

import { ModalArtistComponent } from './content/rights-management/modal/artist/modal-artist.component';
import { ModalReviewComponent } from './content/rights-management/modal/review/modal-review.component';
import { ModalPublishersComponent } from './content/rights-management/modal/publishers/modal-publishers.component';
import { ModalWritersComponent } from './content/rights-management/modal/writers/modal-writers.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'content', component: RightsManagementComponent },
      { path: 'content-post', component: ContentComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  entryComponents: [
    ErrorDialogComponent,
    LoadingDialogComponent,
    AlertDialogComponent,
    ModalTransferComponent,
    ModalDialogVestComponent,
    ModalWithdrawComponent,
    ModalReviewComponent,
    ModalArtistComponent,
    ModalPublishersComponent,
    ModalWritersComponent
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
    ErrorDialogComponent,
    AlertDialogComponent,
    LayoutComponent,
    LoadingDialogComponent,
    ModalTransferComponent,
    ModalDialogVestComponent,
    ModalWithdrawComponent,
    NavbarAuthComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TacComponent,
    PageNotFoundComponent,
    WalletComponent,
    RightsManagementComponent,
    ContentComponent,
    GenreComponent,
    CountriesComponent,
    ModalReviewComponent,
    ModalArtistComponent,
    ModalPublishersComponent,
    ModalWritersComponent,
    ProductTypeComponent,
    WriterRolesComponent,
    ProsComponent,
    SamplesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AlertService,
    AuthService,
    SoundacService,
    UIService,
    UserService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
