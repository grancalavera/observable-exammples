import { interval, NEVER, startWith, switchMap } from "rxjs";

// switch map cancels "after" the operator
interval(2000)
  .pipe(
    switchMap((i) =>
      i % 2 === 0
        ? NEVER.pipe(startWith(`${i} is even, stop counting!`))
        : interval(100).pipe(startWith(`${i} is odd, start counting!`))
    )
  )
  .subscribe(console.log);
