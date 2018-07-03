import * as decorators from './handle-subscriptions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('HandleSubscriptions Decorator', () => {
  let instance: TestClass;
  const decorator = decorators.HandleSubscriptions;

  interface TestClass extends decorators.IHandleSubscriptions { } // tslint:disable-line no-empty-interface

  @decorator
  class TestClass {
    constructor(private something: BehaviorSubject<number>) { }

    ngOnDestroySpy = jasmine.createSpy('ngOnDestroySpy');

    doSomething = jasmine.createSpy('doSomething');

    // tslint:disable-next-line use-life-cycle-interface
    ngOnDestroy() {
      this.ngOnDestroySpy();
    }

    example() {
      this.addSubscription(this.something, (data) => {
        this.doSomething(data);
      });
    }
  }

  beforeEach(() => {
    instance = new TestClass(new BehaviorSubject(1));
  });

  it('should not explode', () => {
    expect(instance).toBeTruthy();
  });

  it('should call the original ngOnDestroy', () => {
    instance.ngOnDestroy();
    expect(instance.ngOnDestroySpy).toHaveBeenCalled();
  });

  it('should add subscriptions', () => {
    const observable = new BehaviorSubject(5);
    const spy = spyOn(observable, 'subscribe').and.callThrough();

    instance.addSubscription(observable, () => { });

    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe', () => {
    const observable = new BehaviorSubject(123);
    const spy2 = jasmine.createSpyObj('subscription', ['unsubscribe']);
    const spy1 = spyOn(observable, 'subscribe').and.callFake(() => spy2);

    instance = new TestClass(observable);
    instance.example();
    instance.ngOnDestroy();

    expect(spy2.unsubscribe).toHaveBeenCalled();
  });
});
