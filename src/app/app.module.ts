import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { QuizStartComponent } from './quiz-start/quiz-start.component';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { QuizDetailComponent } from './quiz-detail/quiz-detail.component';
import { QuizActiveComponent } from './quiz-active/quiz-active.component';
import { QuizManagerComponent } from './quiz-manager/quiz-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MessagesComponent,
    QuizStartComponent,
    QuizResultsComponent,
    QuizDetailComponent,
    QuizActiveComponent,
    QuizManagerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
