type Newable<T> = new (...args: any[]) => T;

export interface IHandleSubscriptions {
  addSubscription<T>(
    obs: Subscribable<T>,
    fn: SubscriberFunction<T>,
  ): void;
}

type SubscriptionHandler<T> = T & IHandleSubscriptions;

interface Unsubscribable {
  unsubscribe(): any;
}

type SubscriberFunction<T> = (data?: T) => any;

interface Subscribable<T> {
  subscribe(fn: SubscriberFunction<T>): Unsubscribable;
}

export function HandleSubscriptions<T>(constructor: Newable<T>): Newable<SubscriptionHandler<T>> {
  constructor.prototype.__subscriptions = <Unsubscribable[]>[];
  constructor.prototype.addSubscription = function <X>(
    observable: Subscribable<X>,
    fn: SubscriberFunction<X>,
  ) {
    this.__subscriptions.push(observable.subscribe(fn));
  };
  const oldNgDestroy = constructor.prototype.ngOnDestroy;
  constructor.prototype.ngOnDestroy = function() {
    if (oldNgDestroy) oldNgDestroy.bind(this)();
    this.__subscriptions.forEach(s => s.unsubscribe());
  };
  return constructor as Newable<SubscriptionHandler<T>>;
}
