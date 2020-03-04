import { Injectable } from "@angular/core";
import {
  Observable,
  from,
  of,
  interval,
  range,
  timer,
  concat,
  empty,
  throwError
} from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  bufferTime,
  startWith,
  endWith,
  delay,
  catchError,
  map,
  retry
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class OperatorsService {
  constructor(private httpClient: HttpClient) {}

  creationOperators() {
    // this.create();
    // this.ajax();
    // this.fromOperator();
    // this.intervalOperator();
    // this.rangeOperator();
    // this.timerOperator();
  }

  transformationOperators() {
    // Transforms an input observable as a new one
    // this.bufferTime();
  }

  combinationOperators() {
    this.startWithOperator();
    // this.concatOperator();
  }

  errorHandlingOperators() {
    // this.catchError();
    // this.retry();
  }

  create() {
    const createOperator = Observable.create(observer => {
      observer.next("Hello");
      observer.next("World");
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
    console.log("creates an observable from an array");
    arraySource.subscribe(data => console.log(data));

    // create an observal of promise
    const promiseSource = from(new Promise(resolve => resolve("Hello World!")));
    console.log("create an observal of promise.");
    promiseSource.subscribe(val => console.log(val, ": Probably last"));

    // Creating an observable from a collection
    const map = new Map();
    map.set(1, "Hi");
    map.set(2, "Bye");
    const mapSource = from(map);
    console.log("Creating an observable from a collection");
    mapSource.subscribe(val => console.log(val));

    // Creates an observable that emits the characters in a string
    const source = from("Hello World");
    console.log("Creates an observable that emits the characters in a string");
    source.subscribe(val => console.log(val));
  }

  intervalOperator() {
    // emit value in sequence every 1 second
    const source = interval(1000);
    const subscribe = source.subscribe(val => console.log(val));
    setTimeout(() => {
      subscribe.unsubscribe();
    }, 5000);
  }

  rangeOperator() {
    const source = range(1, 10);
    const example = source.subscribe(val => console.log(val));
  }

  timerOperator() {
    // emit 0 after 1 second then complete, since no second argument is supplied
    const source = timer(1000);
    const subscribe = source.subscribe(val => console.log(val));

    // const source2 = timer(1000, 2000);
    // output: 0,1,2,3,4,5......
  }

  bufferTime() {
    //Create an observable that emits a value every 500ms
    const source = interval(500);
    //After 2 seconds have passed, emit buffered values as an array
    const example = source.pipe(bufferTime(2000));

    const subscribe = example.subscribe(val =>
      console.log("Buffered with Time:", val)
    );

    setTimeout(() => {
      subscribe.unsubscribe();
    }, 10000);
  }

  startWithOperator() {
    const source = of(1, 2, 3); // or from([1,2,3])
    const example = source.pipe(startWith(0), endWith(4)); 
    const subscribe = example.subscribe(val => console.log(val));
  }

  concatOperator() {
    concat(of(1, 2, 3), of(4, 5, 6), of(7, 8, 9)).subscribe(console.log);
  }

  concatOperatorExample(concatElem) {
    // elems
    const userMessage = document.getElementById("message");
    // helper
    const delayedMessage = (message, delayedTime = 1000) => {
      return empty().pipe(
        startWith(message),
        delay(delayedTime)
      );
    };

    concat(
      delayedMessage("Get Ready!"),
      delayedMessage(3),
      delayedMessage(2),
      delayedMessage(1),
      delayedMessage("Go!"),
      delayedMessage("", 2000)
    ).subscribe((message: any) => {
      concatElem.innerHTML = message;
    });
  }

  catchError() {
    //emit error
    const source = throwError("This is an error!");
    //gracefully handle error, returning observable with error message
    const example = source.pipe(catchError(val => of(`I caught: ` + val)));
    //output: 'I caught: This is an error'
    const subscribe = example.subscribe(val => console.log(val));

    this.httpClient
      .get("	https://dummy.restapiexample.com/api/v1/employees", {
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
      .get("	https://dummy.restapiexample.com/api/v1/emplyees", {
        // headers: this.setHeaders(),
        // params: parameters
      })
      .pipe(
        map((res: any) => {
          return res.data;
        }),
        retry(3)
      )
      .subscribe(data => console.log(data), err => console.log('Retried 3 more times then quit'));
  }

  private handleError(error) {
    const err = {
      status: error.status + ": " + error.statusText,
      statusCode: error.status,
      message: error.error.message ? error.error.message : ""
    };
    console.log("HTTP ERROR", err.message);
    return of(err);
  }
}