type ContextDispatch<T extends string, P> = (
    action: Action<T, P>,
) => Action<T, P>;

// this is similar to a redux store
type ContextValue<S, T extends string, P> = {
    dispatch: ContextDispatch<T, P>;
    reducer: Reducer<S, T, P>;
    state: S;
};

type Context<S, T extends string, P> = React.Context<ContextValue<S, T, P>>;
