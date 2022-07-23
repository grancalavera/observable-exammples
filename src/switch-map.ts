import { endWith, interval, map, startWith, switchMap, take, tap } from "rxjs";

interval(2500)
  .pipe(
    tap((x) => console.log(`[ request ] ${x}`)),
    switchMap((x) =>
      interval(1000).pipe(
        take(10),
        map((i) => `    [work] x = ${x}, i = ${i}, i* x = ${i * x}`),
        startWith(`[ acknowledge ] ${x}`),
        endWith("[ complete ]")
      )
    )
  )
  .subscribe(console.log);
