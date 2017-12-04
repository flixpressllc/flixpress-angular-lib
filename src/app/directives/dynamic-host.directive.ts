import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[app-dynamic-host]'
})
export class DynamicHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
