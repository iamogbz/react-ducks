import * as React from "react";
import { ActionTypes } from "../utils/actionTypes";
import { createAction } from "../createAction";
import { useGetter } from "../hooks/useGetter";

export function Provider<S, T extends string, P>({
    children,
    Context,
}: React.PropsWithChildren<{ Context: Context<S, T, P> }>): React.ReactElement {
    const root = React.useContext(Context);

    const [state, reducerDispatch] = React.useReducer(root.reducer, root.state);
    const getState = useGetter(state);

    const dispatch = React.useCallback<ContextValue<S, T, P>["dispatch"]>(
        function wrappedDispatch(action) {
            reducerDispatch(action);
            return action;
        },
        [reducerDispatch],
    );

    const enhanced = React.useMemo<ContextValue<S, T, P>>(() => {
        const { enhancer, ...value } = root;
        Object.assign(value, { dispatch, getState });
        return enhancer?.(value) ?? value;
    }, [dispatch, getState, root]);

    React.useEffect(
        function initialiseContext() {
            enhanced.dispatch(createAction<T, P, S>(ActionTypes.INIT as T)());
        },
        [enhanced],
    );

    const value = React.useMemo<ContextValue<S, T, P>>(
        () => ({ ...enhanced, state }),
        [enhanced, state],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
