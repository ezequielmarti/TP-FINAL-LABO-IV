import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { News } from '../models/news';
import { Observable } from 'rxjs';
import { Weather } from '../inerfaces/weather';

@Injectable({
  providedIn: 'root'
})
export class DataService { 

  constructor(private http: HttpClient) { }
  
  // Trae noticias desde la Api
  loadApiNews(category: string): Observable<any>{
    return this.http.get<any>('https://google-news13.p.rapidapi.com/'+ category +'?lr=es-AR',
      {
        headers:{
          'x-rapidapi-key': '350cc89e65msha16f21b96656de3p1b6c92jsn596e782d684b',
          'x-rapidapi-host': 'google-news13.p.rapidapi.com'
        }
      }
    )
  }

  loadApiWeather(): Observable<any>{
    return this.http.get<any>('https://open-weather13.p.rapidapi.com/city/Mar%20del%20Plata/ES',
      {
        headers:{
          'x-rapidapi-key': 'a323c572b5msh10dd54b4a9b9412p1b7a28jsn55a7b46e1fc8',
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
        }
      }
    )
  }
}
