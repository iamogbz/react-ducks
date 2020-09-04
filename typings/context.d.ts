type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

// this is similar to a redux store
type ContextValue<S, T extends string = string, P = unknown> = {
    dispatch: ContextDispatch<T, P>;
    reducer: Reducer<S>;
    state: S;
};

type Context<S, T extends string = string, P = unknown> = React.Context<
    ContextValue<S>
>;
