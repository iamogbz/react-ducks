type Action<
    T extends string = string /* All possible action types */,
    P = unknown /* All possible payload types */
> = {
    type: T;
    payload?: P;
};

type ActionCreator<T extends string = string, P = unknown, S = unknown> = (
    payload?: P,
) => React.ReducerAction<Reducer<S, T, P>>;

type ActionCreatorMapping<
    T extends string = string,
    P = unknown,
    S = unknown,
    C extends string = T /* Action creator mapping keys */
> = Record<C, ActionCreator<T, P, S>>;

type Reducer<
    S = unknown,
    T extends string = string,
    P = unknown
> = React.Reducer<S /* All possible state types */, Action<T, P>>;

type ActionReducerMapping<
    S = unknown,
    T extends string = string,
    P = unknown
> = Record<T, Reducer<S, T, P>>;

type Selector<
    S = unknown,
    R = unknown /* All possible selector return types */,
    T extends string = string,
    P = unknown
> = (state: React.ReducerState<Reducer<S, Action<T, P>>>) => R;

type SelectorMapping<
    S = unknown,
    R = unknown,
    T extends string = string,
    P = unknown,
    Q extends string = string /* All possible selector names*/
> = Record<Q, Selector<S, R, T, P>>;

type Duck<
    S = unknown,
    N extends string = string /* Duck name */,
    T extends U | V = string,
    P = unknown,
    R = unknown,
    Q extends string = string,
    U extends string = string,
    V extends string = string
> = {
    actions: ActionCreatorMapping<U, P>;
    initialState: S;
    name: N;
    reducer: Reducer<S, T, P>;
    selectors?: SelectorMapping<S, R, T, P, Q>;
};

type DuckReducerMapping<
    S = unknown,
    N extends string = string,
    T extends string = string,
    P = unknown
> = Record<N, Reducer<S, T, P>>;

type RootDuck<
    S = unknown,
    N extends string = string /* All possible duck names */,
    T extends U | V = string,
    P = unknown,
    R = unknown,
    Q extends string = string,
    U extends string = string,
    V extends string = string
> = {
    actions: Record<N, ActionCreatorMapping<U, P, S>>;
    initialState: Record<N, S>;
    names: Set<N>;
    reducer: Reducer<Record<N, S>, T, P>;
    selectors: Record<N, SelectorMapping<S, R, T, P, Q> | undefined>;
};
