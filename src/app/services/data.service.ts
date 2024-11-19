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
  
  loadNews(): Observable<News[]> {
    return this.http.get<News[]>('https://news-f8836-default-rtdb.firebaseio.com/news.json');
  }

  // Método para cargar una noticia por su "key"
  loadNewsByKey(key: string): Observable<News> {
    return this.http.get<News>(`https://news-f8836-default-rtdb.firebaseio.com/news/${key}.json`);
  }

  // Método para actualizar solo los campos especificados (usando PATCH)
  updateLikes(key: string, news: Partial<News>): Observable<any> {
    return this.http.patch(`https://news-f8836-default-rtdb.firebaseio.com/news/${key}.json`, news);
  }

    // Método para guardar una noticia
  saveNews(news: News) {
    return this.http.post<{ name: string }>('https://news-f8836-default-rtdb.firebaseio.com/news.json',news);
  }

  updateNews(key: string, news: News) {
    return this.http.put(`https://news-f8836-default-rtdb.firebaseio.com/news/${key}.json`,news);
  }

  getNews(key: string): Observable<News>{
    return this.http.get<News>(`https://news-f8836-default-rtdb.firebaseio.com/news/${key}.json`);
  }

  loadApiWeather(): Observable<any>{
    return this.http.get<any>('https://open-weather13.p.rapidapi.com/city/Mar%20del%20Plata/ES',
      {
        headers:{
          'x-rapidapi-key': 'fe5cee5d5emsheb3dd67a6c86484p1151d6jsnb08f71df05a7',
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
        }
      }
    )
  }
}
