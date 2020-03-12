import { Injectable } from '@angular/core';
import { Subject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  constructor() { }

  subjectExamples() {
    // this.simpleSubject();
    // this.subjectObservableSubscription();
    this.differenceBetweenObservables();
  }

  subjectCreation() {
    const subject = new Subject<number>();
    subject.subscribe({
      next: v => console.log(`observerA: ${v}`)
    });
    subject.next(100);
  }

  simpleSubject() {
    const subject = new Subject<number>();
    subject.next(100); // won't get this cuz it's not subscribed
    subject.subscribe({
      next: v => console.log(`observerA: ${v}`)
    });
    subject.next(200);
    subject.subscribe({
      next: v => console.log(`observerB: ${v}`)
    });
    subject.next(300);
  }

  subjectObservableSubscription() {
    const subject = new Subject<number>();
    subject.subscribe({
      next: v => console.log(`observerA: ${v}`)
    });
    subject.subscribe({
      next: v => console.log(`observerB: ${v}`)
    });

    const observable = from([1, 2, 3]);
    observable.subscribe(subject);
  }

  differenceBetweenObservables() {
    const myObservable = new Observable<number>(subscriber => {
      const rdn = Math.random();
      subscriber.next(rdn);
    });
    myObservable.subscribe(a => console.log('Subscription A: (Observable)', a));
    myObservable.subscribe(a => console.log('Subscription B: (Observable)', a));

    const subject = new Subject<number>();
    subject.subscribe(data => console.log('Subscription A: (Subject)', data));
    subject.subscribe(data => console.log('Subscription B: (Subject)', data));
    subject.next(Math.random());
  }
}
