import { Component, OnDestroy, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute, Router } from '@angular/router';

import { NewsService } from '../../services/news.service';
import { Subscription } from 'rxjs';
import { Category, CategoryService } from '../../enums/category';



@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit, OnDestroy{
  newsList: News[] = [];
  // Definir cuántas noticias mostrar por página
  itemsPerPage: number = 6;
  // Definir el número de página actual
  currentPage: number = 1;
  private routeSub: Subscription | undefined;
  aux!: string;

  constructor(private router: Router, private list:NewsService, private route: ActivatedRoute){}
  

  ngOnInit(): void {
    // Primero, suscríbete a los cambios en los parámetros de la ruta
    this.routeSub = this.route.paramMap.subscribe(params => {
      // Captura el valor de la categoría de los parámetros de la URL
      const category = params.get('category');
  
      if ( !category || Object.values(Category).includes(category as Category)) {
        // Si category es vacío o está dentro de las opciones válidas del enum
        if (category) {
          this.aux= this.aux = CategoryService.getEnumName(category);
          this.categoryList(category);  // Llamar a la función para manejar la nueva categoría
        } else {
          this.aux='Últimas Noticias';
          this.home();  // Si la categoría es vacía, carga las noticias generales
        }
      } else {
        // Si category no es válido, redirige al home
        this.router.navigate(['/not-found']);  // Redirigir a la página de inicio
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al salir del componente para evitar fugas de memoria
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  home() {
    this.list.getNewsList().subscribe(response => {
      this.newsList = response;
    }); 
    this.list.loadList();
  }

  categoryList(category: string) {
    this.list.getCategoryList(category).subscribe(newsList => {
      this.newsList = newsList;
    });
  }

  onNewsClick(news: News) {
    this.router.navigate(['/news', news.key]);
  }
}

