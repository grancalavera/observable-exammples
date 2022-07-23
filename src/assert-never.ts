export function assertNever(x: never): void {
  throw new Error(`unexpected value ${x}`);
}
