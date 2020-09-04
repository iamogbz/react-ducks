type Action<
    T extends string = string /* All possible action types */,
    P = unknown /* All possible payload types */
> = {
    type: T;
    payload?: P;
};

type ActionCreator<T extends string = string, P = unknown> = (
    payload?: P,
) => React.ReducerAction<React.Reducer<unknown, Action<T, P>>>;

type ActionCreatorMapping<T extends string = string, P = unknown> = Record<
    string,
    ActionCreator<T, P>
>;

type Reducer<S, T extends string = string, P = unknown> = React.Reducer<
    S /* All possible state types */,
    Action<T, P>
>;

type ReducerMapping<S, T extends string = string, P = unknown> = Record<
    string,
    Reducer<S, T, P>
>;

type Selector<
    S,
    R = unknown /* All possible selector return types */,
    T extends string = string,
    P = unknown
> = (state: React.ReducerState<Reducer<S, Action<T, P>>>) => R;

type SelectorMapping<
    S,
    R = unknown,
    T extends string = string,
    P = unknown
> = Record<string, Selector<S, R, T, P>>;

type Duck<S, T extends string = string, P = unknown> = {
    actions: ActionCreatorMapping<T, P>;
    initialState: S;
    name: string;
    reducer: Reducer<S, T, P>;
    selectors?: SelectorMapping<S, unknown, T, P>;
};

type RootDuck<
    S,
    D extends string = string /* All possible duck names */,
    T extends string = string,
    P = unknown
> = {
    actions: Record<D, ActionCreatorMapping<T, P>>;
    initialState: Record<D, S>;
    names: Set<D>;
    reducer: Reducer<Record<D, S>, T, P>;
    selectors: Record<D, SelectorMapping<S, unknown, T, P> | undefined>;
};
