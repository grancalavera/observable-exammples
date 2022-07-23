import { produce } from "immer";
import {
  distinctUntilChanged,
  filter,
  finalize,
  interval,
  merge,
  Observable,
  scan,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { assertNever } from "./assert-never";

type Change = { kind: "add"; id: string } | { kind: "delete"; id: string };
type Snapshot = { id: string; value: number };
type ChangeIndex = Record<string, Change>;

const addition = (id: string): Change => ({ kind: "add", id });
const deletion = (id: string): Change => ({ kind: "delete", id });

const initialSnapshots: Record<string, Snapshot> = {
  a: { id: "a", value: 123 },
  b: { id: "b", value: 0.78 },
  c: { id: "c", value: 89 },
};

const movements$ = (id: string): Observable<Snapshot> => {
  const snapshot = initialSnapshots[id];

  if (!snapshot) {
    return throwError(() => `Snapshot for id=${id} doesn't exist`);
  }

  return interval(1000).pipe(
    scan(
      (x) => ({ ...x, value: x.value * Math.random() * (Math.random() < 0.5 ? 1 : -1) }),
      snapshot
    ),
    finalize(() => {
      console.log(`finalize ${id}`);
    })
  );
};

const additions$ = new Subject<Change>();
const deletions$ = new Subject<Change>();

const empty = (): ChangeIndex => ({});

const indexChange = (changeIndex: ChangeIndex, change: Change): ChangeIndex =>
  produce(changeIndex, (draft) => {
    switch (change.kind) {
      case "add":
        if (!draft[change.id]) {
          draft[change.id] = change;
        }
        break;
      case "delete":
        delete draft[change.id];
        break;
      default:
        assertNever(change);
    }
  });

const indexedChanges$: Observable<ChangeIndex> = merge(additions$, deletions$).pipe(
  scan(indexChange, empty()),
  distinctUntilChanged(),
  shareReplay(1),
  tap((indexed) => console.log({ indexed }))
);

const streamingMovements$ = indexedChanges$.pipe(
  switchMap((changes) => {
    const movs$ = Object.values(changes).map((change) => movements$(change.id));
    return merge(...movs$);
  })
);

streamingMovements$.subscribe((movement) => console.log({ movement }));

additions$.next({ kind: "add", id: "a" });

setTimeout(() => {
  additions$.next(addition("c"));
  deletions$.next(deletion("a"));
}, 5000);

setTimeout(() => {
  additions$.next(addition("b"));
}, 6000);

setTimeout(() => {
  deletions$.next(deletion("c"));
  deletions$.next(deletion("b"));
}, 10000);

streamingMovements$
  .pipe(filter((candidate) => candidate.id === "a"))
  .subscribe({ next: (a) => console.log({ a }), complete: () => console.log("a completed") });
