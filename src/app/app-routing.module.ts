import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CanvasUIComponent } from './canvas-ui/canvas-ui.component';

const routes: Routes = [
  { path: 'ui', component: CanvasUIComponent },
  { path: '',
    redirectTo: '/ui',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
