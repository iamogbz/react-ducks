type Nullable<T> = T | null | undefined;

type Include<T, K extends keyof T> = Pick<T, K> & Partial<T>;

type Entry<O> = {
    [K in keyof O]: [K, O[K]];
}[keyof O];

type Entries<O> = Entry<O>[];
