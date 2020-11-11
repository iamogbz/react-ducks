type Action<
    T extends string = string /* Action type */,
    P = unknown /* Payload type */
> = {
    type: T;
    payload?: P;
} & Record<string, unknown>;

interface ActionCreator<
    T extends string = string /* Action Type */,
    P = unknown /* Payload Type */,
    S = unknown /* State type */
> {
    (payload?: P): React.ReducerAction<Reducer<S, T, P>, Action<T, P>>;
    type: T;
}

type ActionCreatorMapping<
    TP extends Record<string, unknown> = Record<
        string,
        unknown
    > /* Action type to payload mapping */,
    CT extends Record<string, keyof TP> = Record<
        keyof TP,
        keyof TP
    > /* Action creator key to type mapping */,
    S = unknown /* State type */
> = { [C in keyof CT]: Nullable<ActionCreator<CT[C], TP[CT[C]], S>> };

type ActionDispatcher<
    P extends unknown[] = unknown[] /* Dispatcher arguments, usually first argument is the payload */
> = (...args: P) => void;

type Reducer<
    S = unknown /* State type */,
    TP extends Record<string, unknown> = Record<
        string,
        unknown
    > /* Action type to payload mapping */
> = React.Reducer<
    S,
    {
        [T in keyof TP]: Action<T, TP[T]>;
    }[keyof TP]
>;

type ActionReducerMapping<
    S = unknown,
    T extends string = string,
    P = unknown,
    C extends string = T
> = Record<C, Reducer<S, T, P>>;

type Selector<
    S = unknown,
    R = unknown /* All possible selector return types */,
    T extends string = string,
    P = unknown,
    E extends unknown[] = unknown[]
> = (state: React.ReducerState<Reducer<S, Action<T, P>>>, ...args: E) => R;

type SelectorMapping<
    S = unknown,
    R = unknown,
    T extends string = string,
    P = unknown,
    Q extends string = string /* All possible selector names*/
> = Record<Q, Selector<S, R, T, P>>;

type DuckSelectors<Q> = Q | "$";

type Duck<
    S = unknown,
    N extends string = string /* Duck name */,
    T extends string = string,
    P = unknown,
    R = unknown,
    Q extends string = string,
    U extends string = string
> = {
    actions: ActionCreatorMapping<Record<T, P>, Record<U, T>, S>;
    actionTypes: T[];
    initialState: S;
    name: N;
    reducer: Reducer<S, Record<T, P>>;
    selectors: SelectorMapping<Record<N, S>, R, T, P, DuckSelectors<Q>>;
};

type DuckReducerMapping<
    S = unknown,
    N extends string = string,
    T extends string = string,
    P = unknown
> = Record<N, Reducer<S, Record<T, P>>>;

type RootDuck<
    S = unknown,
    N extends string = string /* All possible duck names */,
    U extends string = string,
    V extends string = string,
    T extends U | V = string,
    P = unknown,
    R = unknown,
    Q extends string = string
> = {
    actions: Record<N, ActionCreatorMapping<Record<T, P>, Record<U, T>, S>>;
    initialState: Record<N, S>;
    names: Set<N>;
    reducer: Reducer<Record<N, S>, Record<T, P>>;
    selectors: Record<N, Nullable<SelectorMapping<Record<N, S>, R, T, P, Q>>>;
};
