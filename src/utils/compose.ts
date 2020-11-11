type Length<T extends unknown[]> = T extends { length: infer L } ? L : never;
type DropFirst<T extends unknown[]> = T extends [
    first: unknown,
    ...rest: infer U
]
    ? U
    : T;
type Last<T extends unknown[]> = T[Length<DropFirst<T>>];

type Callable<P extends unknown[] = unknown[], R = unknown> = (...a: P) => R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose<F extends Callable<T[], T>[], T = any>(
    ...funcs: F
): Last<F> {
    if (funcs.length === 0) {
        return (arg) => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
