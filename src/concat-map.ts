import { concat, concatMap, delay, endWith, interval, map, of, startWith, take, tap } from "rxjs";

// https://rxjs.dev/api/index/function/concatMap
interval(2500)
  .pipe(
    tap((x) => console.log(`[ request ] ${x}`)),
    concatMap((x) =>
      interval(1000).pipe(
        take(10),
        map((i) => `    [work] x = ${x}, i = ${i}, i* x = ${i * x}`),
        startWith(`[ acknowledge ] ${x}`),
        endWith("[ complete ]")
      )
    )
  )
  .subscribe(console.log);
