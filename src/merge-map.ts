import { interval, map, mergeMap, of, take } from "rxjs";

// https://rxjs.dev/api/index/function/mergeMap
of("a", "b", "c")
  .pipe(mergeMap((x) => interval(1000).pipe(map((i) => x + i))))
  .subscribe(console.log);
