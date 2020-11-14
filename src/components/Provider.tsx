import * as React from "react";
import { ActionTypes } from "../utils/actionTypes";
import { createAction } from "../createAction";
import { useAccessor } from "../hooks/useAccessor";
import { useObservable } from "../hooks/useObservable";

export function Provider<
    State = unknown,
    T extends Action = Action,
    Value extends ContextValue<State, T> = ContextValue<State, T>
>({
    children,
    Context,
}: React.PropsWithChildren<{
    Context: Context<State, T>;
}>): React.ReactElement {
    const root = React.useContext(Context);

    const [state, reducerDispatch] = React.useReducer(root.reducer, root.state);
    const [getState] = useAccessor(state);

    const dispatch = React.useCallback(
        async function contextDispatch(action) {
            reducerDispatch(action);
            return action;
        },
        [reducerDispatch],
    );

    const unenhanced = React.useMemo(
        function getUnenhanced() {
            const { enhancer: _, ...value } = root;
            return Object.assign(value, { dispatch, getState });
        },
        [dispatch, getState, root],
    );

    // Get a reference that will be set once any supplied enhancer is run.
    const [getEnhanced, setEnhanced] = useAccessor<Value>();

    // This is the final value to be observed.
    // The enhanced value will be given below.
    const value = React.useMemo(
        function getValue() {
            return { ...unenhanced, ...getEnhanced(), state };
        },
        [getEnhanced, state, unenhanced],
    );
    // This is the observable context value that will be enhanced once.
    const [observable, publish] = useObservable(value);

    // This is called only on the initial render or if the enhancer changes.
    // It sets the enhanced value that will supplement the unenhanced value
    // on subsequent renders. It needs to be called after an observable is
    // created from the value to allow the enhancer subscribe to the value.
    React.useEffect(
        function enhanceAndIntialise() {
            const enhanced = root.enhancer?.(observable) ?? observable;
            setEnhanced!(enhanced as Value);
            enhanced.dispatch(createAction(ActionTypes.INIT)() as T);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [root.enhancer],
    );

    // Notify only on a change to the observed value. This is scheduled after
    // the enhance effect to ensure the first render notifies all subscribers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(publish, [observable]);

    return <Context.Provider value={observable}>{children}</Context.Provider>;
}
