// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { Component, Directive } from '@angular/core';
import { ContentComponent } from './content.component';
import { AuthService } from '../../../services/authentication/auth.service';
import { FormBuilder } from '@angular/forms';
import { SoundacService } from '../../../services/soundac/soundac.service';
import { AlertService } from '../../../services/alerts/alert.service';
import { MatDialog } from '@angular/material';
// import { DatePipe } from '@angular/common';
import { UIService } from '../../../services/ui/ui.service';

@Injectable()
class MockAuthService { }

@Injectable()
class MockSdacService { }

@Injectable()
class MockAlertService { }

@Injectable()
class MockUIService { }

describe('ContentComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        FormBuilder,
        { provide: SoundacService, useClass: MockSdacService },
        { provide: AlertService, useClass: MockAlertService },
        MatDialog,
        DatePipe,
        { provide: UIService, useClass: MockUIService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });


  it('should run #ngOnInit()', async () => {
    // const result = component.ngOnInit();
  });

  it('should run #ngAfterViewInit()', async () => {
    // const result = component.ngAfterViewInit();
  });

  it('should run #createContentForm()', async () => {
    // const result = component.createContentForm();
  });

  it('should run #onFormValuesChanged()', async () => {
    // const result = component.onFormValuesChanged();
  });

  it('should run #oneOwner()', async () => {
    // const result = component.oneOwner();
  });

  it('should run #addPublisher()', async () => {
    // const result = component.addPublisher();
  });

  it('should run #addWriter()', async () => {
    // const result = component.addWriter();
  });

  it('should run #addArtist()', async () => {
    // const result = component.addArtist(headerTxt);
  });

  it('should run #addRoyaltySplit()', async () => {
    // const result = component.addRoyaltySplit(listName);
  });

  it('should run #removeFromList()', async () => {
    // const result = component.removeFromList(listName, i);
  });

  it('should run #showMasterThreshold()', async () => {
    // const result = component.showMasterThreshold();
  });

  it('should run #showCompThreshold()', async () => {
    // const result = component.showCompThreshold();
  });

  it('should run #setCountry()', async () => {
    // const result = component.setCountry(country);
  });

  it('should run #mapGenre()', async () => {
    // const result = component.mapGenre(selectorParam, genre);
  });

  it('should run #currentDate()', async () => {
    // const result = component.currentDate();
  });

  it('should run #normalizeSplitVal()', async () => {
    // const result = component.normalizeSplitVal(num);
  });

  it('should run #normalizeFormValues()', async () => {
    // const result = component.normalizeFormValues();
  });

  it('should run #denormalizeSplitVal()', async () => {
    // const result = component.denormalizeSplitVal(num);
  });

  it('should run #denormalizeForView()', async () => {
    // const result = component.denormalizeForView();
  });

  it('should run #updateMasterManagesContract()', async () => {
    // const result = component.updateMasterManagesContract(value);
  });

  it('should run #updateManagesCompsContract()', async () => {
    // const result = component.updateManagesCompsContract(value);
  });

  it('should run #onGenMasterSplitChange()', async () => {
    // const result = component.onGenMasterSplitChange();
  });

  it('should run #onGenCompSplitChange()', async () => {
    // const result = component.onGenCompSplitChange();
  });

  it('should run #onGenSplitChange()', async () => {
    // const result = component.onGenSplitChange();
  });

  it('should run #setCompRoyalty()', async () => {
    // const result = component.setCompRoyalty();
  });

  it('should run #setCompRoyaltyNotRequired()', async () => {
    // const result = component.setCompRoyaltyNotRequired();
  });

  it('should run #mastInputValid()', async () => {
    // const result = component.mastInputValid();
  });

  it('should run #compInputValid()', async () => {
    // const result = component.compInputValid();
  });

  it('should run #customValidation()', async () => {
    // const result = component.customValidation();
  });

  it('should run #reviewContent()', async () => {
    // const result = component.reviewContent();
  });

  it('should run #resetValues()', async () => {
    // const result = component.resetValues(val);
  });

});
