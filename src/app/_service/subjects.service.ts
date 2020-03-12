import { Injectable } from "@angular/core";
import {
  Subject,
  from,
  Observable,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject
} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubjectsService {
  constructor() {}

  subjectExamples() {
    this.simpleSubject();
    // this.subjectObservableSubscription();
    // this.differenceBetweenObservables();
    // this.behavioralSubject();
    // this.replaySubject();
    // this.asyncSubject();
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
      subscriber.next(Math.floor(Math.random() * 10));
    });
    myObservable.subscribe(a => console.log("Subscription A: (Observable)", a));
    myObservable.subscribe(a => console.log("Subscription B: (Observable)", a));

    const subject = new Subject<number>();
    subject.subscribe(data => console.log("Subscription A: (Subject)", data));
    subject.subscribe(data => console.log("Subscription B: (Subject)", data));
    subject.next(Math.floor(Math.random() * 10));
  }

  behavioralSubject() {
    const subject = new BehaviorSubject(0); // 0 is the initial value
    subject.subscribe({
      next: v => console.log(`observer A: ${v}`)
    });
    subject.next(1);
    subject.next(2);
    subject.subscribe({
      next: v => console.log(`observer B: ${v}`)
    });
    subject.next(3);
  }

  replaySubject() {
    const subject = new ReplaySubject(3); // n = 3

    subject.subscribe({
      next: v => console.log(`observer A: ${v}`)
    });

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);

    subject.subscribe({
      next: v => console.log(`observerB: ${v}`)
    });

    subject.next(5);
  }

  asyncSubject() {
    const subject = new AsyncSubject();
    subject.subscribe({
      next: v => console.log(`observer A: ${v}`)
    });

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);

    subject.subscribe({
      next: v => console.log(`observer B: ${v}`)
    });

    subject.next(5);
    subject.complete();
  }
}
