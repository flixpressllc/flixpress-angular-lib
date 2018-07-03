# Angular Decorators

## About the `@HandleSubscriptions` decorator

The `@HandleSubscriptions` decorator adds an `addSubscription` method to the *Component* it decorates. The method takes two arguments: an observable and a function to call when the observable emits. The subscriptions are automatically unsubscribed when the component is destroyed.

The one caveat is a Typescript shortcoming: you must merge the interface before the class definition.

```typescript
import { HandleSubscriptions, IHandleSubscriptions } from '<app-directory>/utils/decorators'

export interface Example extends IHandleSubscriptions {} // tslint:disable-line

@HandleSubscriptions
@Component({/* ... */})
export class Example {
  constructor(private observable) {}

  subscribeToStuff() {
    // Typescript will throw a compile time error
    // on the next line without the interface
    // extension on the third line of this code
    // snippet.
    this.addSubscription(this.observable, (data) => {
      console.log('we got some new data!')
    })
  }
}
```

This is because Typescript cannot figure out what is happening behind the scenes when decorators add methods to classes. In addition, if you export the class, you must also export the interface.
