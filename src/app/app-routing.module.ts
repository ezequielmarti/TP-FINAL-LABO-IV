import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsViewComponent } from './components/news-view/news-view.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { HomeComponent } from './components/home/home.component';
import { guardianInGuard } from './guardians/guardian-in.guard';

const routes: Routes = [
  { path: '', component: NewsListComponent},
  { path: 'news-list/:category', component: NewsListComponent},
  { path: 'news/:key', component: NewsViewComponent, canActivate: [guardianInGuard]},
  { path: 'sign-up', component: SignUpComponent },
  { path: 'log-in', component: LogInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
