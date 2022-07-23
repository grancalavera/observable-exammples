import { delay, interval, of, startWith, switchMap, tap } from "rxjs";

const requestRate = 1000;
const acknowledgeRate = requestRate * 2;

interval(requestRate)
  .pipe(
    tap((x) => console.log(`[ request ] ${x}`)),
    switchMap((x) => of(x).pipe(startWith(`[ acknowledge ] ${x}`), delay(acknowledgeRate)))
  )
  .subscribe(console.log);
