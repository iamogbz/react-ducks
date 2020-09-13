import * as React from "react";
import { GlobalContext } from "../components/Context";

export function useDispatch<S, T extends string, P>(
    actionCreator: ActionCreator<T, P>,
    Context?: Context<S, T, P>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: any[]) => void {
    const { dispatch } = React.useContext(Context ?? GlobalContext);
    return React.useCallback(
        function dispatchAction(...args) {
            dispatch(actionCreator(...args));
        },
        [actionCreator, dispatch],
    );
}
