import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl="http://localhost:8080/api/states";

  constructor(private httpClient: HttpClient) { }

  getCountries():Observable<Country[]>
  {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string):Observable<State[]>{

    //search URL
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]>
  {
    let data: number[]=[];

    //build an array for months drop down list
    //start at current month and loop till 12
    for(let month=startMonth; month<=12; month++)
    {
      data.push(month);
    }

    return of(data);
    }

  
  getCreditCardYears():Observable<number[]>
  {
    let data: number[]=[];

    //build an array for year drop down list
    //loop the array till next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let year=startYear; year<=endYear;year++)
    {
      data.push(year);
    }

    return of(data);
  }


}

interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
