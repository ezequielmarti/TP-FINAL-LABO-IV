import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { News } from '../models/news';
import { BehaviorSubject, catchError, concatMap, delay, forkJoin, from, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NewsService {

  private newsList = new Array<News>();
  private nextId: number = 0;
  private categories = ['entertainment', 'world', 'business', 'health', 'sport', 'science', 'technology'];
  private newsListSubject = new BehaviorSubject<News[]>([]);

  constructor(private data: DataService) { }

  loadList(): void {
    this.data.loadNews()
      .pipe(
        catchError(err => of([]))
      )
      .subscribe(response => {
        if (response) {
          // Reorganizamos las noticias para que sean en un orden numérico adecuado (0, 1, 2,...)
          this.newsList = Object.values(response);  // Convierte el objeto en un array
        }
        this.setId();
        //this.lastNews();  // Trae noticias de la API
        this.sortList();
        this.newsListSubject.next(this.newsList);  // Emitimos la lista actualizada
      });
  }

  getNewsList() {
    return this.newsListSubject.asObservable().pipe(
      map(newsList => {
        // Asegurarse de que todas las noticias tengan un arreglo de likes
        return newsList.map(news => {
          // Si 'likes' no está definido o es null, lo inicializamos como un arreglo vacío
          if (!news.likes) {
            news.likes = [];
          }
          return news;
        });
      })
    );
  }

  getCategoryList(category: string): Observable<News[]> {
    return new Observable(observer => {
      // Nos suscribimos al Subject para obtener la lista de noticias
      this.getNewsList().subscribe(newsList => {
        if (newsList.length === 0) {
          // Si no hay noticias, cargamos las noticias primero
          this.loadList();
        } else {
          // Si ya hay noticias, aplicamos el filtro directamente
          const list = newsList.filter(news => news.category === category);
          observer.next(list);  // Emitimos el resultado filtrado
        }
      });
    });
  }

  private setId() {
    if (this.newsList.length > 0) {
      // Si la lista no está vacía, obtenemos el 'id' del último elemento y sumamos 1
      this.nextId = Math.max(...this.newsList.map(news => news.id)) + 1;
    } else {
      // Si la lista está vacía, empezamos con el id 1
      this.nextId = 1;
    }
  }

  private lastNews(): void {
    // Procesamos las categorías secuencialmente con un retraso de 1 segundo entre cada llamada
    from(this.categories)
      .pipe(
        concatMap((cat) => {
          // Llamamos a la API para cada categoría
          return this.apiNews(cat).pipe(
            // Añadimos un retraso de 1 segundo entre cada solicitud
            delay(1000)
          );
        })
      )
      .subscribe({
        complete: () => {
          // Una vez que todas las categorías han sido procesadas, guardamos los datos
          this.save();  // Guardamos las noticias que no tienen 'key'
        }
      });
  }

  private isDuplicate(news: News): boolean {
    // Verificamos si alguna noticia en la lista tiene el mismo `newsUrl`
    return this.newsList.some(existingNews => existingNews.url === news.url);
  }

  private apiNews(cat: string): Observable<void> {
    let newsData: any;
    return this.data.loadApiNews(cat).pipe(
      catchError(err => of([])), // Manejo de errores
      tap((response: any) => {
        newsData = response;
        if (newsData.items && Array.isArray(newsData.items)) {
          newsData.items.forEach((element: {
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
            const newNews = new News(this.nextId, element.title, element.snippet, element.publisher,
              element.newsUrl, aux, element.timestamp, cat, true, new Array<string>());
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

  // Función que guarda las noticias que no tienen 'key' asignado
  private save(): void {
    const newsWithoutKey = this.newsList.filter(news => !news.key);  // Filtramos las noticias sin 'key'
    if (newsWithoutKey.length > 0) {
      const saveRequests = newsWithoutKey.map(news => {
        return this.data.saveNews(news).pipe(
          catchError((error) => {
            console.error(`Error al guardar la noticia:`, error);
            return of({ name: '' });  // Retornamos un objeto vacío con 'name' en caso de error
          }),
          tap((response: { name: string }) => {
            if (response.name) {
              // Asignamos el 'key' (name de la respuesta de Firebase) a cada noticia
              news.key = response.name;
              console.log(`Noticia guardada con key: ${news.key}`);
              
              // Luego de guardar, actualizamos la noticia con su 'key' (si es necesario)
              this.data.updateNews(news.key, news).subscribe(updateResponse => {
                console.log("Noticia actualizada con éxito en Firebase con key:", news.key);
              });
            } else {
              console.error('No se obtuvo el key de Firebase para la noticia.');
            }
          })
        );
      });

      // Ejecutamos todas las peticiones de guardado en paralelo
      forkJoin(saveRequests).subscribe(
        () => {
          console.log("Todas las noticias fueron guardadas y actualizadas con éxito.");
        },
        error => {
          console.error("Error al guardar las noticias:", error);
        }
      );
    }
  }

  private sortList() {
    this.newsList.sort((a, b) => b.timestamp - a.timestamp); // Orden ascendente
  }


  // Función para agregar un nuevo "like" a una noticia
  addLikeToNews(newsKey: string, newLike: string): void {
    // Paso 1: Obtener la noticia por su "key"
    this.data.loadNewsByKey(newsKey)
      .pipe(
        catchError(error => of(null)) // Devolvemos `null` si ocurre un error
      )
      .subscribe(news => {
        if (news) {
          const newsData = new News(
            news.id,
            news.title,
            news.snippet,
            news.publisher,
            news.url,
            news.imageUrl,
            news.timestamp,
            news.category,
            news.visible,
            news.likes,
            news.key
          );
          newsData.likes.push(newLike);

          // Paso 3: Actualizar la noticia en la base de datos con el nuevo arreglo de "likes"
          this.data.updateLikes(newsKey, { likes: newsData.likes })
            .pipe(
              catchError(error => of(`Error al actualizar la noticia: ${error}`))
            )
            .subscribe(response => {
              console.log('Noticia actualizada con el nuevo like:', response);
            });
        } else {
          console.error('No se encontró la noticia con el key proporcionado');
        }
      });
  }

  getHighlightedNews(): Observable<News[]> {
    return this.getNewsList().pipe(
      map(newsList => {
        const sortedNews = newsList.sort((a, b) => b.likes.length - a.likes.length);
        return sortedNews.slice(0, 12);
      })
    );
  }
}

