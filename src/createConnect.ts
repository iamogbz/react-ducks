import { connect } from "./utils/connect";

export function createConnect<S, I, T extends string, P, K>(
    Context?: Context<S, T, P>,
) {
    return function connectContext(
        mapStateToProps?: MapStateToProps<S, I, K>,
        mapDispatchToProps?:
            | MapDispatchToProps<T, P, I>
            | ActionCreatorMapping<T, P, S>,
        mergeProps?: (
            stateProps?: K,
            dispatchProps?: ActionDispatcherMapping<T, P>,
            ownProps?: I,
        ) => I & K & ActionDispatcherMapping<T, P>,
        options?: ConnectOptions<S, T, P, I, K>,
    ): (
        component: ReactComponent<I & K & ActionDispatcherMapping<T, P>>,
    ) => React.FunctionComponent<I> {
        return connect(mapStateToProps, mapDispatchToProps, mergeProps, {
            ...options,
            context: Context,
        });
    };
}
