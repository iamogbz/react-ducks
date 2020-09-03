import React from "react";
import { createAction } from "./createAction";

const randomString = (): string =>
    Math.random().toString(36).substring(7).split("").join(".");

const ActionTypes = {
    INIT: `@@context/INIT${randomString()}`,
};

export function createRootProvider<State>(
    Context: React.Context<ContextValue<State>>,
) {
    return function RootProvider({
        children,
    }: {
        children?: React.ReactNode;
    }): React.ReactElement {
        const defaultValue = React.useContext(Context);

        const [state, reducerDispatch] = React.useReducer(
            defaultValue.reducer,
            defaultValue.state,
        );

        React.useEffect(
            () => reducerDispatch(createAction(ActionTypes.INIT)()),
            [],
        );

        const dispatch = React.useCallback<ContextValue<State>["dispatch"]>(
            (action) => (reducerDispatch(action), action),
            [],
        );

        const value = React.useMemo(
            () => ({ ...defaultValue, dispatch, state }),
            [defaultValue],
        );

        return <Context.Provider value={value}>{children}</Context.Provider>;
    };
}
