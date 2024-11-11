import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsViewComponent } from './components/news-view/news-view.component';

const routes: Routes = [
  {path: 'newsList', component: NewsListComponent},
  {path: '', redirectTo: '/newsList', pathMatch:'full'},
  {path: 'news/:id', component: NewsViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
