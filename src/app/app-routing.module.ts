import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsViewComponent } from './components/news-view/news-view.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { isAuthGuard } from './guardians/is-auth.guard';
import { noAuthGuard } from './guardians/no-auth.guard';


const routes: Routes = [
  { path: '', component: NewsListComponent},
  { path: 'news-list/:category', component: NewsListComponent},
  { path: 'news/:key', component: NewsViewComponent, canActivate: [isAuthGuard]},
  { path: 'sign-up', component: SignUpComponent, canActivate: [noAuthGuard]},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
