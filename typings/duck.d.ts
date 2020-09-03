type Action<T extends string = string, P = unknown> = {
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
    S,
    Action<T, P>
>;

type ReducerMapping<S, T extends string = string, P = unknown> = Record<
    string,
    Reducer<S, T, P>
>;

type Selector<S, T extends string = string, P = unknown> = (
    state: React.ReducerState<React.Reducer<S, Action<T, P>>>,
) => unknown;

type Duck<S, T extends string = string, P = unknown> = {
    actions: ActionCreatorMapping;
    initialState: S;
    name: string;
    reducer: Reducer<S, T, P>;
    selectors?: Record<string, Selector<S>>;
};
