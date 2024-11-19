import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsViewComponent } from './components/news-view/news-view.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';

const routes: Routes = [
  {path: 'newsList', component: NewsListComponent},
  {path: '', redirectTo: '/newsList', pathMatch:'full'},
  { path: 'news/:key', component: NewsViewComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'logIn', component: LogInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
