import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsViewComponent } from './components/news-view/news-view.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { WeatherComponent } from './components/weather/weather.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { CookieService } from 'ngx-cookie-service';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { CommentComponent } from './components/comment/comment.component';
import { NotFoundComponent } from './components/not-found/not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    NewsListComponent,
    NewsViewComponent,
    WeatherComponent,
    LogInComponent,
    SignUpComponent,
    NavigatorComponent,
    HighlightComponent,
    CommentComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({
      "projectId":"news-f8836",
      "appId":"1:423706328484:web:f65b7cecbba10a2a659531",
      "databaseURL":"https://news-f8836-default-rtdb.firebaseio.com",
      "storageBucket":"news-f8836.firebasestorage.app",
      "apiKey":"AIzaSyCHV9ExPwHwUQt95vPmChLkzPlhbjAgO7o",
      "authDomain":"news-f8836.firebaseapp.com",
      "messagingSenderId":"423706328484",
      "measurementId":"G-4D6WFEV4W9"
    })),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
