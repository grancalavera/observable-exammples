import { interval, map, take } from "rxjs";

const source$ = interval(500).pipe(
  map((x) => (x % 26) + 65),
  map((x) => [x, String.fromCharCode(x)])
);

source$.pipe(take(6)).subscribe((value) => console.log("[1]", { value }));

setTimeout(() => {
  source$.pipe(take(6)).subscribe((value) => console.log("[2]", { value }));
}, 4000);

// why does [2] starts at A?
// how can you make [2] start where [1] ended?
// how can you make [2] see the last value [1] saw?
// how cah you make [2] see all the value [1] has seen?

// what is multicasting?
// what is caching?
// what does "complete" mean?

setTimeout(() => {
  source$.subscribe((value) => console.log("[3]", { value }));
}, 4000);

// what would [3] see if source$ was multicasting?
