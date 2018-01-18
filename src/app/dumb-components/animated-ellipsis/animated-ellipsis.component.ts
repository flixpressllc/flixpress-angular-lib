import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-animated-ellipsis',
  templateUrl: './animated-ellipsis.component.html',
  styleUrls: ['./animated-ellipsis.component.scss'],
})
export class AnimatedEllipsisComponent implements OnInit, OnDestroy {

  dots: string;
  tempo = 500;
  numDots = 5;
  interval: number;

  animate() {
    this.reset();
    let currentTimeout = 0;

    for (let i = this.numDots; i > 0; --i) {
      currentTimeout = currentTimeout + this.tempo;
      setTimeout(() => {
        this.dots = this.dots + '.';
      }, currentTimeout);
    }

  }

  reset() {
    this.dots = '';
  }

  ngOnInit() {
    this.interval = this.runAnimation();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  runAnimation() {
    const fullCycle = this.tempo * (this.numDots + 1);
    this.animate();
    return setInterval(this.animate.bind(this), fullCycle);
  }

}
