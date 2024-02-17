import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { Observable, filter, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public bordersByCountry: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]],

  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) { }
  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')?.setValue('')),//Esto es para limpiar el valor que se haya seleccionado y vuelva a estar en la opcion por defecto
        tap(() => this.bordersByCountry =[]),//Esto es para limpiar el valor que se haya seleccionado y vuelva a estar en la opcion por defecto
        switchMap(region => this.countriesService.getCountriesByRegion(region)))
      .subscribe(countries => {
        this.countriesByRegion = countries;


      })
  }



  onCountryChanged(): void {
    this.myForm.get('country')?.valueChanges
      .pipe(
        //Esto es para limpiar el valor que se haya seleccionado y vuelva a estar en la opcion por defecto
        tap(() => this.myForm.get('border')?.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode),), // NOTA: el alphaCode es el dato cc3 que tenemos de la interface
        switchMap((country) => this.countriesService.getCountryBordersByCodes(country.borders),),      )
      .subscribe(countries => {

        this.bordersByCountry = countries;


      })
  }

}
