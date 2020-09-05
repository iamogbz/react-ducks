import * as React from "react";
import { ActionTypes } from "../utils/actionTypes";
import { createAction } from "../createAction";

export function Provider<State>({
    children,
    Context,
}: React.PropsWithChildren<{ Context: Context<State> }>): React.ReactElement {
    const defaultValue = React.useContext(Context);

    const [state, reducerDispatch] = React.useReducer(
        defaultValue.reducer,
        defaultValue.state,
    );

    const dispatch = React.useCallback<ContextValue<State>["dispatch"]>(
        function wrappedDispatch(action) {
            reducerDispatch(action);
            return action;
        },
        [reducerDispatch],
    );

    const enhanced = React.useMemo<ContextValue<State>>(
        () => ({ ...defaultValue, dispatch }),
        [defaultValue, dispatch],
    );

    React.useEffect(
        function initialiseContext() {
            enhanced.dispatch(createAction(ActionTypes.INIT)());
        },
        [enhanced],
    );

    const value = React.useMemo<ContextValue<State>>(
        () => ({ ...enhanced, state }),
        [enhanced, state],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
