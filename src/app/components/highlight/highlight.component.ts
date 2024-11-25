import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { News } from '../../models/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css'
})
export class HighlightComponent implements OnInit, OnDestroy{

  highlightedNews: News[] = [];  // Lista de noticias destacadas
  private newsSub: Subscription | undefined;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    // Suscripción al flujo de noticias destacadas
    this.newsSub = this.newsService.getHighlightedNews().subscribe((newsList: News[]) => {
      this.highlightedNews = newsList;  // Asigna las noticias destacadas a la variable local
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción para evitar fugas de memoria
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }
  }
}
