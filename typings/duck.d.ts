type Action<
    T extends string /* Action type */,
    P = unknown /* Payload type */
> = {
    type: T;
    payload?: P;
};

interface ActionCreator<
    T extends string /* Action Type */,
    P /* Payload Type */,
    S = unknown /* State type */
> {
    (payload?: P): React.ReducerAction<Reducer<S, T, P>, Action<T, P>>;
    type: T;
}

type ActionCreatorMapping<
    C extends string /* Action creator keys */,
    T extends string /* Action Type */,
    P /* Payload Type */,
    S /* State type */,
    TP extends Record<T, P> = Record<T, P> /* Action type to payload mapping */,
    CT extends Record<C, T> = Record<
        C,
        T
    > /* Action creator key to type mapping */
> = { [k in C]: Nullable<ActionCreator<CT[k], TP[CT[k]], S>> };

type ActionDispatcher<
    P extends unknown[] /* Dispatcher arguments, usually first argument is the payload */
> = (...args: P) => void;

type Reducer<
    S /* State type */,
    T extends string /* Action Type */,
    P /* Payload Type */,
    TP extends Record<T, P> = Record<T, P> /* Action type to payload mapping */
> = React.Reducer<
    S,
    {
        [K in T]: Action<T, TP[K]>;
    }[T]
>;

type ActionReducerMapping<
    S /* State type */,
    T extends string /* Action types */,
    P /* Payload types */,
    TP extends Record<T, P> = Record<T, P> /* Action type to payload mapping */
> = { [K in T]: Reducer<S, K, TP[K]> };

type Selector<
    S /* State type */,
    R /* Return type */,
    E extends unknown[] /* Selector extra arguments after state */,
    T extends string /* Action types */,
    P /* Payload types */
> = (state: React.ReducerState<Reducer<S, T, P>>, ...args: E) => R;

type SelectorMapping<
    S /* State type */,
    Q extends string /* Selector keys */,
    R /* Return type */,
    E extends unknown[] /* Selector extra arguments after state */,
    T extends string /* Action types */,
    P /* Payload types */,
    QR extends Record<Q, R> = Record<
        Q,
        R
    > /* Selector key to return type mapping */,
    QE extends Record<Q, E> = Record<
        Q,
        E
    > /* Selector key to arguments mapping */
> = { [K in Q]: Selector<S, QR[K], QE[K], T, P> };

type DuckSelectorGetStateKey = "$";
type DuckSelectors<Q> = Q | DuckSelectorGetStateKey;

type Duck<
    N extends string /* Duck name */,
    S /* State type */,
    T extends string /* Action types */,
    P /* Payload types */,
    C extends string /* Action creator keys */,
    Q extends string /* Selector keys */,
    R /* Selector return types */,
    E extends unknown[] /* Selector extra arguments */
> = {
    actions: ActionCreatorMapping<C, T, P, S>;
    actionTypes: T[];
    initialState: S;
    name: N;
    reducer: Reducer<S, T, P>;
    selectors: SelectorMapping<Record<N, S>, Q, R, E, T, P>;
};

type DuckReducerMapping<
    N extends string /* Duck name */,
    S /* State type */,
    T extends string /* Action types */,
    P /* Payload types */
> = Record<N, Reducer<S, T, P>>;

type RootDuck<
    N extends string /* Duck names */,
    S /* State types */,
    T extends string /* Action types */,
    P /* Payload types */,
    C extends string /* Action creator keys */,
    Q extends string /* Selector keys */,
    R /* Selector return types */,
    E extends unknown[] /* Selector extra arguments */
> = {
    actions: Record<N, ActionCreatorMapping<C, T, P, S>>;
    initialState: Record<N, S>;
    names: Set<N>;
    reducer: Reducer<Record<N, S>, T, P>;
    selectors: Record<N, SelectorMapping<Record<N, S>, Q, R, E, T, P>>;
};
