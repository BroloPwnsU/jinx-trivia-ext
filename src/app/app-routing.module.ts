import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizActiveComponent } from './quiz-active/quiz-active.component';
import { QuizDetailComponent } from './quiz-detail/quiz-detail.component';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';


const routes: Routes = [
	{ path: 'active', component: QuizActiveComponent },
	{ path: 'quiz/:id', component: QuizDetailComponent },
	{ path: 'results', component: QuizResultsComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: '**', component: DashboardComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {
}
