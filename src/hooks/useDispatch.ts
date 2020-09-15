import * as React from "react";
import { bindActionCreator } from "../utils/bindActionCreators";
import { GlobalContext } from "..";

export function useDispatch<S, T extends string, P>(
    actionCreator: Nullable<ActionCreator<T, P>>,
    Context?: Context<S, T, P>,
): (...args: P[]) => void {
    const { dispatch } = React.useContext(Context ?? GlobalContext);
    const boundActionCreator = React.useMemo(
        () => bindActionCreator(actionCreator, dispatch),
        [actionCreator, dispatch],
    );
    if (!boundActionCreator) {
        throw new Error(
            `Unable to bind action creator "${actionCreator}" to disptch`,
        );
    }
    return React.useCallback(boundActionCreator, [boundActionCreator]);
}
