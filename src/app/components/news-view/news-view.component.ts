import { Component, OnDestroy, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { catchError, EMPTY } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrl: './news-view.component.css'
})
export class NewsViewComponent implements OnInit, OnDestroy{
  
  news!: News | null;
  update: boolean = false;
  likes: number = 0;
  user!: User;
  
  constructor(private route: ActivatedRoute, private data: DataService, 
    private userService: UserService, private newsService: NewsService){}
  
    ngOnInit(): void {
      const newsKey = this.route.snapshot.paramMap.get('key');  // Get the ID from the URL
    
      // Early return if newsKey is not present
      if (!newsKey) {
        this.news = null;
        return;
      }
    
      this.data.getNews(newsKey).pipe(
        catchError((error) => {
          console.error('Error fetching news:', error);
          this.news = null;
          return EMPTY;
        })
      ).subscribe({
        next: (response) => {
          // Crear el objeto News a partir de los datos obtenidos
          this.news = new News(
            response.id,
            response.title,
            response.snippet,
            response.publisher,
            response.url,
            response.imageUrl,
            response.timestamp,
            response.category,
            response.visible,
            response.likes,
            response.key
          );
          console.log('news:', this.news);
          this.likes = this.news.likeLength();
    
          // Ahora, obtener los datos del usuario solo después de que Firebase haya verificado el estado de autenticación
          this.userService.getUserData().then(userData => {
            if (userData) {
              this.user = userData;
              console.log('user:', this.user);
            } else {
              console.log('No se encontraron datos del usuario');
            }
          }).catch(error => {
            console.log('Error al obtener los datos del usuario:', error);
          });
        }
      });
    }
    

  likeNews(): void {
    if(this.news && this.news.like(this.user.key)){
      this.likes++;
      
    }else{
      this.likes--;
    }
    this.update = !this.update;
  }

  ngOnDestroy(): void {
    if(this.update && this.news && this.user){
      this.newsService.addLikeToNews(this.news.key,this.user.key);
    }
  }
}
