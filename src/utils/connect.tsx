import * as React from "react";
import { GlobalContext } from "../components/Context";
import { bindActionCreators } from "./bindActionCreators";
import { isFunction } from "./isFunction";

function defaultMergeProps<T extends string, P, I, K, J>(
    stateProps?: K,
    dispatchProps?: ActionDispatcherMapping<T, P>,
    ownProps?: I,
): J {
    return ({ ...ownProps, ...stateProps, ...dispatchProps } as unknown) as J;
}

function asMapDispatchToPropsFn<S, T extends string, P, I>(
    actionCreators?: ActionCreatorMapping<T, P, S>,
): Nullable<MapDispatchToProps<T, P, I>> {
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
    options?: ConnectOptions<S, T, P>,
): (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>,
) => WrapperComponent<typeof component> {
    const mapDispatchToPropsFn = isFunction<MapDispatchToProps<T, P, I>>(
        mapDispatchToProps,
    )
        ? mapDispatchToProps
        : asMapDispatchToPropsFn(mapDispatchToProps);

    return function wrap(
        WrappedComponent: React.ComponentType<J>,
    ): WrapperComponent<typeof WrappedComponent> {
        const FinalComponent = (options?.pure
            ? React.memo(WrappedComponent)
            : WrappedComponent) as typeof WrappedComponent;
        const wrappedComponentName =
            WrappedComponent.displayName ||
            WrappedComponent.name ||
            "Component";
        const displayName = `Connect(${wrappedComponentName})`;

        function WrapperFunction<R = unknown>(
            props: I,
            ref?: React.Ref<R>,
        ): React.ReactElement {
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
            const finalProps = React.useMemo(
                () =>
                    options?.forwardRef ? { ...mergedProps, ref } : mergedProps,
                [mergedProps, ref],
            );
            return <FinalComponent {...finalProps} />;
        }
        WrapperFunction.displayName = displayName;

        const WrapperComponent = options?.forwardRef
            ? React.forwardRef(WrapperFunction)
            : WrapperFunction;

        Object.assign(WrapperComponent, { WrappedComponent });
        return WrapperComponent as WrapperComponent<typeof WrappedComponent>;
    };
}
