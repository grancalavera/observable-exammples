import { combineLatest, interval, map, Observable, of, OperatorFunction, switchMap } from "rxjs";

const count = () => {
  let value = 1;
  return new Observable<number>((observer) => {
    value = value * 2;
    observer.next(value);
  });
};

const count$ = count();

const addTime = <T>(
  timeSource$: Observable<number>
): OperatorFunction<T, { data: T; time: number }> =>
  switchMap((data) => timeSource$.pipe(map((time) => ({ data, time }))));

interval(1000)
  .pipe(addTime(count$))
  .subscribe((result) => console.log({ result }));
