type Nullable<T> = T | null | undefined;

type Expected<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Entry<O> = {
    [K in keyof O]: [K, O[K]];
}[keyof O];

type Entries<O> = Entry<O>[];
