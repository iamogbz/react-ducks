/* eslint-disable @typescript-eslint/ban-types */
// github.com/reduxjs/redux/blob/f1fc7ce/src/compose.ts
type Func<T extends unknown[], R> = (...a: T) => R;

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export function compose(): <R>(a: R) => R;

export function compose<F extends Function>(f: F): F;

/* two functions */
export function compose<A, T extends unknown[], R>(
    f1: (a: A) => R,
    f2: Func<T, A>,
): Func<T, R>;

/* three functions */
export function compose<A, B, T extends unknown[], R>(
    f1: (b: B) => R,
    f2: (a: A) => B,
    f3: Func<T, A>,
): Func<T, R>;

/* four functions */
export function compose<A, B, C, T extends unknown[], R>(
    f1: (c: C) => R,
    f2: (b: B) => C,
    f3: (a: A) => B,
    f4: Func<T, A>,
): Func<T, R>;

/* rest */
export function compose<R>(
    f1: (a: unknown) => R,
    ...funcs: Function[]
): (...args: unknown[]) => R;

export function compose<R>(...funcs: Function[]): (...args: unknown[]) => R;

export function compose(...funcs: Function[]): Function {
    if (funcs.length === 0) {
        // infer the argument type so it is usable in inference down the line
        return <T>(arg: T): T => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce(
        (a, b) => ((...args: unknown[]) => a(b(...args))) as typeof a,
    );
}
