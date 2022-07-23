import { never, Observable } from "rxjs";

type AnyFunction = (...p: any) => any;
type GetterFunction = () => any;

type TrustedFunction = (
  ...p: any
) =>
  | any[]
  | boolean
  | null
  | number
  | Observable<any>
  | Promise<any>
  | string
  | symbol
  | undefined
  | void;

/**
 * Given a type T and a type U, finds the keys in T that index types extending U.
 *
 * @example <caption>Given SourceType, finds all keys that extend string or () => void in SourceType,
 * and uses them to define a new type ResultType:</caption>
 * interface SourceType {
 *   key1: string | undefined;
 *   key2: string;
 *   key3: () => void;
 * }
 *
 * type ResultType = KeyIndexingType<SourceType, string |(() => void)>
 * // type ResultType = "key2" | "key3"
 */
type KeyIndexingType<T, U> = keyof {
  [k in keyof T as Exclude<k, T[k] extends U ? never : k>]: T[k];
};

type GetParams<T> = T extends AnyFunction ? Parameters<T> : never;

type GetReturn<T> = T extends AnyFunction ? ReturnType<T> : never;

type KeyIndexingEntityFunction<T> = Exclude<
  KeyIndexingType<T, AnyFunction>,
  KeyIndexingType<T, TrustedFunction>
>;

type Honest<T> = Omit<T, KeyIndexingEntityFunction<T>> & {
  [k in KeyIndexingEntityFunction<T>]: (
    ...p: GetParams<T[k]>
  ) => GetReturn<T[k]> | null | undefined;
};

interface Example {
  returnsNumber: (x: number, y: string, z: boolean) => number;
  returnsPromiseVoid: () => Promise<void>;
  returnsObservableVoid: () => Observable<void>;
  returnsVoid: () => void;
  returnsEmptyObject: (id: string) => {};
  returnsUndefined: () => undefined;
  returnsNull: () => null;
  returnArrayOfString: () => string[];
  returnsEmptyArray: () => [];
  returnsTupleOfString: () => [string, string];
  string: string;
  number: number;
  boolean: boolean;
}

type A = Honest<Example>;

declare const a: A;

a.returnArrayOfString;
a.returnsEmptyArray;
a.returnsEmptyObject;
a.returnsNull;
a.returnsNumber;
a.returnsObservableVoid;
a.returnsPromiseVoid;
a.returnsTupleOfString;
a.returnsUndefined;
a.returnsVoid;
a.string;
a.number;
a.boolean;

type ExtractGetters<T> = Omit<T, KeyIndexingType<T, GetterFunction>> & {
  [k in KeyIndexingType<T, GetterFunction> as k extends string
    ? GetterToProperty<k>
    : never]: GetReturn<T[k]>;
};

type GetterToProperty<T extends string> = T extends `get${infer Suffix}`
  ? Uncapitalize<Suffix>
  : never;

type B = GetterToProperty<"getFoo">;

type C = ExtractGetters<{ getX: () => string; y: string }>;
declare const c: C;
c.y;
c.x;
