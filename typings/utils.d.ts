type Nullable<T> = T | null | undefined;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type MustHave<T, K extends keyof T> = Pick<T, K> & Partial<T>;
