import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModalReviewComponent } from '../modal/review/modal-review.component';
import { ModalPublishersComponent } from '../modal/publishers/modal-publishers.component';
import { ModalArtistComponent } from '../modal/artist/modal-artist.component';
import { ModalWritersComponent } from '../modal/writers/modal-writers.component';
import { AuthService } from '../../../services/authentication/auth.service';
import { SoundacService } from '../../../services/soundac/soundac.service';
import { AlertService } from '../../../services/alerts/alert.service';
import { AlertBtnText } from '../../../modules/shared/utilities/alert-btn-text.enums';
import { ErrorCodes } from '../../../modules/shared/utilities/error-codes.enums';
import { Utils } from '../../../modules/shared/utilities/utils';
import { UIService } from '../../../services/ui/ui.service';
import { Subscription } from '../../../../../node_modules/rxjs/Subscription';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit, AfterViewInit {

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private soundacService: SoundacService,
    private alert: AlertService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private ui: UIService
  ) {
    this.currentDate();
    this.auth.user.getPassword();
  }

  subscription: Subscription;
  contentForm: FormGroup;
  formErrors: any;
  dialogRefPublishers: MatDialogRef<ModalPublishersComponent>;
  dialogRefArtist: MatDialogRef<ModalArtistComponent>;
  dialogRefWriters: MatDialogRef<ModalWritersComponent>;
  dialogRefReview: MatDialogRef<ModalReviewComponent>;
  username: string;
  maxDate: Date;
  maxYear: number;
  maxBp: number;
  maxPercentage: number;
  compRoyaltyRequired: boolean;
  data: any;


  max = 100;
  splitMax = 99;
  splitMin = 1;
  pubShareValue;
  playRewardMax;
  step = .5;
  thumbLabel = false;
  sliderDisabled = false;

  masterIncomeMax = 100;
  compIncomeMax = 100;

  masterWeightMax = 100;
  compWeightMax = 100;

  masterIncomeTotal = 0;
  masterWeightTotal = 0;
  compIncomeTotal = 0;
  compWeightTotal = 0;

  masterRoyaltySplit = [];
  compRoyaltySplit = [];

  // masterManagesContract = false;
  // compManagesContract = false;
  isOneOwner = false;
  // soleOwner = false;

  productType = [
    { value: 'Album (Live)' },
    { value: 'Album (Compilation)' },
    { value: 'Album (Studio)' },
    { value: 'EP' },
    { value: 'Music Video' },
    { value: 'Ringtone' },
    { value: 'Single' }
  ];

  explicit = [
    { value: 0, viewValue: 'Yes' },
    { value: 1, viewValue: 'No' },
    { value: 2, viewValue: 'Clean' } // has explicit that has been bleeped out
  ];

  pros = [
    { value: 'ACEMLA' },
    { value: 'ACUM' },
    { value: 'AEPI' },
    { value: 'AGADU' },
    { value: 'AKM' },
    { value: 'APDAYC' },
    { value: 'APRA' },
    { value: 'APRA' },
    { value: 'ARTISJUS' },
    { value: 'ASCAP' },
    { value: 'BMI' },
    { value: 'BUMA' },
    { value: 'CASH' },
    { value: 'COMPASS' },
    { value: 'COTT' },
    { value: 'EAU' },
    { value: 'ECAD' },
    { value: 'FILSCAP' },
    { value: 'GEA' },
    { value: 'GEMA' },
    { value: 'HDS' },
    { value: 'IMA' },
    { value: 'IPRS' },
    { value: 'JASRAC' },
    { value: 'KODA' },
    { value: 'KOMCA' },
    { value: 'KOSCAP' },
    { value: 'LATGA-A' },
    { value: 'MACP' },
    { value: 'MCT' },
    { value: 'MRCSN' },
    { value: 'MUST' },
    { value: 'OSA' },
    { value: 'PPCA' },
    { value: 'PRS, PPL' },
    { value: 'RAO' },
    { value: 'SABAM' },
    { value: 'SACEM' },
    { value: 'SACM' },
    { value: 'SACVEN' },
    { value: 'SADAIC' },
    { value: 'SAMRO' },
    { value: 'SAS' },
    { value: 'SAYCO/ACINPRO' },
    { value: 'SCD' },
    { value: 'SENAPI' },
    { value: 'SGAE' },
    { value: 'SIAE' },
    { value: 'SOKOJ' },
    { value: 'SOZA' },
    { value: 'SPAC' },
    { value: 'SPACEM' },
    { value: 'STIM' },
    { value: 'SUISA' },
    { value: 'TEOSTO' },
    { value: 'TONO' },
    { value: 'UACRR' },
    { value: 'UCMR' },
    { value: 'ZAIKS' }
  ];

  // Samples
  yes_no = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' }
  ];

  toolTips = {
    trackTitle: 'EACH TRACK TITLE IN AN ALBUM MUST BE UNIQUE, THE EXCEPTION IS DIFFERENT VERSIONS OF THE SAME TRACK, SUCH AS CLEAN/EXPLICIT.',
    url: 'EACH TRACK MUST INCLUDE A UNIQUE INTERPLANETARY FILE SYSTEM (IPFS) URL TO THE TRACK FILE. (ipfs://)',
    sample: 'SPECIFY IF THE TRACK CONTAINS A SAMPLE.',
    trackArtist: 'CLICK TO ADD AT LEAST ONE MAIN ARTIST.',
    trackArtistName: 'ARTIST FULL NAME AND PROPER SPELLING ARE REQUIRED IN THE MOST WIDELY KNOWN FORM.',
    trackArtistAliases: 'A NAME THAT A PERSON OR GROUP ASSUMES, WHICH CAN DIFFER FROM THEIR FIRST OR TRUE NAME. ',
    trackArtistIsni: 'THE ISO STANDARD IDENTIFIER FOR NAMES',
    featuredArtist: 'IF THE TRACK CONTAINS FEATURED ARTISTS NOTE: FOR NAMING GROUPS AS WELL AS INDIVIDUALS',
    featuredArtistIsni: 'THE ISO STANDARD IDENTIFIER FOR NAMES.',
    isrc: 'A UNIQUE AND PERMANENT IDENTIFIER FOR A SPECIFIC RECORDING, INDEPENDENT OF THE FORMAT OR THE RIGHTS HOLDERS.',
    country: 'RECORDING LOCATION.',
    explicit: 'AN EXPLICIT TRACK MUST BE TAGGED AS EXPLICIT. A CLEAN VERSIONS OF EXPLICIT TRACKS MUST BE TAGGED AS CLEAN. TRACKS SHOULD ONLY BE FLAGGED CLEAN IF THERE IS AN EXPLICIT VERSION OF THE TRACK.',
    genre: 'THE FIRST GENRE MUST BE THE BEST DESCRIPTION FOR THE CONTENT. A SECOND GENRE IS NOT ALWAYS REQUIRED, BUT IT SHOULD BE USED WHEN APPLICABLE.',
    trackPLine: 'THIS IS GENERALLY THE ENTITY ENTITLED TO ROYALTIES FOR THE TRACK.',
    trackNo: 'USED TO ORDER TRACKS WITHIN AN ALBUM.',
    trackVolumeNo: 'THE VOLUME NUMBER (DISC NUMBER) ON WHICH THE TRACK RESIDES.',
    trackDuration: 'THE DURATION OF THE CONTENT USING THE FOLLOWING FORMAT hhmmss. (E.G. TWO MINUTE AND 30 SECONDS WOULD BE 000230)',
    trackProducer: 'A PARTY RESPONSIBLE FOR AN ARTISTIC INPUT TO THE PRODUCTION OF A RESOURCE (E.G. A SOUNDRECORDING OR AUDIOVISUAL RECORDING).',
    releaseDate: 'THE ORIGINAL RELEASE DATE (YYYY/MM/DD) MUST BE THE EARLIEST DATE THAT THE ORIGINAL PRODUCT WAS FIRST RELEASED REGARDLESS OF THE RELEASING LABEL, OR FORMAT TYPE.',
    releaseYear: 'THE ORIGINAL RELEASE DATE YEAR (YYYY)',
    salesStartDate: 'THE SALES START DATE (YYYY/MM/DD) IS THE DATE WHEN CONTENT BECOMES AVAILABLE ON SOUNDAC.',
    upcEan: 'SET OF NUMBERS THAT IDENTIFY A PACKAGED COLLECTION OF MUSIC',
    albumTitle: 'ALBUM TITLE MUST MATCH THE ORIGINAL TITLE UPON ITS INITIAL RELEASE.',
    partOfAlbum: 'CHECK IF DOES THE TRACK BELONGS TO AN ALBUM.',
    albumArtist: 'A PRINCIPAL CONTRIBUTOR TO A PERFORMANCE OF THE TRACK. NOTE: FOR NAMING GROUPS AS WELL AS INDIVIDUALS.',
    albumProducer: 'A PARTY RESPONSIBLE FOR AN ARTISTIC INPUT TO THE PRODUCTION OF A RESOURCE (E.G. A SOUNDRECORDING OR AUDIOVISUAL RECORDING).',
    albumType: 'PLEASE SELECT FROM THE PROVIDED OPTIONS THE DESCRIPTION THAT BEST MATCHES THE TYPE OF ALBUM YOU ARE INPUTTING.',
    albumPLine: 'THE (P) LINE PROVIDES THE PARTY WHO HOLDS LEGAL RESPONSIBILITY FOR AN AUDIO RECORDING, OR A PHONOGRAPH.',
    albumCLine: 'THE (C) LINE PROVIDES INFORMATION REGARDING THE PARTY WHO HOLDS THE LEGAL COPYRIGHT FOR THE RECORDED WORK.',
    masterLabel: 'THIS IS THE PARTY WHO OWNS THE MASTER RIGHTS TO THE RECORDED WORK, AND HOLDS FINAL SAY IN THE AUTHORIZATION OF THE USE OR REPRODUCTION OF THOSE WORKS (WITH OR WITHOUT MONETARY GAIN).',
    displayLabel: 'A LABEL USED AS A TRADEMARK OR BRAND (AND NOT A COMPANY) IS A DISPLAY, OR IMPRINT LABEL.',
    isThirdPartyPublishers: 'IS THIS RECORDED WITH BEING PUBLISHED BY A THIRD PARTY WHO IS NOT THE MASTER LABEL RIGHTS OWNER?',
    pros: 'THE ORGANIZATION THAT PROVIDES INTERMEDIARY FUNCTIONS.',
    publisher: 'A PARTY THAT MAKES A RESOURCE AVAILABLE.',
    writer: ' THE CREATOR OF THE MUSICAL ELEMENTS OF A TRACK.',
    threshold: 'TOTAL WEIGHT FOR A CHANGE TO TAKE PLACE ON THE SMART CONTRACT.',
    oneOwner: 'CHECK HERE IF THE CONTENT IS OWNED AND MANAGED BY THE LOGGED IN USER TO AUTO COMPLETE THE MANAGEMENT AND SPLITS PORTION OF THIS FORM',
    compositionTitle: 'ENTER THE TITLE OF THE COMPOSITION BEING PERFORMED.',
    compositionTitleAlt: 'ENTER ANY ALTERNATE TITLES OF THE COMPOSITION BEING PERFORMED.',
    compositionTitleIswc: 'ENTER THE INTERNATIONAL STANDARD MUSICAL WORK CODE HERE.',
    management: 'THIS IS THE PARTY WHO HAS AUTHORITY TO APPROVE OR MAKE CHANGES TO THE CONTRACT.',
    // matTooltipShowDelay
    delay: '1000',
  };


  ngOnInit() {
    // this.subscription = this.auth.user$.subscribe(user => {
    //   if (user) {
    //     this.username = user.username;
    //   }
    // });

    this.contentForm = this.createContentForm();
    this.contentForm.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
    this.compRoyaltyRequired = true;
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   // this.ui.hideLoading();
    //   window.dispatchEvent(new Event('resize'));
    // }, 1000);
  }

  get trackArtists() {
    return this.contentForm.get('track_meta.trackArtists') as FormArray;
  }

  get albumArtists() {
    return this.contentForm.get('album_meta.albumArtists') as FormArray;
  }

  get writers() {
    return this.contentForm.get('comp_meta.writers') as FormArray;
  }

  get publishers() {
    return this.contentForm.get('comp_meta.publishers') as FormArray;
  }

  get distributions() {
    return this.contentForm.get('distributions') as FormArray;
  }

  get management() {
    return this.contentForm.get('management') as FormArray;
  }

  get distributionsComp() {
    return this.contentForm.get('distributionsComp') as FormArray;
  }

  get managementComp() {
    return this.contentForm.get('managementComp') as FormArray;
  }


  createContentForm() {
    return this.fb.group({
      uploader: this.auth.user.username,
      url: 'ipfs://' + Utils.generateGUID(),
      album_meta: this.fb.group({
        partOfAlbum: false,
        albumTitle: [''],
        albumArtists: this.fb.array([]),
        albumGenre1: [''],
        albumGenre2: [''],
        countryOrigin: [''],
        explicit: [''],
        albumPLine: [''],
        albumCLine: [''],
        // TODO: fix validation
        // upcEan: ['', [Validators.pattern('^8\d{11}$|^8\d{13}$')]],
        upcEan: [''],
        releaseDate: ['', Validators.required],
        releaseYear: [''],
        salesStartDate: ['', Validators.required],
        albumProducer: [''],
        albumType: [''],
        masterLabelName: ['', Validators.required],
        displayLabelName: [''],
      }),

      track_meta: this.fb.group({
        trackTitle: ['', Validators.required],
        isrc: [''],
        trackArtists: this.fb.array([]),
        featuredArtist: [''],
        featuredArtistIsni: [''],
        trackProducer: [''],
        trackGenre1: [''],
        trackGenre2: [''],
        trackPLine: [''],
        // TODO: fix validation
        // trackNo: ['', Validators.pattern('^[0-9][0-9]*([.][0-9]{2}|)$')],
        // trackVolumeNo: ['', [Validators.min(0), Validators.pattern('^[0-9][0-9]*([.][0-9]{2}|)$')]],
        // trackDuration: ['', [Validators.pattern('^[0-9][0-9]*([.][0-9]{2}|)$')]],
        // trackDuration: ['', Validators.pattern('^[0-9]*$'')],
        trackNo: [''],
        trackVolumeNo: [''],
        trackDuration: [''],
        hasSample: [''],
      }),

      comp_meta: this.fb.group({
        compTitle: [''],
        compTitleAlt: [''],
        compTitleIswc: [''],
        isThirdPartyPublishers: [true],
        publishers: this.fb.array([]),
        writers: this.fb.array([]),
        performingRightsOrg: [''],
      }),

      distributions: this.fb.array([]),

      tempDistributions: this.fb.group({
        payee: [''],
        bp: ['', [Validators.min(0), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]]
      }),

      management: this.fb.array([]),

      tempManagement: this.fb.group({
        voter: [''],
        percentage: ['', [Validators.min(0), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]]
      }),

      management_threshold: [100, [Validators.min(0), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],

      distributionsComp: this.fb.array([]),
      tempDistributionsComp: this.fb.group({
        payee: [''],
        bp: ['', [Validators.min(0), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]]
      }),

      managementComp: this.fb.array([]),

      tempManagementComp: this.fb.group({
        voter: [''],
        percentage: ['', [Validators.min(0), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]]
      }),

      management_threshold_comp: [100, [Validators.min(0), Validators.max(100)]],

      master_share: [50, [Validators.min(1), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]], // Only used for clarification in UI.
      // The master_share value doesnt need to be submitted to the chain,
      // the value is inferred from the total balance minus the
      // publishers_share

      publishers_share: [50, [Validators.min(0), Validators.max(100), Validators.pattern
        ('[0-9]+(\.[0-9][0-9]?)?')]], // On the chain, the remaining balance is inferred as the composition side shares

      playing_reward: [5, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],


      soleOwner: false,
      masterManagesContract: false,
      compManagesContract: false,


      // isOneOwner: false, // TODO: Move variable to inside form - here
    });

  }



  onFormValuesChanged() {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      this.formErrors[field] = {};
      const control = this.contentForm.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  oneOwner() {
    if (!this.isOneOwner) {
      this.sliderDisabled = true;
      this.removeFromList('masterRoyaltySplit', 0);
      this.contentForm.patchValue({ master_share: 100 });
      this.contentForm.patchValue({ playing_reward: 5 });
      this.contentForm.patchValue({ publishers_share: 0 });
      this.contentForm.get('tempDistributions').patchValue({ payee: this.auth.user.username });
      this.updateMasterManagesContract(true);
      this.contentForm.get('tempDistributions').patchValue({ bp: 100 });
      this.contentForm.get('tempManagement').patchValue({ percentage: 100 });
      this.addRoyaltySplit('masterRoyaltySplit');
      this.isOneOwner = true;
      this.onGenSplitChange();
    } else {
      this.isOneOwner = false;
      this.sliderDisabled = false;
      this.contentForm.get('tempDistributions').patchValue({ payee: '' });
      this.updateMasterManagesContract(false);
      this.contentForm.get('tempDistributions').patchValue({ bp: null });
      this.contentForm.get('tempManagement').patchValue({ voter: '' });
      this.contentForm.get('tempManagement').patchValue({ percentage: null });
      this.removeFromList('masterRoyaltySplit', 0);
    }
  }

  addPublisher() {
    this.dialogRefPublishers = this.dialog.open(ModalPublishersComponent, {
      disableClose: true,
      data: {
        btnStart: AlertBtnText.Cancel,
        btnEnd: AlertBtnText.Add
      }
    });
    this.dialogRefPublishers.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.publishers.push(
            this.fb.control({
              publisher: data.publisher,
              IPI_CAE: data.IPI_CAE,
              ISNI: data.ISNI
            }));
        }
      });
  }

  addWriter() {
    this.dialogRefWriters = this.dialog.open(ModalWritersComponent, {
      disableClose: true,
      data: {
        btnStart: AlertBtnText.Cancel,
        btnEnd: AlertBtnText.Add
      }
    });
    this.dialogRefWriters.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          if (data.ISNI === '') {
            data.ISNI = 0;
          }

          this.writers.push(

            this.fb.control({
              writer: data.writer,
              IPI_CAE: data.IPI_CAE,
              ISNI: data.ISNI,
              publisher: data.publisher,
              role: data.role
            }));
        }
      });
  }

  addArtist(headerTxt) {
    this.dialogRefArtist = this.dialog.open(ModalArtistComponent, {
      disableClose: true,
      data: {
        header: headerTxt,
        btnStart: AlertBtnText.Cancel,
        btnEnd: AlertBtnText.Add
      }
    });
    this.dialogRefArtist.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          switch (headerTxt) {
            case 'Track Artist':
              this.trackArtists.push(
                this.fb.control({
                  artist: data.artist,
                  isni: data.isni,
                  aliases: data.aliases
                }));
              break;
            case 'Album Artist':
              this.albumArtists.push(
                this.fb.control({
                  artist: data.artist,
                  isni: data.isni,
                  aliases: data.aliases
                }));
              break;
          }
        }
      });
  }

  addRoyaltySplit(listName) {
    switch (listName) {
      case 'masterRoyaltySplit':
        this.soundacService.userExist(this.contentForm.get('tempDistributions.payee').value).then(
          user => {
            if (this.isOneOwner === true) {
              user = true;
            }
            if (user === true) {
              let managementValue = '';

              if (this.contentForm.get('masterManagesContract').value === true) {
                this.contentForm.patchValue({ masterManagesContract: true });
                managementValue = 'Contract Manager';
              } else {
                this.contentForm.get('tempManagement').patchValue({ percentage: 0 });
              }

              this.masterRoyaltySplit.push({
                username: this.contentForm.get('tempDistributions.payee').value,
                income: this.contentForm.get('tempDistributions.bp').value,
                management: managementValue,
                weight: this.contentForm.get('tempManagement.percentage').value,
              });

              if (this.masterRoyaltySplit.length !== 0) {
                this.masterIncomeTotal = this.masterIncomeTotal + this.contentForm.get('tempDistributions.bp').value;
              }
              if (this.contentForm.get('tempManagement.percentage').value !== null || this.contentForm.get
                ('tempManagement.percentage').value !== undefined || this.contentForm.get('tempManagement.percentage').value !== 0) {
                this.masterWeightTotal = this.masterWeightTotal + this.contentForm.get('tempManagement.percentage').value;
              }

              const normDistBp = this.normalizeSplitVal(this.contentForm.get('tempDistributions.bp').value);

              this.distributions.push(
                this.fb.control({
                  payee: this.contentForm.get('tempDistributions.payee').value,
                  bp: normDistBp,
                }));


              if (this.contentForm.get('masterManagesContract').value === true) {
                this.management.push(
                  this.fb.control({
                    voter: this.contentForm.get('tempDistributions.payee').value,
                    percentage: this.contentForm.get('tempManagement.percentage').value,
                  }));
                if (this.contentForm.get('tempManagement.percentage').value < 100) {
                  this.showMasterThreshold();
                }
              }

              this.contentForm.get('tempDistributions').patchValue({ payee: null });
              this.contentForm.get('tempDistributions').patchValue({ bp: '' });
              this.contentForm.get('tempManagement').patchValue({ voter: null });
              this.contentForm.get('tempManagement').patchValue({ percentage: '' });
              this.contentForm.patchValue({ masterManagesContract: false });

            }

            else {
              this.alert.showErrorMessage(ErrorCodes.usernameNotFound);
            }
          });
        break;
      case 'compRoyaltySplit':
        this.soundacService.userExist(this.contentForm.get('tempDistributionsComp.payee').value).then(
          user => {
            if (user === true) {

              let managementCompValue = '';

              if (this.contentForm.get('compManagesContract').value === true) {
                this.contentForm.patchValue({ compManagesContract: true });
                managementCompValue = 'Contract Manager';
              } else {
                this.contentForm.get('tempManagementComp').patchValue({ percentage: 0 });
              }

              this.compRoyaltySplit.push({
                username: this.contentForm.get('tempDistributionsComp.payee').value,
                income: this.contentForm.get('tempDistributionsComp.bp').value,
                management: managementCompValue,
                weight: this.contentForm.get('tempManagementComp.percentage').value,
              });

              if (this.compRoyaltySplit.length !== 0) {
                this.compIncomeTotal = this.compIncomeTotal + this.contentForm.get('tempDistributionsComp.bp').value;
              }
              if (this.contentForm.get('tempManagementComp.percentage').value !== null || this.contentForm.get
                ('tempManagementComp.percentage').value !== undefined || this.contentForm.get('tempManagementComp.percentage').value !== 0) {
                this.compWeightTotal = this.compWeightTotal + this.contentForm.get('tempManagementComp.percentage').value;
              }

              const normDistBp = this.normalizeSplitVal(this.contentForm.get('tempDistributionsComp.bp').value);

              this.distributionsComp.push(
                this.fb.control({
                  payee: this.contentForm.get('tempDistributionsComp.payee').value,
                  bp: normDistBp,
                }));


              if (this.contentForm.get('compManagesContract').value === true) {
                this.managementComp.push(
                  this.fb.control({
                    voter: this.contentForm.get('tempDistributionsComp.payee').value,
                    percentage: this.contentForm.get('tempManagementComp.percentage').value,
                  }));
                if (this.contentForm.get('tempManagementComp.percentage').value < 100) {
                  this.showCompThreshold();
                }
              }

              this.contentForm.get('tempDistributionsComp').patchValue({ payee: null });
              this.contentForm.get('tempDistributionsComp').patchValue({ bp: '' });
              this.contentForm.get('tempManagementComp').patchValue({ voter: null });
              this.contentForm.get('tempManagementComp').patchValue({ percentage: '' });
              this.contentForm.patchValue({ compManagesContract: false });
            }
            else {
              this.alert.showErrorMessage(ErrorCodes.usernameNotFound);
            }
          });
        break;
    }
  }

  removeFromList(listName: string, i) {
    switch (listName) {
      case 'masterRoyaltySplit':
        let masterIncome = 0;
        let masterWeight = 0;

        if (this.masterRoyaltySplit.length !== 0) {
          masterIncome = this.masterRoyaltySplit[i].income;
          masterWeight = this.masterRoyaltySplit[i].weight;

          this.masterRoyaltySplit.splice(i, 1);

          if (this.distributions.at(i) !== undefined || this.distributions.at(i) !== null) {
            this.distributions.removeAt(i);
          }

          if (this.management.length !== 0) {
            this.management.removeAt(i);
          }

          this.masterIncomeTotal = this.masterIncomeTotal - masterIncome;
          this.masterWeightTotal = this.masterWeightTotal - masterWeight;
        }
        break;
      case 'compRoyaltySplit':
        let compIncome = 0;
        let compWeight = 0;

        if (this.compRoyaltySplit.length !== 0) {
          compIncome = this.compRoyaltySplit[i].income;
          compWeight = this.compRoyaltySplit[i].weight;

          this.compRoyaltySplit.splice(i, 1);

          if (this.distributionsComp.at(i) !== undefined || this.distributionsComp.at(i) !== null) {
            this.distributionsComp.removeAt(i);
          }

          if (this.managementComp.length !== 0) {
            this.managementComp.removeAt(i);
          }

          this.compIncomeTotal = this.compIncomeTotal - compIncome;
          this.compWeightTotal = this.compWeightTotal - compWeight;
        }
        break;
      default:
        this[listName].removeAt(i);
    }
  }

  showMasterThreshold() {
    if (this.management.length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  showCompThreshold() {
    if (this.managementComp.length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  setCountry(country: string | null) {
    if (country) {
      this.contentForm.get('album_meta').patchValue({ countryOrigin: country });
    } else {
      this.contentForm.controls.album_meta['controls']['countryOrigin'].setErrors({ validCountry: 'Must be an existing country.' });
    }
  }

  mapGenre(selectorParam: string, genre: number | null) {
    if (genre || genre === 0) {
      switch (selectorParam) {
        case 'albumGenre1':
          this.contentForm.get('album_meta').patchValue({ albumGenre1: genre });
          this.contentForm.updateValueAndValidity();
          break;
        case 'albumGenre2':
          this.contentForm.get('album_meta').patchValue({ albumGenre2: genre });
          this.contentForm.updateValueAndValidity();
          break;
        case 'trackGenre1':
          this.contentForm.get('track_meta').patchValue({ trackGenre1: genre });
          this.contentForm.updateValueAndValidity();
          break;
        case 'trackGenre2':
          this.contentForm.get('track_meta').patchValue({ trackGenre2: genre });
          this.contentForm.updateValueAndValidity();
          break;
      }
    } else {
      switch (selectorParam) {
        case 'albumGenre1':
          this.contentForm.controls.album_meta['controls']['albumGenre1'].setErrors({ validGenre: 'Must be an existing genre.' });
          break;
        case 'albumGenre2':
          this.contentForm.controls.album_meta['controls']['albumGenre2'].setErrors({ validGenre: 'Must be an existing genre.' });
          break;
        case 'trackGenre1':
          this.contentForm.controls.track_meta['controls']['trackGenre1'].setErrors({ validGenre: 'Must be an existing genre.' });
          break;
        case 'trackGenre2':
          this.contentForm.controls.track_meta['controls']['trackGenre2'].setErrors({ validGenre: 'Must be an existing genre.' });
          break;
      }
    }
  }

  currentDate() {
    const today = new Date();
    this.maxDate = new Date(this.datePipe.transform(today, 'yyyy/MM/dd'));
    this.maxYear = Number.parseInt(this.datePipe.transform(today, 'yyyy'));
  }

  normalizeSplitVal(num: number) {
    return (num * 100);
  }

  normalizeFormValues() { // TODO: Double check all values are correct!!!
    return new Promise((resolve, reject) => {
      const isValid = this.customValidation();
      if (isValid) {
        ////
        const releaseDate = Number.parseInt(this.datePipe.transform(this.contentForm.value.album_meta.releaseDate, 'yyyyMMdd'));
        this.contentForm.get('album_meta').patchValue({ releaseDate: releaseDate });

        const num_salesStartDate = Number.parseInt(this.datePipe.transform(this.contentForm.value.album_meta.salesStartDate, 'yyyyMMdd'));
        this.contentForm.get('album_meta').patchValue({ salesStartDate: num_salesStartDate });
        /////

        const num_releaseDate = this.contentForm.get('album_meta.releaseDate').value;
        const releaseYear = num_releaseDate.toString().substring(0, 4);
        const num_releaseYear = Number.parseInt(releaseYear);
        this.contentForm.get('album_meta').patchValue({ releaseYear: num_releaseYear });

        const normPubShar = this.normalizeSplitVal(this.contentForm.value.publishers_share);
        const normPlayReward = this.normalizeSplitVal(this.contentForm.value.playing_reward);

        this.contentForm.patchValue({ publishers_share: normPubShar });
        this.contentForm.patchValue({ playing_reward: normPlayReward });

        // region Album
        if (this.contentForm.value.album_meta.albumTitle === '') {
          this.contentForm.get('album_meta').patchValue({ albumTitle: this.contentForm.value.track_meta.trackTitle });
        }
        if (this.contentForm.value.album_meta.albumGenre1 === '') {
          this.contentForm.get('album_meta').patchValue({ albumGenre1: 0 });
        }
        if (this.contentForm.value.album_meta.albumGenre2 === '') {
          this.contentForm.get('album_meta').patchValue({ albumGenre2: null });
        }

        if (this.contentForm.value.album_meta.explicit === '') {
          this.contentForm.get('album_meta').patchValue({ explicit: 0 });
        }
        if (this.contentForm.value.album_meta.upcEan === '') {
          this.contentForm.get('album_meta').patchValue({ upcEan: 0 });
        }
        // endregion

        // region Track
        if (this.contentForm.value.track_meta.featuredArtistIsni === '') {
          this.contentForm.get('track_meta').patchValue({ featuredArtistIsni: undefined });
        }
        if (this.contentForm.value.track_meta.trackGenre1 === '') {
          this.contentForm.get('track_meta').patchValue({ trackGenre1: 0 });
        }
        if (this.contentForm.value.track_meta.trackGenre2 === '') {
          this.contentForm.get('track_meta').patchValue({ trackGenre2: undefined });
        }
        if (this.contentForm.value.track_meta.trackNo === '') {
          this.contentForm.get('track_meta').patchValue({ trackNo: 0 });
        }
        if (this.contentForm.value.track_meta.trackVolumeNo === '') {
          this.contentForm.get('track_meta').patchValue({ trackVolumeNo: 0 });
        }
        if (this.contentForm.value.track_meta.trackDuration === '') {
          this.contentForm.get('track_meta').patchValue({ trackDuration: 0 });
        }
        if (this.contentForm.value.track_meta.hasSample === '') {
          this.contentForm.get('track_meta').patchValue({ hasSample: false });
        }
        // endregion

        // region Comp

        if (this.publishers.length === 0) {
          this.publishers.push(
            this.fb.control({
              publisher: '',
              IPI_CAE: '',
              ISNI: undefined
            }));
        }

        // endregion

        // region Distributions and Management

        if (this.management.length === 1) {
          this.contentForm.patchValue({
            management_threshold: 100
          });
        }

        if (this.managementComp.length === 1) {
          this.contentForm.patchValue({
            management_threshold_comp: 100,
          });
        }
        // endregion
        resolve(this.contentForm.value);
      } else {

        this.alert.showErrorMessage(ErrorCodes.invalidContentForm);
        reject(false);
      }
    });
  }

  denormalizeSplitVal(num: number) {
    return (num / 100);
  }

  denormalizeForView() {
    if (this.contentForm.get('publishers_share').value !== 0) {
      const pubShr = (this.contentForm.get('publishers_share').value / 100);
      this.contentForm.patchValue({ publishers_share: pubShr });
    }

    const plyRew = (this.contentForm.get('playing_reward').value / 100);
    this.contentForm.patchValue({ playing_reward: plyRew });
  }

  updateMasterManagesContract(value?) {
    if (value) {
      this.contentForm.patchValue({ masterManagesContract: true });
    }
    else {
      this.contentForm.patchValue({ masterManagesContract: false });
      this.contentForm.get('tempManagement').patchValue({ percentage: null });
    }
  }

  updateManagesCompsContract(value?) {
    if (value) {
      this.contentForm.patchValue({ compManagesContract: true });
    }
    else {
      this.contentForm.patchValue({ compManagesContract: false });
      this.contentForm.get('tempManagementComp').patchValue({ percentage: null });
    }
  }

  onGenMasterSplitChange() {
    this.contentForm.patchValue({ publishers_share: (this.max - this.contentForm.get('master_share').value) });
    this.onGenSplitChange();
  }

  onGenCompSplitChange() {
    this.contentForm.patchValue({ master_share: (this.max - this.contentForm.get('publishers_share').value) });
    this.onGenSplitChange();
  }

  onGenSplitChange() {
    this.contentForm.patchValue({ publishers_share: (this.max - this.contentForm.get('master_share').value) });
    this.contentForm.patchValue({ master_share: (this.max - this.contentForm.get('publishers_share').value) });
    this.playRewardMax = this.contentForm.get('master_share').value;
    this.setCompRoyalty();
  }

  setCompRoyalty() {
    this.pubShareValue = this.contentForm.get('publishers_share').value;
    if (this.pubShareValue === 0) {
      this.setCompRoyaltyNotRequired();
    } else {
      this.compRoyaltyRequired = true;
      this.contentForm.get('comp_meta').patchValue({ isThirdPartyPublishers: true });
    }
  }

  setCompRoyaltyNotRequired() {
    this.compRoyaltySplit = [];
    this.contentForm.get('tempDistributionsComp').patchValue({ payee: null });
    this.contentForm.get('tempDistributionsComp').patchValue({ bp: null });
    this.contentForm.get('tempManagementComp').patchValue({ voter: null });
    this.contentForm.get('tempManagementComp').patchValue({ percentage: null });

    this.contentForm.get('comp_meta').patchValue({ isThirdPartyPublishers: false });

    this.contentForm.patchValue({ distributionsComp: [] });
    this.contentForm.patchValue({ managementComp: [] });
    this.compIncomeTotal = 0;
    this.compWeightTotal = 0;
    this.compRoyaltyRequired = false;
  }

  mastInputValid() {
    if (this.contentForm.get('tempDistributions.payee').value === null ||
      this.contentForm.get('tempDistributions.payee').value === '' ||

      this.contentForm.get('tempDistributions.bp').value === null ||
      this.contentForm.get('tempDistributions.bp').value === '' ||
      this.contentForm.get('tempDistributions.bp').value < 0 ||
      this.contentForm.get('tempDistributions.bp').value > 100 ||

      this.contentForm.get('management_threshold').value === null ||
      this.contentForm.get('management_threshold').value === '' ||
      this.contentForm.get('playing_reward').value > this.contentForm.get('master_share').value ||

      // (this.masterManagesContract === true &&
      (this.contentForm.get('masterManagesContract').value === true &&
        (
          this.contentForm.get('tempManagement.percentage').value === null ||
          this.contentForm.get('tempManagement.percentage').value === '' ||
          this.contentForm.get('tempManagement.percentage').value < 0 ||
          this.contentForm.get('tempManagement.percentage').value > 100
        )
      )
    ) {
      return false;
    }
    return true;
  }

  compInputValid() {
    if (this.contentForm.get('tempDistributionsComp.payee').value === null ||
      this.contentForm.get('tempDistributionsComp.payee').value === '' ||

      this.contentForm.get('tempDistributionsComp.bp').value === null ||
      this.contentForm.get('tempDistributionsComp.bp').value === '' ||
      this.contentForm.get('tempDistributionsComp.bp').value < 0 ||
      this.contentForm.get('tempDistributionsComp.bp').value > 100 ||

      this.contentForm.get('management_threshold_comp').value === null ||
      this.contentForm.get('management_threshold_comp').value === '' ||

      (this.contentForm.get('compManagesContract').value === true &&
        (
          this.contentForm.get('tempManagementComp.percentage').value === null ||
          this.contentForm.get('tempManagementComp.percentage').value === '' ||
          this.contentForm.get('tempManagementComp.percentage').value < 0 ||
          this.contentForm.get('tempManagementComp.percentage').value > 100
        )
      )
    ) {
      return false;
    }
    return true;
  }

  customValidation() {
    if (this.distributions.length === 0 ||
      this.trackArtists.length === 0 ||
      this.writers.length === 0 ||
      this.masterIncomeTotal !== 100 ||
      this.masterWeightTotal !== 100 ||
      (this.compRoyaltyRequired && this.distributionsComp.length === 0) ||
      (this.compRoyaltyRequired && (this.compIncomeTotal !== 100 || this.compWeightTotal !== 100))) {
      return false;
    }
    else {
      return true;
    }
  }

  reviewContent() {
    this.dialogRefReview = this.dialog.open(ModalReviewComponent, {
      width: '60%',
      disableClose: true,
      data: [this.contentForm.getRawValue(), this.trackArtists, this.albumArtists, this.writers, this.publishers, this.masterRoyaltySplit, this.compRoyaltySplit]
    });

    this.dialogRefReview.afterClosed().subscribe(data => {

      if (data !== undefined) {
        this.ui.showLoading();
        this.normalizeFormValues().then((results) => {
          if (results !== undefined) {
            const authPassword = this.auth.user.getPassword();
            this.soundacService.postContent(authPassword, this.auth.user.username, results).then((success) => {
              console.log('Success!');
              if (success !== undefined) {
                const answer = this.alert.showCustomMessage('Success!', 'Your content has been posted to SOUNDAC.');
                this.resetValues(); // TODO: Pass in 'yes'/'no' reset partial or all based on answer
                this.ui.hideLoading();
              } else {
                this.denormalizeForView();
              }
            }).catch((err) => {
              this.denormalizeForView();
              this.alert.showErrorMessage('Failed to Post Content - Error: ' + err);
              this.ui.hideLoading();
            });
          }
          else {
            this.alert.showErrorMessage('Unable to finalize content.');
          }
          this.ui.hideLoading();
        });
      }
    });
  }

  resetValues(val?: boolean) {
    this.max = 100;
    this.splitMax = 99;
    this.splitMin = 1;
    this.pubShareValue = 50;
    this.playRewardMax = 50;

    this.masterIncomeMax = 100;
    this.compIncomeMax = 100;

    this.masterWeightMax = 100;
    this.compWeightMax = 100;

    this.masterIncomeTotal = 0;
    this.masterWeightTotal = 0;
    this.compIncomeTotal = 0;
    this.compWeightTotal = 0;

    this.masterRoyaltySplit = [];
    this.compRoyaltySplit = [];

    this.isOneOwner = false;
    this.sliderDisabled = false;

    this.contentForm.reset();
    this.ngOnInit();
  }
}
