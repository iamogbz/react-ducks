type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

type ContextValue<S, T extends string = string, P = unknown> = {
    dispatch: ContextDispatch<T, P>;
    reducer: Reducer<S>;
    state: S;
};

type Context<S> = React.Context<ContextValue<S>>;
