import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { VideoComponent } from './video/video.component';
import { AudioComponent } from './audio/audio.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'video',
        component: VideoComponent,
      },
      {
        path: 'audio',
        component: AudioComponent,
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecorderRoutingModule { }
