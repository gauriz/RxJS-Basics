const Rx = require('rxjs/Rx');
const repeat = require('rxjs/operator/repeat');


const interval$ = Rx.Observable.interval(1000);
const items$ = Rx.Observable.from([1, 2, 3]);

const itemsOverTime$ = Rx.Observable.zip(interval$, items$).repeat();

itemsOverTime$.subscribe(([time, val]) => {
  console.log(val);
  // 1
  // 2
  // 3
  // 1
  // 2
  // 3
});