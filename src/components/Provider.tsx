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

    const [value, enhancer] = React.useMemo<
        [ContextValue<S, T, P>, ContextEnhance<S, T, P>?]
    >(
        function splitValueAndEnhancer() {
            const { enhancer, ...unenhanced } = root;
            return [{ ...unenhanced, dispatch, getState, state }, enhancer];
        },
        [dispatch, getState, root, state],
    );

    const observable = useObservable(useGetter(value));

    React.useEffect(function enhanceAndIntialise() {
        const enhanced = enhancer?.(observable) ?? observable;
        enhanced.dispatch(createAction<T, P, S>(ActionTypes.INIT as T)());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Context.Provider value={observable}>{children}</Context.Provider>;
}
