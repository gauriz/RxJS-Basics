import { Injectable } from '@angular/core';
import {
  Observable,
  from,
  of,
  interval,
  range,
  timer,
  concat,
  empty,
  throwError,
  iif,
  forkJoin
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  bufferTime,
  startWith,
  endWith,
  delay,
  catchError,
  map,
  retry,
  merge,
  defaultIfEmpty,
  every,
  mergeMap,
  distinctUntilChanged,
  filter,
  take,
  switchMap,
  tap,
  reduce,
  finalize
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
  constructor(private httpClient: HttpClient) { }

  creationOperators() {
    this.create();
    // this.ajax();
    // this.fromOperator();
    // this.intervalOperator();
    // this.rangeOperator();
    // this.timerOperator();
  }


  combinationOperators() {
    this.startWithOperator();
    // this.concatOperator();
    // this.mergeOperator();
    // this.forkJoinOperator();
  }

  conditionalOperators() {
    this.defaultIfEmptyOperator();
    // this.everyOperator();
    // this.iifOperator();
  }

  errorHandlingOperators() {
    this.catchError();
    // this.retry();
  }

  filteringOperators() {
    this.distinctUntilChangedOperator();
    // this.filterOperator();
    // this.takeOperator();
  }

  transformationOperators() {
    // Transforms an input observable as a new one
    // this.bufferTime();
    this.mapOperator();
    // this.switchMapOperator();
    // this.reduceOperator();
  }

  utilityOperators() {
    this.tapOperator();
    // this.finalizeOperator();
  }

  // Create Operators
  create() {
    const createOperator = Observable.create(observer => {
      observer.next('Hello');
      observer.next('World');
      observer.complete();
    });

    const subscribe = createOperator.subscribe(val => console.log(val));
    subscribe.unsubscribe();
  }

  ajax() {
    const githubUsers = `https://api.github.com/users?per_page=2`;
    const users = ajax(githubUsers);

    const subscribe1 = users.subscribe(
      res => console.log(res), // res.response gives the data
      err => console.error(err)
    );

    // to get the response JSON directly
    const jsonUsers = ajax.getJSON(githubUsers);

    const subscribe2 = jsonUsers.subscribe(
      res => console.log(res),
      err => console.error(err)
    );
  }

  fromOperator() {
    // creates an observable from an array
    const arraySource = from([1, 2, 3, 4, 5]);
    console.log('creates an observable from an array');
    arraySource.subscribe(data => console.log(data));

    // create an observal of promise
    const promiseSource = from(new Promise(resolve => resolve('Hello World!')));
    console.log('create an observal of promise.');
    promiseSource.subscribe(val => console.log(val, ': Probably last'));

    // Creating an observable from a collection
    const map = new Map();
    map.set(1, 'Hi');
    map.set(2, 'Bye');
    const mapSource = from(map);
    console.log('Creating an observable from a collection');
    mapSource.subscribe(val => console.log(val));

    // Creates an observable that emits the characters in a string
    const source = from('Hello World');
    console.log('Creates an observable that emits the characters in a string');
    source.subscribe(val => console.log(val));
  }

  intervalOperator() {
    // emit value in sequence every 1 second
    console.log('INTERVAL');
    const source = interval(1000);
    const subscribe = source.subscribe(val => console.log(val));
    setTimeout(() => {
      subscribe.unsubscribe();
    }, 5000);
  }

  rangeOperator() {
    console.log('RANGE');
    const source = range(1, 10);
    const example = source.subscribe(val => console.log(val));
  }

  timerOperator() {
    console.log('TIMER');
    // emit 0 after 1 second then complete, since no second argument is supplied
    const source = timer(1000);
    const subscribe = source.subscribe(val => console.log(val));

    // const source2 = timer(1000, 2000);
    // output: 0,1,2,3,4,5......
  }

  // Combination Operators
  startWithOperator() {
    const source = of(1, 2, 3); // or from([1,2,3])
    const example = source.pipe(
      startWith(0),
      endWith(4)
    );
    const subscribe = example.subscribe(val => console.log(val));
  }

  concatOperator() {
    concat(of(1, 2, 3), of(4, 5, 6), of(7, 8, 9)).subscribe(console.log);
  }

  concatOperatorExample(concatElem) {
    // elems
    const userMessage = document.getElementById('message');
    // helper
    const delayedMessage = (message, delayedTime = 1000) => {
      return empty().pipe(
        startWith(message),
        delay(delayedTime)
      );
    };

    concat(
      delayedMessage('Get Ready!'),
      delayedMessage(3),
      delayedMessage(2),
      delayedMessage(1),
      delayedMessage('Go!'),
      delayedMessage('', 2000)
    ).subscribe((message: any) => {
      concatElem.innerHTML = message;
    });
  }

  mergeOperator() {
    // emit every 2.5 seconds
    const first = interval(2500);
    // emit every 1 second
    const second = interval(1000);
    // used as instance method
    const example = first.pipe(merge(second));
    // output: 0,1,0,2....
    const subscribe = example.subscribe(val => console.log(val));
  }

  forkJoinOperator() {
    forkJoin(
      ajax.getJSON('https://api.github.com/users/google'),
      ajax.getJSON('https://api.github.com/users/microsoft')
    ).subscribe(console.log);
  }

  // Conditional Operators
  defaultIfEmptyOperator() {
    const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));
    const subscribe1 = exampleOne.subscribe(val => console.log(val));

    // tslint:disable-next-line: deprecation
    const example = empty().pipe(defaultIfEmpty('Observable.empty()!'));
    const subscribe2 = example.subscribe(val => console.log(val));
  }

  everyOperator() {
    const integers = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    const allEvens = of(2, 4, 6, 8, 10);
    const exampleForEvenFalse = integers.pipe(every(val => val % 2 === 0));
    const exampleForEvenTrue = allEvens.pipe(every(val => val % 2 === 0));
    // output: false
    const subscribeIntegers = exampleForEvenFalse.subscribe(val =>
      console.log(val)
    );
    // output: true
    const subscribeEvens = exampleForEvenTrue.subscribe(val =>
      console.log(val)
    );

    const both = concat(integers, allEvens).pipe(every(val => val % 2 === 0));
    const subscribeBoth = both.subscribe(val => console.log(val)); // output : false
  }

  iifOperator() {
    const observable = interval(1000)
      .pipe(
        mergeMap(v =>
          iif(() => v % 2 === 0, of(v + ': even'), of(v + ': not even'))
        )
      )
      .subscribe(console.log);
    setTimeout(() => {
      observable.unsubscribe();
    }, 10000);
  }

  // Error handling operators
  catchError() {
    // emit error
    const source = throwError('This is an error!');
    // gracefully handle error, returning observable with error message
    const example = source.pipe(catchError(val => of(`I caught: ` + val)));
    // output: 'I caught: This is an error'
    const subscribe = example.subscribe(val => console.log(val));

    this.httpClient
      .get('https://dummy.restapiexample.com/api/v1/employees', {
        // headers: this.setHeaders(),
        // params: parameters
      })
      .pipe(
        map((res: any) => {
          return res.data;
        }),
        catchError(this.handleError)
      )
      .subscribe(data => console.log(data));
  }

  retry() {
    this.httpClient
      .get('	https://dummy.restapiexample.com/api/v1/emplyees', {
        // headers: this.setHeaders(),
        // params: parameters
      })
      .pipe(
        map((res: any) => {
          return res.data;
        }),
        retry(3)
      )
      .subscribe(
        data => console.log(data),
        err => console.log('Retried 3 more times then quit')
      );
  }

  private handleError(error) {
    const err = {
      status: error.status + ': ' + error.statusText,
      statusCode: error.status,
      message: error.error.message ? error.error.message : ''
    };
    console.log('HTTP ERROR', err.message);
    return of(err);
  }

  // Filtering Operators
  distinctUntilChangedOperator() {
    const source = from([1, 1, 2, 2, 3, 3]);
    let subscription = source
      .pipe(distinctUntilChanged())
      // output: 1,2,3
      .subscribe(console.log);

    subscription.unsubscribe();

    const source2 = from([
      { name: 'Brian' },
      { name: 'Joe' },
      { name: 'Joe' },
      { name: 'Sue' }
    ]);

    subscription = source2
      .pipe(distinctUntilChanged((prev, curr) => prev.name === curr.name))
      // output will be objects of Brian, Joe and Sue (3)
      .subscribe(console.log);

    subscription.unsubscribe();
  }

  filterOperator() {
    const source = interval(1000);
    const example = source.pipe(filter(num => num > 5 && num < 10));
    const subscribe = example.subscribe(val => console.log(`: ${val}`));
  }

  takeOperator() {
    const source = of(1, 2, 3, 4, 5);
    const example = source.pipe(take(3));
    const subscribe = example.subscribe(console.log);
  }

  // Transformation Operators

  bufferTime() {
    // Create an observable that emits a value every 500ms
    const source = interval(500);
    // After 2 seconds have passed, emit buffered values as an array
    const example = source.pipe(bufferTime(2000));

    const subscribe = example.subscribe(val =>
      console.log('Buffered with Time:', val)
    );

    setTimeout(() => {
      subscribe.unsubscribe();
    }, 10000);
  }

  mapOperator() {
    const arraySource = from([1, 2, 3, 4, 5]);
    const arrayObservable = arraySource.pipe(map(val => val + 10));
    const arraySubscription = arrayObservable.subscribe(val =>
      console.log(val)
    );

    const jsonSource = from([
      { name: 'Joe', age: 30 },
      { name: 'Frank', age: 20 },
      { name: 'Ryan', age: 50 }
    ]);
    const jsonObservable = jsonSource.pipe(map(({ name }) => name));
    const jsonSubscription = jsonObservable.subscribe(val => console.log(val));

    arraySubscription.unsubscribe();
    jsonSubscription.unsubscribe();
  }

  switchMapOperator() {
    const employees = this.httpClient.get(
      'https://dummy.restapiexample.com/api/v1/employees'
    );
    const users = this.httpClient.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    empty()
      .pipe(
        switchMap(emp => {
          return employees;
        }),
        switchMap(user => {
          return users;
        })
      )
      .subscribe(data => {
        console.log(data);
      });
  }

  reduceOperator() {
    const source = of(1, 2, 3, 4);
    const example = source.pipe(reduce((acc, val) => acc + val));
    const subscribe = example.subscribe(val => console.log('Sum:', val));
  }

  // Utility Operators

  tapOperator() {
    const source = of(1, 2, 3, 4, 5);
    const example = source
      .pipe(
        tap(val => console.log(`BEFORE MAP:`, val)),
        map(val => val + 10),
        tap(val => console.log(`AFTER MAP: `, val))
      )
      .subscribe();
  }

  finalizeOperator() {
    const source = interval(1000);
    const example = source.pipe(
      take(5),
      finalize(() => console.log('Sequence complete'))
    );
    const subscribe = example.subscribe(val => console.log(val));
  }










}
