type Nullable<T> = T | null | undefined;

type RequiredKeys<T, Keys extends keyof T> = Pick<T, Keys> &
    Partial<Omit<T, Keys>>;
type OptionalKeys<T, Keys extends keyof T> = Omit<T, Keys> &
    Partial<Pick<T, Keys>>;

/**
 * Transpose<{x:"a", y:"b"} | {x:"aa", y:"bb"}, "x", "y"> === {a:"b"; aa:"bb"}
 */
type Transpose<T, KeyProp, KeyValue> = {
    [M in T[KeyProp]]: Extract<T, Record<KeyProp, M>>[KeyValue];
};

type Entry<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T];

type Entries<T> = Entry<T>[];

type Length<T extends unknown[]> = T extends { length: infer L } ? L : never;

type Tail<T extends unknown[]> = T extends [head, ...rest: infer U] ? U : T;

type Last<T extends unknown[]> = T[Length<Tail<T>>];

type Callable<Arguments extends unknown[] = never[], Returns = unknown> = (
    ...a: Arguments
) => Returns;
