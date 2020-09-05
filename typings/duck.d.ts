type Action<
    T extends string /* All possible action types */,
    P /* All possible payload types */
> = {
    type: T;
    payload?: P;
};

type ActionCreator<T extends string, P, S> = (
    payload?: P,
) => React.ReducerAction<Reducer<S, T, P>>;

type ActionCreatorMapping<T extends string, P, S> = Record<
    string,
    ActionCreator<T, P, S>
>;

type Reducer<S, T extends string, P> = React.Reducer<
    S /* All possible state types */,
    Action<T, P>
>;

type ReducerMapping<S, T extends string, P> = Record<string, Reducer<S, T, P>>;

type Selector<
    S,
    R /* All possible selector return types */,
    T extends string,
    P
> = (state: React.ReducerState<Reducer<S, Action<T, P>>>) => R;

type SelectorMapping<
    S,
    R,
    T extends string,
    P,
    Q extends string /* All possible selector names*/
> = Record<string, Selector<S, R, T, P>>;

type Duck<
    S = unknown,
    N extends string = string /* Duck name */,
    T extends string = string,
    P = unknown,
    R = unknown,
    Q extends string = string
> = {
    actions: ActionCreatorMapping<T, P>;
    initialState: S;
    name: N;
    reducer: Reducer<S, T, P>;
    selectors?: SelectorMapping<S, R, T, P, Q>;
};

type RootDuck<
    S = unknown,
    N extends string = string /* All possible duck names */,
    T extends string = string,
    P = unknown,
    R = unknown,
    Q extends string = string
> = {
    actions: Record<N, ActionCreatorMapping<T, P, S>>;
    initialState: Record<N, S>;
    names: Set<N>;
    reducer: Reducer<Record<N, S>, T, P>;
    selectors: Record<N, SelectorMapping<S, R, T, P, Q> | undefined>;
};
