import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { News } from '../models/news';
import { BehaviorSubject, catchError, concatMap, delay, from, map, Observable, of, tap } from 'rxjs';
import { getDatabase, ref, set, push, get, update, remove } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})

export class NewsService {

  private newsList = new Array<News>();
  private nextId: number = 0;
  private categories = ['entertainment', 'world', 'business', 'health', 'sport', 'science', 'technology'];
  private newsListSubject = new BehaviorSubject<News[]>([]);

  constructor(private data: DataService) { }

  lastNews(): void {
    from(this.categories)
      .pipe(
        concatMap((cat) => {
          return this.apiNews(cat).pipe(
            delay(1000)  // Añadimos un retraso de 1 segundo entre cada solicitud
          );
        })
      )
      .subscribe({
        complete: () => {
          // Guardamos las noticias sin 'key' en la base de datos
          this.save();
        }
      });
  }
  
  private apiNews(cat: string): Observable<void> {
    return this.data.loadApiNews(cat).pipe(
      catchError(err => of([])),
      tap((response: any) => {
        if (response.items && Array.isArray(response.items)) {
          response.items.forEach((element: { 
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
              // Si no es duplicada, la agregamos a la lista
              this.newsList.push(newNews);
              this.nextId++;
            }
          });
        }
      })
    );
  }
  
  private isDuplicate(news: News): boolean {
    // Verificamos si alguna noticia en la lista tiene el mismo `newsUrl`
    return this.newsList.some(existingNews => existingNews.url === news.url);
  }

  private save(): void {
    const newsWithoutKey = this.newsList.filter(news => !news.key);  // Filtramos las noticias sin 'key'
    
    if (newsWithoutKey.length > 0) {
      const saveRequests = newsWithoutKey.map(news => {
        const newsRef = ref(getDatabase(), 'news');  // Referencia a la ubicación donde se guardan las noticias
  
        // Guardamos la noticia en Firebase
        const newNewsRef = push(newsRef);  // Genera una nueva referencia con un ID único
        return set(newNewsRef, news)  // Usamos set() para guardar la noticia
          .then(() => {
            // Asignamos el 'key' (ID generado por Firebase) a la noticia
            news.key = newNewsRef.key || '';
            console.log(`Noticia guardada con key: ${news.key}`);
            
            // Después de guardarla, actualizamos la noticia si es necesario (por ejemplo, con nuevos campos)
            return update(newNewsRef, { key: newNewsRef.key })
              .then(() => {
                console.log("Noticia actualizada con su key en Firebase.");
              });
          })
          .catch((error) => {
            console.error(`Error al guardar la noticia:`, error);
          });
      });
  
      // Ejecutamos todas las peticiones de guardado en paralelo
      Promise.all(saveRequests)
        .then(() => {
          console.log("Todas las noticias fueron guardadas y actualizadas con éxito.");
        })
        .catch((error) => {
          console.error("Error al guardar las noticias:", error);
        });
    }
  }

  loadList(): void {
    const db = getDatabase();
    const newsRef = ref(db, 'news');
    get(newsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.newsList = Object.values(snapshot.val());
        }
        this.setId();
        //this.lastNews();
        this.sortList();
        this.newsListSubject.next(this.newsList);  // Emitimos la lista actualizada
      })
      .catch((err) => {
        console.error('Error al cargar las noticias:', err);
        this.newsListSubject.next([]); // En caso de error, devolvemos una lista vacía
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

  // Obtener noticias filtradas por categoría
  getCategoryList(category: string): Observable<News[]> {
    return new Observable(observer => {
      this.getNewsList().subscribe(newsList => {
        if (newsList.length === 0) {
          this.loadList(); // Si no hay noticias, cargamos las noticias
        } else {
          const list = newsList.filter(news => news.category === category);
          observer.next(list);
        }
      });
    });
  }

  // Establecer el próximo ID de noticia
  private setId(): void {
    if (this.newsList.length > 0) {
      this.nextId = Math.max(...this.newsList.map(news => news.id)) + 1;
    } else {
      this.nextId = 1;
    }
  }

  // Ordenar la lista de noticias por timestamp
  private sortList(): void {
    this.newsList.sort((a, b) => b.timestamp - a.timestamp); // Orden ascendente
  }

  // Guardar nuevas noticias en Firebase
  saveNews(news: News): void {
    const db = getDatabase();
    const newsRef = ref(db, 'news');
    const newNewsRef = push(newsRef);  // Crear un nuevo ID único para la noticia
    set(newNewsRef, news)
      .then(() => {
        news.key = newNewsRef.key!;
        console.log(`Noticia guardada con key: ${news.key}`);
        // Después de guardar la noticia, podemos actualizar si es necesario
        update(newNewsRef, { key: news.key })
          .then(() => {
            console.log('Noticia actualizada con key');
          })
          .catch((error) => {
            console.error('Error al actualizar la noticia:', error);
          });
      })
      .catch((error) => {
        console.error('Error al guardar la noticia:', error);
      });
  }

 // Agregar un nuevo "like" a una noticia existente
addLikeToNews(newsKey: string, newLike: string): void {
  const db = getDatabase();
  const newsRef = ref(db, `news/${newsKey}`);
  
  get(newsRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const news = snapshot.val();
        
        // Verificamos si 'likes' existe, si no, lo inicializamos como un array vacío
        if (!news.likes) {
          news.likes = [];
        }

        // Verificamos si el "like" ya está presente para evitar duplicados
        if (!news.likes.includes(newLike)) {
          news.likes.push(newLike);  // Agregamos el nuevo like
          
          // Actualizamos la noticia en la base de datos
          update(newsRef, { likes: news.likes })
            .then(() => {
              console.log('Noticia actualizada con el nuevo like');
            })
            .catch((error) => {
              console.error('Error al actualizar los likes:', error);
            });
        } else {
          console.log('Este like ya ha sido agregado anteriormente.');
        }
      } else {
        console.error('No se encontró la noticia con el key proporcionado');
      }
    })
    .catch((error) => {
      console.error('Error al obtener la noticia:', error);
    });
}


  getHighlightedNews(): Observable<News[]> {
    return this.getNewsList().pipe(
      map(newsList => {
        return newsList.sort((a, b) => b.likes.length - a.likes.length).slice(0, 6);  // Ordenar por likes y devolver las 6 primeras
      })
    );
  }
  

  deleteNews(newsKey: string): void {
    const db = getDatabase();
    const newsRef = ref(db, `news/${newsKey}`);  // Referencia a la noticia en Firebase
  
    // Usamos `remove()` para eliminar la noticia en Firebase
    remove(newsRef)
      .then(() => {
        console.log('Noticia eliminada con éxito');
        // Actualizamos la lista de noticias localmente después de la eliminación
        this.loadList();  // Vuelve a cargar la lista de noticias desde Firebase
      })
      .catch((error) => {
        console.error('Error al eliminar la noticia:', error);
      });
  }

  getNewsByKey(newsKey: string): Observable<News | null> {
    return new Observable<News | null>((observer) => {
      const db = getDatabase();
      const newsRef = ref(db, `news/${newsKey}`);  // Referencia a la noticia con el key específico
      
      get(newsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();  // Obtener datos de Firebase
            const news = new News(
              data.id,
              data.title,
              data.snippet,
              data.publisher,
              data.url,
              data.imageUrl,
              data.timestamp,
              data.category,
              data.visible,
              data.likes,
              newsKey // Asignamos el key
            );
            observer.next(news); // Emitir la noticia
          } else {
            observer.next(null); // Si no existe la noticia, devolvemos null
          }
        })
        .catch((error) => {
          console.error('Error fetching news from Firebase:', error);
          observer.error(error); // Si ocurre un error, lo emitimos
        });
    }).pipe(
      catchError((error) => {
        console.error('Error en getNewsByKey', error);
        return [null];  // Retornar un observable con null en caso de error
      })
    );
  }
}

