import { format } from "date-fns";
import {
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  interval,
  map,
  NEVER,
  Observable,
  share,
  shareReplay,
  Subject,
  switchMap,
  tap,
  timer,
} from "rxjs";

const not = (x: boolean): boolean => !x;

const stateSwitch$ = new Subject<boolean>();

const applicationState$ = stateSwitch$.pipe(
  tap((state) => console.log(state ? "[ on ]" : "[ off ]")),
  distinctUntilChanged(),
  shareReplay(1)
);

const autoOnTimer$: Observable<boolean> = applicationState$.pipe(
  filter(not),
  delay(2000),
  map(() => true)
);

const autoOffTimer$: Observable<boolean> = applicationState$.pipe(
  filter(Boolean),
  delay(8000),
  map(() => false)
);

const clock$ = interval(1000).pipe(
  map((i) => `${i + 1}: ${format(new Date(), "HH:mm:ss")}`),
  share(),
  finalize(() => {
    console.log("[ clock finalized ]");
  })
);

const stopwatch$ = interval(100);

const displayClock = (name: string, options: { wait?: number } = {}) =>
  applicationState$
    .pipe(
      switchMap((isOn) => (isOn ? timer(options.wait ?? 0).pipe(switchMap(() => clock$)) : NEVER))
    )
    .subscribe({
      next: (time) => {
        console.log(`[ ${name} ] ${time}`);
      },
      complete: () => {
        console.log(`[ ${name} ] complete`);
      },
    });

const displayStopwatch = () =>
  applicationState$.pipe(switchMap((isOn) => (isOn ? NEVER : stopwatch$))).subscribe(console.log);

autoOnTimer$.subscribe((x) => stateSwitch$.next(x));

autoOffTimer$.subscribe((x) => stateSwitch$.next(x));

displayClock("Clock 1");
displayClock("Clock 2", { wait: 1000 });
displayClock("Clock 3", { wait: 3100 });
displayClock("Clock 4", { wait: 7000 });
displayStopwatch();

stateSwitch$.next(true);
