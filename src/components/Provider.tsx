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

    React.useEffect(function initialiseReducer() {
        reducerDispatch(createAction(ActionTypes.INIT)());
    }, []);

    const dispatch = React.useCallback<ContextValue<State>["dispatch"]>(
        function wrappedDispatch(action) {
            reducerDispatch(action);
            return action;
        },
        [reducerDispatch],
    );

    const value = React.useMemo(() => ({ ...defaultValue, dispatch, state }), [
        defaultValue,
        dispatch,
        state,
    ]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
