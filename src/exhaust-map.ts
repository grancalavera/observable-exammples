import { endWith, exhaustMap, interval, map, startWith, take, tap } from "rxjs";

// https://rxjs.dev/api/index/function/exhaustMap
// exhaust map cancels "before" the operator, that is, once the "after" part is emitting,
// the "before" part will be ignored until the "after" part completes. this means that
// if the "after" part never completes, the "before" part will be ignored forever.
// here, "count requests" will be ignored if the currently running count hasn't completed

interval(2500)
  .pipe(
    tap((x) => console.log(`[ request ] ${x}`)),
    exhaustMap((x) =>
      interval(1000).pipe(
        take(10),
        map((i) => `    [work] x = ${x}, i = ${i}, i* x = ${i * x}`),
        startWith(`[ acknowledge ] ${x}`),
        endWith("[ complete ]")
      )
    )
  )
  .subscribe(console.log);
