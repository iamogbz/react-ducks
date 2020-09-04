type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

type ContextEnhancer<S> = (v: ContextValue<S>) => ContextValue<S>;

// this is equivalent to a redux store
type ContextValue<S, T extends string = string, P = unknown> = {
    dispatch: ContextDispatch<T, P>;
    enhancer: ContextEnhancer<S>;
    reducer: Reducer<S>;
    replaceReducer: (r: Reducer<NS>) => Context<NS>;
    state: S;
};

type Context<S, T extends string = string, P = unknown> = React.Context<
    ContextValue<S>
>;
