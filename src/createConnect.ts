import { connect } from "./utils/connect";

export function createConnect<S, T extends string, P>(
    Context?: Context<S, T, P>,
) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function connectContext<I, K>(
        mapStateToProps?: MapStateToProps<S, I, K>,
        mapDispatchToProps?:
            | MapDispatchToProps<T, P, I>
            | ActionCreatorMapping<T, P, S>,
        mergeProps?: (
            stateProps?: K,
            dispatchProps?: ActionDispatcherMapping<T, P>,
            ownProps?: I,
        ) => I & K & ActionDispatcherMapping<T, P>,
        options?: ConnectOptions<S, T, P>,
    ) {
        return connect(mapStateToProps, mapDispatchToProps, mergeProps, {
            ...options,
            context: Context,
        });
    };
}
