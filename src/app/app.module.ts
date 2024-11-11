import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsViewComponent } from './components/news-view/news-view.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { WeatherComponent } from './components/weather/weather.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { UserComponent } from './components/user/user.component';
import { ComentBoxComponent } from './components/coment-box/coment-box.component';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsListComponent,
    NewsViewComponent,
    WeatherComponent,
    LogInComponent,
    UserComponent,
    ComentBoxComponent,
    NavigatorComponent,
    HighlightComponent,
    ErrorMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
