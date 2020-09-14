import * as React from "react";
import { GlobalContext } from "src/components/Context";
import { bindActionCreators } from "./bindActionCreators";

function defaultMergeProps<T extends string, P, I, K, J>(
    stateProps?: K,
    dispatchProps?: ActionDispatcherMapping<T, P>,
    ownProps?: I,
): J {
    return ({ ...ownProps, ...stateProps, ...dispatchProps } as unknown) as J;
}

function isFunction<F>(maybeFunction: F | unknown): maybeFunction is F {
    return typeof maybeFunction === "function";
}

function asMapDispatchToPropsFn<S, T extends string, P, I>(
    actionCreators?: ActionCreatorMapping<T, P, S>,
): MapDispatchToProps<T, P, I> | undefined {
    return (
        actionCreators &&
        function mapDispatchToProps(
            dispatch: ContextDispatch<T, P>,
        ): ActionDispatcherMapping<T, P> {
            return bindActionCreators(actionCreators, dispatch);
        }
    );
}

export function connect<
    S,
    I,
    T extends string,
    P,
    K,
    J extends I & K & ActionDispatcherMapping<T, P>
>(
    mapStateToProps?: MapStateToProps<S, I, K>,
    mapDispatchToProps?:
        | MapDispatchToProps<T, P, I, ActionDispatcherMapping<T, P>>
        | ActionCreatorMapping<T, P, S>,
    mergeProps?: (
        stateProps?: K,
        dispatchProps?: ActionDispatcherMapping<T, P>,
        ownProps?: I,
    ) => J,
    options?: ConnectOptions<S, T, P, I, K, J>,
): (component: ReactComponent<J>) => React.FunctionComponent<I> {
    const mapDispatchToPropsFn = isFunction<MapDispatchToProps<T, P, I>>(
        mapDispatchToProps,
    )
        ? mapDispatchToProps
        : asMapDispatchToPropsFn(mapDispatchToProps);

    return function wrapWithConnect(
        componentToWrap: ReactComponent<J>,
    ): React.FunctionComponent<I> {
        const WrappedComponent = (options?.pure
            ? React.memo(componentToWrap)
            : componentToWrap) as ReactComponent<J>;
        const wrappedComponentName =
            componentToWrap.displayName || componentToWrap.name || "Component";
        const displayName = `Connect(${wrappedComponentName})`;

        function WrapperComponent(
            props: I,
        ): React.ReactElement<J, typeof WrappedComponent> {
            const { state, dispatch } = React.useContext(
                options?.context ?? GlobalContext,
            );
            const stateProps = React.useMemo(
                () => mapStateToProps?.(state, props),
                [props, state],
            );
            const dispatchProps = React.useMemo(
                () => mapDispatchToPropsFn?.(dispatch, props),
                [dispatch, props],
            );
            const mergedProps = React.useMemo(
                () =>
                    (mergeProps ?? defaultMergeProps)(
                        stateProps,
                        dispatchProps,
                        props,
                    ),
                [dispatchProps, props, stateProps],
            );
            return <WrappedComponent {...mergedProps} />;
        }

        WrapperComponent.WrappedComponent = WrappedComponent;
        WrapperComponent.displayName = displayName;
        return WrapperComponent;
    };
}
