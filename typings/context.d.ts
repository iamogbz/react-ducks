type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

type ContextValue<S, T extends string = string, P = unknown> = {
    dispatch: ContextDispatch<T, P>;
    reducer: Reducer<S>;
    state: S;
};

type MapStateToProps<S, R = unknown, U = R> = (
    state: S,
    ownProps?: React.PropsWithChildren<R>,
) => React.PropsWithChildren<U>;

type MapDispatchToProps<D, R = unknown, U = R> = (
    dispatch: D,
    ownProps?: React.PropsWithChildren<R>,
) => React.PropsWithChildren<U>;
