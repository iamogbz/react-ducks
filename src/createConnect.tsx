import React from "react";

export function createConnect<State>(
    Context: React.Context<ContextValue<State>>,
) {
    return function connect<R, S = R, D = R>(
        mapStateToProps?: MapStateToProps<State, R, S>,
        mapDispatchToProps?: MapDispatchToProps<ContextDispatch, R, D>,
    ) {
        return function wrapWithConnect(
            WrappedComponent:
                | React.FunctionComponent<R>
                | React.ComponentClass<R, State>,
        ): React.FunctionComponent<R> {
            const wrappedComponentName =
                WrappedComponent.displayName ||
                WrappedComponent.name ||
                "Component";
            const displayName = `Connect(${wrappedComponentName})`;

            function WrapperComponent(props: R): React.ReactElement {
                const { state, dispatch } = React.useContext(Context);
                const mappedStateProps = React.useMemo(
                    () => mapStateToProps?.(state, props),
                    [state, props],
                );
                const mappedDispatchToProps = React.useMemo(
                    () => mapDispatchToProps?.(dispatch, props),
                    [dispatch, props],
                );
                return (
                    <WrappedComponent
                        {...props}
                        {...mappedStateProps}
                        {...mappedDispatchToProps}
                    />
                );
            }

            WrapperComponent.WrappedComponent = WrappedComponent;
            WrapperComponent.displayName = displayName;
            return WrapperComponent;
        };
    };
}
