import { Injectable } from '@angular/core';
import { Observable, from, interval, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
  constructor() { }

  creationOperators() {
    // this.create();
    // this.ajax();
    // this.fromOperator();
    // this.intervalOperator();
  }

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
    console.log(1);
    // emit value in sequence every 1 second
    const source = interval(1000);
    const subscribe = source.subscribe(val => console.log(val));
    setTimeout(timer => {
      subscribe.unsubscribe();
    }, 5000);
  }
}
