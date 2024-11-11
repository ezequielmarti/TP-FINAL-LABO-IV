import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { News } from '../models/news';
import { lastValueFrom, Observable } from 'rxjs';

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
  
  loadNewsData(): Observable<News[]> {
    return this.http.get<News[]>('https://news-f8836-default-rtdb.firebaseio.com/data.json');
  }
  

  setall(news : News[]){
    return this.http.put('https://news-f8836-default-rtdb.firebaseio.com/data.json',news);
  }


  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`https://news-f8836-default-rtdb.firebaseio.com/data/${id}.json`);
  }
}
