import * as React from "react";
import { bindActionCreator } from "../utils/bindActionCreators";
import { GlobalContext } from "..";

export function useDispatch<S, T extends Action>(
    actionCreator: DuckActionCreators<T>,
    Context?: Context<S, T>,
): ActionDispatcher<T> {
    const { dispatch } = React.useContext(Context ?? GlobalContext);
    const boundActionCreator = React.useMemo(
        () => bindActionCreator(actionCreator, dispatch),
        [actionCreator, dispatch],
    );
    return React.useCallback(boundActionCreator, [boundActionCreator]);
}
