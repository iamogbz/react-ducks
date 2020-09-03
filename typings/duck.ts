type Action<T extends string, P> = {
    type: T;
    payload?: P;
};

type ActionCreator<T extends string, P> = (payload: P) => Action<T, P>;

type Reducer<S> = (state?: S, action?: Action<string, unknown>) => S;

type ReducerMapping<S> = Record<string, Reducer<S>>;

type Selector<S> = (state: S) => unknown;

type Duck<S> = {
    name: string;
    reducer: Reducer<S>;
    actions: Record<string, ActionCreator<string, unknown>>;
    selectors?: Record<string, Selector<S>>;
};
