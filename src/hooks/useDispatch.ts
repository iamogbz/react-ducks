import * as React from "react";
import { bindActionCreator } from "../utils/bindActionCreators";
import { GlobalContext } from "..";

export function useDispatch<S, T extends string, P>(
    actionCreator: ActionCreator<T, P>,
    Context?: Context<S, T, P>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: any[]) => void {
    const { dispatch } = React.useContext(Context ?? GlobalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback(bindActionCreator(actionCreator, dispatch), [
        actionCreator,
        dispatch,
    ]);
}
