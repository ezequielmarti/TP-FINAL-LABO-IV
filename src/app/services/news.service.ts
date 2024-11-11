import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { News } from '../models/news';
import { BehaviorSubject, catchError, concatMap, delay, from, Observable, of, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  newsList = new Array<News>();
  nextId: number= 0;
  categories = ['entertainment','world','business','health','sport','science','technology'];
  newsData: any;
  private newsListSubject = new BehaviorSubject<News[]>([]);  // Valor inicial vacío
  
  constructor(private data:DataService) { }

  loadList(): void{
    this.data.loadNewsData()
    .pipe(
      catchError(err => of([]))
    )
    .subscribe(response => {
      if(response){
        this.newsList = response;
      }
      this.setId();
      this.guardar();
      //this.lastNews();  //cuando se activa trae noticias de la api
      this.sortList();
      console.log('ANDAaaaaaaa',this.newsList);
      // Emitimos el nuevo arreglo (actualizado) a los suscriptores
      this.newsListSubject.next(this.newsList);
    }); 
  }

  getNewsList() {
    return this.newsListSubject.asObservable();  // Retornamos un Observable para que los componentes se suscriban
  }

  setId(){
    if (this.newsList.length > 0) {
      // Si la lista no está vacía, obtenemos el 'id' del último elemento y sumamos 1
      this.nextId = Math.max(...this.newsList.map(news => news.id)) + 1;
    } else {
      // Si la lista está vacía, empezamos con el id 1
      this.nextId = 1;
    }
  }
  guardar(): void{
    console.log('aaaaaaaaaaaaaaaa',this.newsList);
    this.data.saveAll(this.newsList)
    .pipe(
      catchError((error) => of(`¡Oh no, ha ocurrido un error! ${error}`))
    )
    .subscribe(response => {
      console.log("guardado con exito",response);
    })
  }

    lastNews(): void {
      // Procesamos las categorías secuencialmente con un retraso de 1 segundo entre cada llamada
      from(this.categories)
        .pipe(
          concatMap((cat) => {
            // Llamamos a la API para cada categoría
            return this.apiNews(cat).pipe(
              // Añadimos un retraso de 1 segundo entre cada solicitud
              delay(1000) // Asegura que haya un delay de 1 segundo entre cada llamada
            );
          })
        )
        .subscribe({
          complete: () => {
            // Una vez que todas las categorías han sido procesadas, guardamos los datos
            this.guardar();
            console.log('Guardado exitoso después de cargar todas las noticias');
          }
        });
    }
    
  isDuplicate(news: News): boolean {
    // Verificamos si alguna noticia en la lista tiene el mismo `newsUrl`
    return this.newsList.some(existingNews => existingNews.url === news.url);
  }
    
  apiNews(cat: string): Observable<void> {
    return this.data.loadApiNews(cat).pipe(
      catchError(err => of([])), // Manejo de errores
      tap((response: any) => {
        this.newsData = response;
        if (this.newsData.items && Array.isArray(this.newsData.items)) {
          this.newsData.items.forEach((element: {
            title: string;
            snippet: string;
            publisher: string;
            newsUrl: string;
            images: { thumbnail?: string };
            timestamp: number;
          }) => {
            let aux: string = '';
            if (element.images && element.images.thumbnail) {
              aux = element.images.thumbnail;
            }
            // Crear una nueva noticia
            const newNews = new News(this.nextId,element.title,element.snippet,element.publisher,
              element.newsUrl,aux,element.timestamp,cat,true,new Array<number>());
            // Verificar si la noticia ya existe
            if (!this.isDuplicate(newNews)) {
              // Solo agregamos si no es un duplicado
              this.newsList.push(newNews);
              this.nextId++;
            }
          });
        }
      })
    );
  }
  sortList(){
    this.newsList.sort((a, b) => b.timestamp - a.timestamp); // Orden ascendente
  }

  getNewsId(id: number): News | undefined{
    return this.newsList.find(news => news.id === id);
  }
}
