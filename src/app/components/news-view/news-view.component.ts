import { Component, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrl: './news-view.component.css'
})
export class NewsViewComponent implements OnInit{
  
  news: News | undefined;
  
  constructor(private route: ActivatedRoute, private newsService: NewsService){}

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');  // Obtener el ID de la URL

    if (newsId) {
      // Convertir el ID de string a número
      const id = parseInt(newsId, 10);
      if (!isNaN(id)) {
        this.news = this.newsService.getNewsId(id);
      };
    } else {
      console.error('ID inválido:', newsId);
    }
  }

  likeNews(): void {
    // Añadir un "like" a la noticia, simulando que el usuario dio un "me gusta"
    // Puedes usar un identificador único como el usuario actual si lo prefieres
     // Usamos un número genérico "1" como "like" de ejemplo
  }

}
