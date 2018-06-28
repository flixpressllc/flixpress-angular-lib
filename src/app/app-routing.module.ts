import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeleprompterRouteComponent } from './routes/teleprompter-route/teleprompter-route.component';
import { RouteNotFoundComponent } from './routes/route-not-found/route-not-found.component';
import { ExamplesComponent } from './examples/examples.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'examples',
    pathMatch: 'full',
  },
  {
    path: 'examples',
    component: ExamplesComponent,
  },
  {
    path: 'recorder',
    loadChildren: './recorder/recorder.module#RecorderModule',
  },
  {
    path: 'teleprompter',
    component: TeleprompterRouteComponent,
  },
  {
    path: '**',
    component: RouteNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
