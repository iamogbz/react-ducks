import * as React from "react";
import { ActionTypes } from "../utils/actionTypes";
import { createAction } from "../createAction";
import { useGetter } from "../hooks/useGetter";
import { useObservable } from "../hooks/useObservable";

export function Provider<S, T extends string, P>({
    children,
    Context,
}: React.PropsWithChildren<{ Context: Context<S, T, P> }>): React.ReactElement {
    const root = React.useContext(Context);

    const [state, reducerDispatch] = React.useReducer(root.reducer, root.state);
    const getState = useGetter(state);

    const dispatch = React.useCallback<ContextDispatch<T, P>>(
        async function contextDispatch(action) {
            reducerDispatch(action);
            return action;
        },
        [reducerDispatch],
    );

    const enhanced = React.useMemo<ContextValue<S, T, P>>(
        function enhance() {
            const { enhancer, ...value } = root;
            Object.assign(value, { dispatch, getState });
            return enhancer?.(value) ?? value;
        },
        [dispatch, getState, root],
    );

    React.useEffect(
        function initialiseContext() {
            enhanced.dispatch(createAction<T, P, S>(ActionTypes.INIT as T)());
        },
        [enhanced],
    );

    const value = React.useMemo<ContextValue<S, T, P>>(
        function getValue() {
            return { ...enhanced, state };
        },
        [enhanced, state],
    );

    const observable = useObservable(useGetter(value));

    const observableValue = React.useMemo(
        function getSubscriptable() {
            return { ...value, ...observable };
        },
        [observable, value],
    );

    return (
        <Context.Provider value={observableValue}>{children}</Context.Provider>
    );
}
