import { concat, delay, exhaustMap, interval, of, startWith, tap } from "rxjs";

const requestRate = 500;
const acknowledgeRate = requestRate * 4;
interval(requestRate)
  .pipe(
    tap((x) => console.log(`[ request ] ${x}`)),
    exhaustMap((x) =>
      concat(of(`[ acknowledge ] ${x}`), of([x, x * x]).pipe(delay(acknowledgeRate)))
    )
  )
  .subscribe(console.log);
